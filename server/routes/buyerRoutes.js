import express from "express";
import mockBuyerData from "../../public/mockData/mockBuyerData.js";
import styles from "../../public/css/styles.js";

const router = express.Router();

router.get("/dashboard", (req, res) =>
  res.render("buyer/dashboard", { books: mockBuyerData, styles: styles })
);

router.get("/signup", (req, res) => res.render("auth/signup-buyer"));

export default router;
