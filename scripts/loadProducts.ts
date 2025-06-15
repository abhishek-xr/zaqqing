import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import csvParser from "csv-parser";

const prisma = new PrismaClient();

async function loadProducts() {
  const csvFilePath = "/Users/elliot/Downloads/Product_Catalog.csv";
  const products: {
    productCode: string;
    productName: string;
    priceCents: number;
    stock: number;
    minOrderQty: number;
    description: string;
  }[] = [];

  // Read and parse the CSV file
  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on("data", (row) => {
        console.log("Parsed Row:", row); // Debug log
        if (
          row.Product_Code &&
          row.Product_Name &&
          row.Price &&
          row.Available_in_Stock &&
          row.Min_Order_Quantity
        ) {
          products.push({
            productCode: row.Product_Code.trim(),
            productName: row.Product_Name.trim(),
            priceCents: Math.round(parseFloat(row.Price) * 100), // Convert price to cents
            stock: parseInt(row.Available_in_Stock, 10),
            minOrderQty: parseInt(row.Min_Order_Quantity, 10),
            description: row.Description?.trim() || "",
          });
        }
      })
      .on("end", async () => {
        console.log("Parsed Products:", products); // Debug log
        try {
          // Insert or update products in the database
          for (const product of products) {
            console.log("Upserting Product:", product); // Debug log
            await prisma.product.upsert({
              where: { productCode: product.productCode },
              update: {
                productName: product.productName,
                priceCents: product.priceCents,
                stock: product.stock,
                minOrderQty: product.minOrderQty,
                description: product.description,
              },
              create: product,
            });
          }
          console.log("Products loaded successfully!");
          resolve();
        } catch (error) {
          console.error("Error loading products:", error);
          reject(error);
        }
      })
      .on("error", (error) => {
        console.error("Error reading CSV file:", error);
        reject(error);
      });
  });
}

loadProducts()
  .then(() => {
    console.log("Seeding completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
