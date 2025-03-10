import express from "express";
const router = express.Router();

router.get("/dashboard", (req, res) => res.render("publisher/dashboard"));
router.get("/sellBook", (req, res) => res.render("publisher/sellBook"));

export default router;
