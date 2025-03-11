import express from "express";
import mockPublisherData from "../../public/mockData/mockPublisherData.js";
const router = express.Router();

router.get("/dashboard", (req, res) =>
  res.render("publisher/dashboard", { sales: mockPublisherData })
);
router.get("/publish-book", (req, res) => res.render("publisher/publishBook"));
router.get("/sell-antique", (req, res) => res.render("publisher/sellAntique"));

export default router;
