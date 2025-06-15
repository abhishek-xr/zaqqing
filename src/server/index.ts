import express from "express";
import bodyParser from "body-parser";
import orderRouter from "./routers/order";
import productRouter from "./routers/product";

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Routers
app.use("/api/orders", orderRouter);
app.use("/api/products", productRouter);

// Health check endpoint
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
