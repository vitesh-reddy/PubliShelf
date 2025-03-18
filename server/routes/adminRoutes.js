import express from "express";
import styles from "../../public/css/styles.js";
const publishers = [
  { name: "Publisher 1" },
  { name: "Publisher 2" },
  { name: "Publisher 3" },
];
const router = express.Router();

const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/auth/login");
};

router.get("/signup", (req, res) => res.render("auth/signup-admin", { styles: styles }));  

router.get("/dashboard", checkAuthenticated, (req, res) => res.render("admin/dashboard", { publishers, styles: styles }));

export default router;