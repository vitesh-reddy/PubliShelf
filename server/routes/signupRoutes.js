import express from "express";
const router = express.Router();

router.get("/admin", (req, res) => res.render("auth/signup-admin"));
router.get("/manager", (req, res) => res.render("auth/signup-manager"));

export default router;
