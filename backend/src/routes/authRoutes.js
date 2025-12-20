import express from "express";
import {
  register,
  login,
  logout,
  getCurrentUser,
  changePassword,
} from "../controllers/authController.js";
import { requireAuth, optionalAuth } from "../middleware/auth.js";
import {
  loginValidation,
  registerValidation,
  validate,
} from "../middleware/validation.js";
import { body } from "express-validator";

const router = express.Router();

// Public routes
router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);

// Protected routes
router.post("/logout", optionalAuth, logout);
router.get("/me", requireAuth, getCurrentUser);
router.post(
  "/change-password",
  requireAuth,
  [
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 8 })
      .withMessage("New password must be at least 8 characters long"),
  ],
  validate,
  changePassword
);

export default router;
