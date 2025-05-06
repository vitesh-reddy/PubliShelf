import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import styles from "../public/css/styles.js";

const router = express.Router();

// Admin Signup (No authentication required)
router.get("/signup", (req, res) => res.render("auth/signup-admin", { styles: styles }));

// Admin Dashboard (Protected Route)
import { getAllPublishers } from "../services/publisherService.js";

router.get("/dashboard", protect, async (req, res) => {
  const publishers = await getAllPublishers();
  res.render("admin/dashboard", { publishers });
});

export default router;