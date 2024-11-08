import express from "express";
import {
  addUser,
  deleteUser,
  getUser,
  login,
  signUp,
  getUsers,
  updateUser,
} from "../controllers/user.controller";

const router = express.Router();

router.post("/add-user", addUser);
router.get("/get-users", getUsers);
router.get("/get-user/:userid", getUser);
router.put("/update-user/:userid", updateUser);
router.delete("/delete-user/:userid", deleteUser);

// Auth
router.post("/sign-up", signUp);
router.post("/login", login);

export default router;
