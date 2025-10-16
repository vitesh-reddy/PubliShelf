//routes/publisher.routes.js
import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import {
  getPublisherDashboard,
  createPublisherSignup,
  publishBook,
  sellAntique,
} from "../controllers/publisher.controller.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "publishelf/books",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

const router = express.Router();

router.get("/dashboard", protect, getPublisherDashboard);
router.post("/signup", createPublisherSignup);
router.post("/publish-book", protect, upload.single("imageFile"), publishBook);
router.post("/sell-antique", protect, upload.fields([
  { name: "itemImage", maxCount: 1 },
  { name: "authenticationImage", maxCount: 1 },
]), sellAntique);

export default router;