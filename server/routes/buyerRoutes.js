import express from "express";
import styles from "../../public/css/styles.js";
import mockCart from "../../public/mockData/mockCart.js";
import db from "../../public/database/db.js";
import mockWishlist from "../../public/mockData/mockWishlist.js";
import mockBuyerData from "../../public/mockData/mockBuyerData.js";
import {
  BooksDataArray,
  BuyerLoginData,
} from "../../public/mockData/MockUserData.js";
import bodyParser from "body-parser";
import passport from "passport";
import "../../server.js";
import "../config/passportConfig.js";

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/auth/login");
};

router.get("/dashboard", checkAuthenticated, (req, res) => {
  db.all("SELECT * FROM books", [], (err, books) => {
    if (err) {
      console.error("Error fetching books:", err.message);
      return res.status(500).send("Internal Server Error");
    }
    books.reverse();
    const temp = books.slice(0, 8);
    res.render("buyer/dashboard", {
      newlyBooks: temp,
      books: mockBuyerData,
      styles: styles,
      buyerName: req.user.firstname,
    });
  });
});

router.get("/search-page", checkAuthenticated, (req, res) => {
  db.all("SELECT * FROM books", [], (err, books) => {
    if (err) {
      console.error("Error fetching books:", err.message);
      return res.status(500).send("Internal Server Error");
    }
    const temp = books.slice(0, 8);
    res.render("buyer/search-page", {
      newlyBooks: temp,
      books: mockBuyerData,
      buyerName: req.user.firstname,
      styles: styles,
    });
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
  if (BuyerRegisterCopy != undefined) {
    res.redirect("/auth/login");
  } else {
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
  db.get("SELECT * FROM books WHERE id = ?", [bookId], (err, book) => {
    if (err) {
      console.error("Error fetching book:", err.message);
      return res.status(500).send("Internal Server Error");
    }

    if (!book) return res.send("Book not found");

    res.render("buyer/product-detail", {
      book: book,
      name: req.user.firstname,
      buyerName: req.user.firstname,
      styles: styles,
    });
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

export default router;
