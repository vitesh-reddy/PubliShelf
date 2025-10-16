//routes/admin.routes.js
import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { getAdminDashboard, banPublisher } from "../controllers/admin.controller.js";

const router = express.Router();

// GET /api/admin/dashboard - Fetch admin dashboard data (protected for admin role)
router.get("/dashboard", protect, authorize("admin"), getAdminDashboard);

// DELETE /api/admin/publishers/:id/ban - Ban a publisher
router.delete("/publishers/:id/ban", protect, authorize("admin"), banPublisher);

export default router;