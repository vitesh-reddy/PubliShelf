import express from "express";
import styles from "../public/css/styles.js";
import { protect } from "../middleware/authMiddleware.js";
import { generateToken } from "../utils/jwt.js";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import { getBuyerById } from "../services/buyerService.js";
import {
  getAllBooks,
  getBookById,
  searchBooks,
} from "../services/bookService.js";
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
router.get("/search-page", protect, async (req, res) => {
  try {
    const books = await getAllBooks();
    res.render("buyer/search-page", {
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

// Search Books (Protected Route)
router.get("/search", protect, async (req, res) => {
  const searchQuery = req.query.q; // Get the search query from the URL
  try {
    const books = await searchBooks(searchQuery); // Call the service function
    res.render("buyer/search-page", {
      newlyBooks: books,
      books: books,
      buyerName: req.user.firstname,
      styles: styles,
    });
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).send("Error during search");
  }
});

// Filter and Category Search (Protected Route)
router.get("/filter", protect, async (req, res) => {
  const { category, sort, condition, priceRange } = req.query;

  try {
    // Build the query object
    const query = {};
    if (category) query.genre = category; // Filter by genre

    if (condition && condition !== "All") query.condition = condition; // Filter by condition

    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split("-").map(Number);
      query.price = { $gte: minPrice, $lte: maxPrice }; // Filter by price range
    }

    // Fetch books based on the query
    let books = await books.find(query);

    // Sort the books if a sort option is provided
    if (sort) {
      if (sort === "priceLowToHigh")
        books = books.sort((a, b) => a.price - b.price);
      else if (sort === "priceHighToLow")
        books = books.sort((a, b) => b.price - a.price);
      else if (sort === "newestFirst")
        books = books.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
    }

    res.render("buyer/search-page", {
      newlyBooks: books,
      books: books,
      buyerName: req.user.firstname,
      styles: styles,
    });
  } catch (error) {
    console.error("Error during filter/category search:", error);
    res.status(500).send("Error during filter/category search");
  }
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
    res.status(500).json({
      message: "An unexpected error occurred while creating the buyer account.",
    });
  }
});

// Product Detail (Protected Route)
router.get("/product-detail/:id", protect, async (req, res) => {
  const bookId = req.params.id;
  try {
    const bookofId = await getBookById(bookId);
    console.log(bookofId);
    res.render("buyer/product-detail", {
      buyerName: req.user.firstname,
      book: bookofId,
      styles: styles,
    });
  } catch (error) {
    console.error("Error loading product detail:", error);
    res.status(500).send("Error loading product detail");
  }
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
