import express from "express";
const router = express.Router();

router.get("/admin", (req, res) => res.render("auth/signup-admin"));
<<<<<<< HEAD
router.get("/manager", (req, res) => res.render("auth/signup-manager"));

=======

router.get("/manager", (req, res) => res.render("auth/signup-manager"));

router.get("/publisher", (req, res) => res.render("auth/signup-publisher"));

router.get("/buyer", (req, res) => res.render("auth/signup-buyer"));    

>>>>>>> 3dbf591fb5f3493eebab8f405f15486fc9e23601
export default router;
