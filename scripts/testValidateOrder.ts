import { loadProductCatalog, parseEmail } from "../src/server/utils/emailParser";
import { validateOrder } from "../src/server/utils/validateOrder";
import * as path from "path";

async function testValidateOrder() {
  try {
    // Path to the product catalog CSV file
    const csvFilePath = "/Users/elliot/Downloads/Product_Catalog.csv";

    console.log("Loading product catalog...");
    await loadProductCatalog(csvFilePath);
    console.log("Product catalog loaded successfully!");

    // Example email text
    const emailText = `
      2 x Bed TRÄNBERG 858
      5 x Dining FJÄRDAL 292
      10 x Nonexistent SKU
      Ship to: 45 Königstraße, Stuttgart, Germany
      Requested delivery date: July 1, 2025
    `;

    console.log("Parsing email...");
    const parsedOrder = parseEmail(emailText);
    console.log("Parsed Order:", JSON.stringify(parsedOrder, null, 2));

    console.log("Validating order...");
    const validationResult = await validateOrder(parsedOrder);
    console.log("Validation Result:", JSON.stringify(validationResult, null, 2));
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    } else {
      console.error("An unknown error occurred:", error);
    }
  }
}

testValidateOrder();
