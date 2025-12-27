import express from "express";
import { getAllUsers, getUserById } from "../controllers/userController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Protected routes - all authenticated users can view users
router.get("/", requireAuth, getAllUsers);
router.get("/:id", requireAuth, getUserById);

export default router;
