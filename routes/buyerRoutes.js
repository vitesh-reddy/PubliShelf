import express from "express";
import styles from "../public/css/styles.js";
import mockCart from "../public/mockData/mockCart.js";
import mockWishlist from "../public/mockData/mockWishlist.js";
import mockBuyerData from "../public/mockData/mockBuyerData.js";
import {
  BooksDataArray,
  BuyerLoginData,
} from "../public/mockData/MockUserData.js";
import bodyParser from "body-parser";
import "../server.js";
import "../config/passportConfig.js";

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/auth/login");
};

router.get("/dashboard", checkAuthenticated, (req, res) => {
  res.render("buyer/dashboard", {
    newlyBooks: BooksDataArray,
    books: BooksDataArray,
    styles: styles,
    buyerName: req.user.firstname,
  });
});

router.get("/search-page", checkAuthenticated, (req, res) => {
  res.render("buyer/search-page", {
    newlyBooks: BooksDataArray,
    books: BooksDataArray,
    buyerName: req.user.firstname,
    styles: styles,
  });
});

router.get("/profile", checkAuthenticated, (req, res) => {
  res.render("buyer/profile", {
    user: req.user,
  });
});

router.get("/auction-page", checkAuthenticated, (req, res) => {
  res.render("buyer/auction-page", {
    buyerName: req.user.firstname,
  });
});

router.get("/auction-item-detail", checkAuthenticated, (req, res) => {
  res.render("buyer/auction-item-detail", {
    buyerName: req.user.firstname,
  });
});

router.get("/checkout", checkAuthenticated, (req, res) => {
  res.render("buyer/checkout", {
    buyerName: req.user.firstname,
  });
});

router.get("/signup", (req, res) => {
  res.render("auth/signup-buyer", { styles: styles });
});

router.post("/signup", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/auth/login");
    return;
  }
  const username = req.body.email;
  const password = req.body.password;
  const BuyerRegisterCopy = BuyerLoginData.find(
    (Copy) => username == Copy.email
  );
  if (BuyerRegisterCopy != undefined) res.redirect("/auth/login");
  else {
    const newRegister = {
      id: BuyerLoginData.length + 1,
      role: "buyer",
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: username,
      password: password,
    };
    BuyerLoginData.push(newRegister);
    res.redirect("/auth/login");
  }
});

router.get("/product-detail/:id1", checkAuthenticated, (req, res) => {
  const bookId = req.params.id1;
  res.render("buyer/product-detail", {
    book: BooksDataArray,
    name: req.user.firstname,
    buyerName: req.user.firstname,
    styles: styles,
  });
});
router.get("/cart", checkAuthenticated, (req, res) => {
  const calculateOrderSummary = (cart) => {
    const subtotal = cart.reduce(
      (sum, item) =>
        sum + parseFloat(item.price.replace("₹", "")) * item.quantity,
      0
    );

    const shipping = subtotal >= 35 ? 0 : 5.99;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
  };
  const orderSummary = calculateOrderSummary(mockCart);

  res.render("buyer/cart", {
    buyerName: req.user.firstname,
    cart: mockCart,
    wishlist: mockWishlist,
    ...orderSummary,
    styles: styles,
  });
});

export default router;
