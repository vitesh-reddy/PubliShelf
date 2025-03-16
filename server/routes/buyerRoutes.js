import express from "express";
import styles from "../../public/css/styles.js";
import mockCart from "../../public/mockData/mockCart.js";
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

router.get("/dashboard", (req, res) => {
  if (req.isAuthenticated())
    res.render("buyer/dashboard", {
      books: mockBuyerData,
      styles: styles,
      buyerName: req.user.firstname,
    });
  else res.redirect("/auth/login");
});

router.get("/signup", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/auth/login");
    return;
  }
  res.render("auth/signup-buyer");
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

router.get("/product-detail", (req, res) => res.render("buyer/product-detail"));

router.get("/cart", (req, res) => {
  const calculateOrderSummary = (cart) => {
    const subtotal = cart.reduce((sum, item) => {
      return sum + parseFloat(item.price.replace("$", "")) * item.quantity;
    }, 0);

    const shipping = subtotal >= 35 ? 0 : 5.99;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
  };
  const orderSummary = calculateOrderSummary(mockCart);

  res.render("buyer/cart", {
    cart: mockCart,
    wishlist: mockWishlist,
    ...orderSummary,
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

router.post("/publish-book", (req, res) => {
  const bookTitle = req.body.bookTitle;
  const author = req.body.author;
  const description = req.body.description;
  const genre = req.body.genre;
  const price = req.body.price;
  const quantity = parseInt(req.body.quantity, 10);
  const image = req.body.image;

  const copyFind = BooksDataArray.find((obj) => {
    if (
      bookTitle == obj.bookTitle &&
      author == obj.author &&
      description == obj.description &&
      genre == obj.genre &&
      price == obj.price &&
      image == obj.image
    ) {
      return obj;
    }
  });

  if (!copyFind) {
    const BookObject = {
      bookTitle: bookTitle,
      author: author,
      description: description,
      genre: genre,
      price: price,
      quantity: quantity,
      image: image,
    };
    BooksDataArray.push(BookObject);
  } else {
    copyFind.quantity = parseInt(copyFind.quantity, 10) + quantity;
  }

  console.log(BooksDataArray);
  res.redirect("/publisher/dashboard");
});

export default router;
