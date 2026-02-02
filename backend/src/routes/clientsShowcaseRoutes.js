import express from "express";
import multer from "multer";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { uploadObject } from "../services/s3Service.js";
import {
  getActiveClientsShowcase,
  getAllClientsShowcase,
  getClientsShowcaseById,
  createClientsShowcase,
  updateClientsShowcase,
  deleteClientsShowcase,
  toggleClientsShowcaseStatus,
  uploadLogo,
} from "../controllers/clientsShowcaseController.js";

const router = express.Router();

// Multer configuration for client showcase logos
const uploadClientLogo = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit for logos
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, WebP, and SVG images are allowed"), false);
    }
  },
});

// S3 upload middleware for client logos
const s3UploadClientLogo = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(); // No file uploaded, continue
    }

    const clientShowcaseId = req.params.id;
    const fileName = `${Date.now()}-${req.file.originalname}`;
    const s3Key = `clients-showcase/logos/${clientShowcaseId}/${fileName}`;

    await uploadObject(s3Key, req.file.buffer, req.file.mimetype);

    // Attach S3 key to request body
    req.body.logo = s3Key;
    req.body.logoName = req.file.originalname;

    next();
  } catch (error) {
    next(error);
  }
};

// Public routes
router.get("/", getActiveClientsShowcase);

// Protected routes (require authentication)
router.get("/all", requireAuth, getAllClientsShowcase);
router.get("/:id", requireAuth, getClientsShowcaseById);
router.post("/", requireAuth, createClientsShowcase);
router.put("/:id", requireAuth, updateClientsShowcase);
router.delete("/:id", requireAuth, deleteClientsShowcase);
router.patch("/:id/toggle", requireAuth, toggleClientsShowcaseStatus);

// Logo upload route
router.post(
  "/:id/upload-logo",
  requireAuth,
  requireRole("super_admin", "social_media"),
  uploadClientLogo.single("logo"),
  s3UploadClientLogo,
  uploadLogo
);

export default router;
