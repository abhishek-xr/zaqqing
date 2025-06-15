import { Router, Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { validateOrder } from "../utils/validateOrder";
import { parseEmail, loadProductCatalog } from "../utils/emailParser";

const prisma = new PrismaClient();
const router = Router();

// Load product catalog on server startup
const csvFilePath = "/Users/elliot/Downloads/Product_Catalog.csv"; // Replace with the actual path to your CSV file
loadProductCatalog(csvFilePath)
  .then(() => console.log("Product catalog loaded successfully"))
  .catch((err) => console.error("Failed to load product catalog:", err.message));

// POST /api/orders/validate
router.post("/validate", async (req: Request, res: Response): Promise<void> => {
  try {
    const { emailText } = req.body;

    if (!emailText) {
      res.status(400).json({ error: "Email text is required" });
      return;
    }

    const parsedOrder = parseEmail(emailText);
    const validationResult = await validateOrder(parsedOrder);

    res.json({ parsedOrder, validationResult });
  } catch (error) {
    console.error("Error validating order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/orders/merge
router.post("/merge", async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderIds, customerName, deliveryDate, deliveryAddress } = req.body;

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      res.status(400).json({ error: "Order IDs are required" });
      return;
    }

    console.log("Order IDs received for merging:", orderIds); // Debug log

    const orders = await prisma.order.findMany({
      where: { id: { in: orderIds } },
      include: { items: true },
    });

    console.log("Orders retrieved for merging:", orders); // Debug log

    if (orders.length !== orderIds.length) {
      res.status(404).json({ error: "One or more orders not found" });
      return;
    }

    const mergedItems: Prisma.OrderItemCreateManyOrderInput[] = orders.flatMap((order) =>
      order.items.map((item) => ({
        productId: item.productId,
        qty: item.qty,
        valid: item.valid,
        issues: item.issues,
        suggestions: item.suggestions,
        confidence: item.confidence,
      }))
    );

    const newOrder = await prisma.order.create({
      data: {
        customerName,
        deliveryDate: new Date(deliveryDate),
        deliveryAddress,
        items: {
          createMany: { data: mergedItems },
        },
      },
    });

    await prisma.order.deleteMany({ where: { id: { in: orderIds } } });

    res.json(newOrder);
  } catch (error) {
    console.error("Error merging orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/orders
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
