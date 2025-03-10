import express from "express";
import { mockData } from "../../public/mockData.js";
import styles from "../../public/css/styles.js";

const router = express.Router();

router.get("/dashboard", (req, res) =>
  res.render("buyer/dashboard", { books: mockData, styles: styles })
);

export default router;
