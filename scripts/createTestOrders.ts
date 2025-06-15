import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createTestOrders() {
  try {
    // Fetch valid product IDs from the database
    const deskProduct = await prisma.product.findUnique({
      where: { productCode: "DSK-0001" }, // Replace with a valid productCode
    });
    const diningProduct = await prisma.product.findUnique({
      where: { productCode: "DCH-0077" }, // Replace with a valid productCode
    });

    if (!deskProduct || !diningProduct) {
      throw new Error("Required products not found in the database.");
    }

    const order1 = await prisma.order.create({
      data: {
        customerName: "Alice",
        deliveryDate: new Date("2025-07-01"),
        deliveryAddress: "123 Main Street, Berlin, Germany",
        items: {
          create: [
            {
              productId: deskProduct.id, // Use the valid product ID
              qty: 2,
              valid: true,
              issues: [],
              suggestions: [],
              confidence: 1.0,
            },
          ],
        },
      },
    });

    const order2 = await prisma.order.create({
      data: {
        customerName: "Bob",
        deliveryDate: new Date("2025-07-01"),
        deliveryAddress: "456 Elm Street, Munich, Germany",
        items: {
          create: [
            {
              productId: diningProduct.id, // Use the valid product ID
              qty: 5,
              valid: false,
              issues: ["MOQ not met (minimum: 10)"],
              suggestions: [],
              confidence: 0.9,
            },
          ],
        },
      },
    });

    console.log("Test orders created:", { order1, order2 });
  } catch (error) {
    console.error("Error creating test orders:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestOrders();
