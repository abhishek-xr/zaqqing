import { Router, Request, Response } from "express";
import { PrismaClient, Product } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// GET /api/products
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const products: Product[] = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/products/:id
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/products
router.post("/", async (req: Request, res: Response): Promise<void> => {
  const { productCode, productName, priceCents, stock, minOrderQty, description } = req.body;

  try {
    const newProduct = await prisma.product.create({
      data: {
        productCode,
        productName,
        priceCents,
        stock,
        minOrderQty,
        description,
      },
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/products/:id
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await prisma.product.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
