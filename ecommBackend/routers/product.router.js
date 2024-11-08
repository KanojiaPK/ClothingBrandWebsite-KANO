import express from "express";
import {
  addProduct,
  deleteProduct,
  getProduct,
  getProducts,
  getProductsAggr,
  updateProduct,
} from "../controllers/product.controller";
const router = express.Router();

router.post("/add-product", addProduct);
router.get("/get-products", getProducts);
router.get("/get-products-aggr", getProductsAggr);
router.get("/get-product/:productid", getProduct);
router.put("/update-product/:productid", updateProduct);
router.delete("/delete-product/:productid", deleteProduct);

export default router;
