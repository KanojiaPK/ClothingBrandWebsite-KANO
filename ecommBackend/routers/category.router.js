import express from "express";
import {
  addCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../controllers/category.controller.js";

const router = express.Router();

router.post("/add-category", addCategory);
router.get("/get-categories", getCategories);
router.get("/get-category/:categoryid", getCategory);
router.put("/update-category/:categoryid", updateCategory);
router.delete("/delete-category/:categoryid", deleteCategory);
export default router;