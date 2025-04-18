import express from "express";
import mockPublisherData from "../public/mockData/mockPublisherData.js";
import { BuyerLoginData } from "../public/mockData/MockUserData.js";

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
  if (req.isAuthenticated()) {
    res.render("publisher/publishBook");
  } else res.redirect("/auth/login");
});

router.get("/sell-antique", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("publisher/sellAntique");
  } else res.redirect("/auth/login");
});

router.post("/signup", (req, res) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const publishingHouse = req.body.publishingHouse;
  const businessEmail = req.body.businessEmail;
  const password = req.body.password;
  const BuyerRegisterCopy = BuyerLoginData.find(
    (Copy) => businessEmail == Copy.email
  );

  if (BuyerRegisterCopy != undefined) {
    res.redirect("/auth/login");
  } else {
    const copyy = {
      id: BuyerLoginData.length + 1,
      role: "publisher",
      firstname: firstname,
      lastname: lastname,
      housename: publishingHouse,
      email: businessEmail,
      password: password,
    };
    BuyerLoginData.push(copyy);
    res.redirect("/auth/login");
  }
});

router.post("/publish-book", (req, res) => {
  const { bookTitle, author, description, genre, price, quantity, image } =
    req.body;
  const parsedQuantity = parseInt(quantity, 10);
  res.sendStatus(201);
});
export default router;
