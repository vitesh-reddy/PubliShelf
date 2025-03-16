import express from "express";
const router = express.Router();

router.get("/admin", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/auth/login");
    return;
  }
  res.render("auth/signup-admin");
});
router.get("/manager", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/auth/login");
    return;
  }
  res.render("auth/signup-manager");
});

export default router;
