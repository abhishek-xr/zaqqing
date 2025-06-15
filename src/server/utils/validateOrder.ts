import FuzzySet from "fuzzyset";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function logAllDatabaseSKUs() {
  const products = await prisma.product.findMany({ select: { productCode: true } });
  console.log("Database SKUs:", products.map((p) => p.productCode));
}

async function getFuzzySetFromDatabase(): Promise<{ fuzzySet: FuzzySet, nameToCodeMap: Record<string, string> }> {
  const products = await prisma.product.findMany({ select: { productName: true, productCode: true } });
  const nameToCodeMap: Record<string, string> = {};
  const productNames = products.map((p) => {
    const normalizedName = p.productName.toLowerCase().trim();
    nameToCodeMap[normalizedName] = p.productCode;
    return normalizedName;
  });

  console.log("Normalized Product Names for FuzzySet:", productNames); // Debug log
  return { fuzzySet: FuzzySet(productNames), nameToCodeMap };
}

type ValidationResult = {
  validItems: {
    sku: string;
    quantity: number;
    valid: boolean;
    issues: string[];
    suggestions: string[];
  }[];
  issues: string[];
};

export async function validateOrder(parsedOrder: {
  skus: { sku: string; quantity: number }[];
}): Promise<ValidationResult> {
  const { fuzzySet, nameToCodeMap } = await getFuzzySetFromDatabase(); // Get FuzzySet and mapping
  const validItems = [];
  const issues = [];

  for (const { sku, quantity } of parsedOrder.skus) {
    const normalizedSku = sku.toLowerCase().trim(); // Normalize SKU
    const fuzzyMatch = fuzzySet.get(normalizedSku);

    console.log("Parsed SKU:", normalizedSku); // Debug log
    console.log("Fuzzy Match:", fuzzyMatch); // Debug log

    if (!fuzzyMatch || fuzzyMatch[0][0] < 0.8) {
      validItems.push({
        sku,
        quantity,
        valid: false,
        issues: ["SKU not found in catalog"],
        suggestions: [],
      });
      issues.push(`SKU not found: ${sku}`);
      continue;
    }

    const matchedProductName = fuzzyMatch[0][1]; // Get the best match
    const productCode = nameToCodeMap[matchedProductName]; // Retrieve product code

    const product = await prisma.product.findFirst({
      where: { productCode },
    });

    if (!product) {
      validItems.push({
        sku,
        quantity,
        valid: false,
        issues: ["SKU not found in catalog"],
        suggestions: [],
      });
      issues.push(`SKU not found: ${sku}`);
      continue;
    }

    const itemIssues = [];
    const suggestions = [];

    // Check MOQ
    if (quantity < product.minOrderQty) {
      itemIssues.push(`MOQ not met (minimum: ${product.minOrderQty})`);
    }

    // Check stock availability
    if (quantity > product.stock) {
      itemIssues.push(`Insufficient stock (available: ${product.stock})`);
      suggestions.push(`Reduce quantity to ${product.stock}`);
    }

    validItems.push({
      sku: product.productCode, // Use the exact product code from the database
      quantity,
      valid: itemIssues.length === 0,
      issues: itemIssues,
      suggestions,
    });
  }

  return { validItems, issues };
}
