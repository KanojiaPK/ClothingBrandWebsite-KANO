import express from "express";
import mongoose from "mongoose";
import userRouter from "./routers/user.router";
import categoryRouter from "./routers/category.router";
import productRouter from "./routers/product.router";
import cartRouter from "./routers/cart.router";
const app = express();
const PORT = 8002;

// body parser
app.use(express.json());

// serving static files
app.use("/uploads", express.static("uploads"));

// DB connectivity
mongoose
  .connect("mongodb://127.0.0.1:27017/mynewdb")
  .then(() => console.log("DB Connected!"));

app.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // Replace with your React app's URL // orgin as in frontend
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/cart", cartRouter);
