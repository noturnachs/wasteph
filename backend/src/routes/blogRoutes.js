import express from "express";
import * as blogController from "../controllers/blogController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", blogController.getPublishedPosts);
router.get("/category/:category", blogController.getPostsByCategory);
router.get("/:slug", blogController.getPublishedPostBySlug);

// Admin routes (protected)
router.get("/admin/stats", requireAuth, blogController.getBlogStats);
router.get("/admin/all", requireAuth, blogController.getAllPosts);
router.get("/admin/:id", requireAuth, blogController.getPostById);
router.post("/admin", requireAuth, blogController.createPost);
router.put("/admin/:id", requireAuth, blogController.updatePost);
router.delete("/admin/:id", requireAuth, blogController.deletePost);

export default router;
