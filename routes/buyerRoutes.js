import express from "express";
import styles from "../public/css/styles.js";
// import mockCart from "../public/mockData/mockCart.js";
// import mockWishlist from "../public/mockData/mockWishlist.js";
// import { BooksDataArray, BuyerLoginData } from "../public/mockData/MockUserData.js";
import { protect } from "../middleware/authMiddleware.js";
import { generateToken } from "../utils/jwt.js";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import { getBuyerById } from "../services/buyerService.js";
import { getAllBooks } from "../services/bookService.js";
import { getAllPublishers } from "../services/publisherService.js";

import { createBuyer } from "../services/buyerService.js";

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

// Buyer Dashboard (Protected Route)
router.get("/dashboard", protect, async (req, res) => {
  console.log("Buyer Dashboard accessed by:", req.user.firstname);
  try {
    const books = await getAllBooks();
    res.render("buyer/dashboard", {
      newlyBooks: books,
      books: books,
      buyerName: req.user.firstname,
      styles: styles,
    });
  } catch (error) {
    console.error("Error loading buyer dashboard:", error);
    res.status(500).send("Error loading dashboard");
  }
});

// Search Page (Protected Route)
router.get("/search-page", protect, (req, res) => {
  res.render("buyer/search-page", {
    newlyBooks: BooksDataArray,
    books: BooksDataArray,
    buyerName: req.user.firstname,
    styles: styles,
  });
});

// Buyer Profile (Protected Route)
router.get("/profile", protect, (req, res) => {
  res.render("buyer/profile", { user: req.user });
});

// Auction Page (Protected Route)
router.get("/auction-page", protect, (req, res) => {
  res.render("buyer/auction-page", {
    buyerName: req.user.firstname,
  });
});

// Auction Item Detail (Protected Route)
router.get("/auction-item-detail/:id", protect, (req, res) => {
  res.render("buyer/auction-item-detail", {
    buyerName: req.user.firstname,
  });
});

// Checkout Page (Protected Route)
router.get("/checkout", protect, (req, res) => {
  res.render("buyer/checkout", {
    buyerName: req.user.firstname,
  });
});

// Buyer Signup Page (Public Route)
router.get("/signup", (req, res) => {
  res.render("auth/signup-buyer", { styles: styles });
});

// Buyer Signup (Public Route)
router.post("/signup", async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Call the service to create a new buyer with the hashed password
    await createBuyer({
      firstname,
      lastname,
      email,
      password: hashedPassword, // Pass the hashed password to the service
    });
    // Redirect to login page upon successful signup
    res.status(201).json({ message: "Buyer account created successfully." });
  } catch (error) {
    console.error("Error during buyer signup:", error); // Log the error for debugging

    // Check for duplicate email error
    if (error.code === 11000) 
      return res.status(400).json({ message: "Email already exists." });
    

    // Handle other errors
    res.status(500).json({ message: "An unexpected error occurred while creating the buyer account." });
  }
});

// Product Detail (Protected Route)
router.get("/product-detail/:id1", protect, (req, res) => {
  const bookId = req.params.id1;
  res.render("buyer/product-detail", {
    book: BooksDataArray,
    name: req.user.firstname,
    buyerName: req.user.firstname,
    styles: styles,
  });
});

// Cart Page (Protected Route)

router.get("/cart", protect, async (req, res) => {
  const buyer = await getBuyerById(req.user.id);
  const cart = buyer.cart;

  const calculateOrderSummary = (cart) => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.book.price * item.quantity,
      0
    );
    const shipping = subtotal >= 35 ? 0 : 5.99;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total };
  };

  const orderSummary = calculateOrderSummary(cart);

  res.render("buyer/cart", {
    buyerName: req.user.firstname,
    cart: cart,
    ...orderSummary,
  });
});

router.get("/auction-ongoing/:id", protect, (req, res) => {
  res.render("buyer/auction-ongoing", {
    buyerName: req.user.firstname,
  });
});



export default router;
