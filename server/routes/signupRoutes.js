import express from "express";
const router = express.Router();

router.get("/admin", (req, res) => res.render("auth/signup-admin"));

router.get("/manager", (req, res) => res.render("auth/signup-manager"));

router.get("/publisher", (req, res) => res.render("auth/signup-publisher"));

router.get("/buyer", (req, res) => res.render("auth/signup-buyer"));    

export default router;
