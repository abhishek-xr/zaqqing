import FuzzySet = require("fuzzyset");
import * as fs from "fs";
import * as path from "path";
import csvParser from "csv-parser";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type ParsedOrder = {
  skus: { sku: string; quantity: number }[];
  deliveryDetails: { address: string; date: string };
  issues: string[];
};

let fuzzySet: FuzzySet | null = null;

// Dynamically load the product catalog from a CSV file
export async function loadProductCatalog(csvFilePath: string): Promise<void> {
  const productNames: string[] = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on("data", (row: { Product_Name?: string }) => {
        if (row.Product_Name) {
          productNames.push(row.Product_Name.trim().toLowerCase()); // Normalize SKUs
        }
      })
      .on("end", () => {
        fuzzySet = FuzzySet(productNames);
        console.log("Loaded SKUs:", productNames); // Debug log
        resolve();
      })
      .on("error", (error: Error) => {
        reject(error);
      });
  });
}

// Load product catalog from the database
export async function loadProductCatalogFromDB(): Promise<void> {
  const products = await prisma.product.findMany({ select: { productCode: true } });
  const productCodes = products.map((p) => p.productCode.toLowerCase().trim()); // Normalize SKUs
  fuzzySet = FuzzySet(productCodes);
  console.log("Loaded SKUs into FuzzySet:", productCodes); // Debug log
}

export function parseEmail(emailText: string): ParsedOrder {
  if (!fuzzySet) {
    throw new Error("Product catalog not loaded. Call loadProductCatalog first.");
  }

  const skus: { sku: string; quantity: number }[] = [];
  const issues: string[] = [];
  let deliveryAddress = "";
  let deliveryDate = "";

  // Split email into lines
  const lines = emailText.split("\n");

  for (const line of lines) {
    // Match SKU and quantity
    const skuMatch = line.match(/(\d+)\s*x\s*(.+)/i);
    if (skuMatch) {
      const quantity = parseInt(skuMatch[1], 10);
      const rawSku = skuMatch[2].trim().toLowerCase(); // Normalize SKU
      const fuzzyMatch = fuzzySet.get(rawSku);

      console.log("Parsed SKU:", rawSku); // Debug log
      console.log("Fuzzy Match:", fuzzyMatch); // Debug log

      if (fuzzyMatch && fuzzyMatch[0][0] > 0.8) { // Adjusted threshold
        skus.push({ sku: fuzzyMatch[0][1], quantity });
      } else {
        issues.push(`Unrecognized SKU: ${rawSku}`);
      }
    }

    // Match delivery address
    const addressMatch = line.match(/Ship to:|Delivery address:/i);
    if (addressMatch) {
      deliveryAddress = line.replace(/Ship to:|Delivery address:/i, "").trim();
    }

    // Match delivery date
    const dateMatch = line.match(/Before:|Requested delivery date:/i);
    if (dateMatch) {
      deliveryDate = line.replace(/Before:|Requested delivery date:/i, "").trim();
    }
  }

  // Flag missing details
  if (!deliveryAddress) issues.push("Missing delivery address.");
  if (!deliveryDate) issues.push("Missing delivery date.");

  return {
    skus,
    deliveryDetails: { address: deliveryAddress, date: deliveryDate },
    issues,
  };
}
