//routes/auth.routes.js
import express from "express";
import { loginPostController } from "../controllers/auth.controller.js";

const router = express.Router();

// POST /api/auth/login - Handles login with JSON response and JWT cookie
router.post("/login", loginPostController);

export default router;