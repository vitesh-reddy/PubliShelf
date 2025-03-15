import express from "express";
const publishers = [
  { name: "Publisher 1" },
  { name: "Publisher 2" },
  { name: "Publisher 3" },
];
const router = express.Router();

router.get("/dashboard", (req, res) => res.render("admin/dashboard", { publishers }));

export default router;
