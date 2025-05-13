import express from "express";
import { loginGetController, loginPostController } from "../controllers/authController.js";

const router = express.Router();


router.get("/login", loginGetController);
router.post("/login", loginPostController);

export default router;
