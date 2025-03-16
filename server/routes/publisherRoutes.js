import express from "express";
import mockPublisherData from "../../public/mockData/mockPublisherData.js";
import { BooksDataArray, BuyerLoginData } from "../../public/mockData/MockUserData.js";
const router = express.Router();

router.get("/dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("publisher/dashboard", {
      sales: mockPublisherData,
      PublisherName: req.user.firstname,
    });
  } else res.redirect("/auth/login");
});
router.get("/signup", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/auth/login");
    return;
  }
  res.render("auth/signup-publisher");
});


router.get("/publish-book", (req, res) => {
  if(req.isAuthenticated()){
  res.render("publisher/publishBook");
  }
  else res.redirect('/auth/login');
});

router.get("/sell-antique", (req, res) => {
  if(req.isAuthenticated()){
  res.render("publisher/sellAntique");
  }
  else res.redirect('/auth/login');
});

export default router;
