import express from "express";
import {
  addToCart,
  deleteCartItem,
  getCartItems,
  updateQuantity,
} from "../controllers/cart.controller";

const router = express.Router();

router.post("/add-to-cart", addToCart);
router.put("/update-quantity/:item_id", updateQuantity);
router.delete("/delete-cart-item/:item_id", deleteCartItem);
router.get("/get-cart-items/:user_id", getCartItems);
export default router;
