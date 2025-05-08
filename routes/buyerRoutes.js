import express from "express";
import styles from "../public/css/styles.js";
<<<<<<< HEAD
=======
// import mockCart from "../public/mockData/mockCart.js";
// import mockWishlist from "../public/mockData/mockWishlist.js";
// import { BooksDataArray, BuyerLoginData } from "../public/mockData/MockUserData.js";
>>>>>>> d3cc9eae2fce0ee8716ec4b262dbc227a5a0ac94
import { protect } from "../middleware/authMiddleware.js";
import { generateToken } from "../utils/jwt.js";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
<<<<<<< HEAD
import { getBuyerById, updateBuyerCart } from "../services/buyerService.js";
import {
  getAllBooks,
  getBookById,
  searchBooks,
} from "../services/bookService.js";
=======
import { getBuyerById } from "../services/buyerService.js";
import { getAllBooks } from "../services/bookService.js";
>>>>>>> d3cc9eae2fce0ee8716ec4b262dbc227a5a0ac94
import { getAllPublishers } from "../services/publisherService.js";

import { createBuyer } from "../services/buyerService.js";

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

// Buyer Dashboard (Protected Route)
router.get("/dashboard", protect, async (req, res) => {
<<<<<<< HEAD
=======
  console.log("Buyer Dashboard accessed by:", req.user.firstname);
>>>>>>> d3cc9eae2fce0ee8716ec4b262dbc227a5a0ac94
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
<<<<<<< HEAD
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
    const filters = { category, sort, condition, priceRange };
    const books = await filterBooks(filters); // Call the updated filterBooks function

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

=======
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

>>>>>>> d3cc9eae2fce0ee8716ec4b262dbc227a5a0ac94
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
<<<<<<< HEAD
router.get("/checkout", protect, async (req, res) => {
  try {
    const buyer = await getBuyerById(req.user.id); // Fetch buyer with populated cart
    if (!buyer) return res.status(404).send("Buyer not found");

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

    res.render("buyer/checkout", {
      buyerName: req.user.firstname,
      ...orderSummary
    });
  } catch (error) {
    console.error("Error loading Checkout Page:", error);
    res.status(500).send("Error loading Checkout Page");
  }
=======
router.get("/checkout", protect, (req, res) => {
  res.render("buyer/checkout", {
    buyerName: req.user.firstname,
  });
>>>>>>> d3cc9eae2fce0ee8716ec4b262dbc227a5a0ac94
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
<<<<<<< HEAD
    if (error.code === 11000)
      return res.status(400).json({ message: "Email already exists." });

    // Handle other errors
    res.status(500).json({
      message: "An unexpected error occurred while creating the buyer account.",
    });
=======
    if (error.code === 11000) 
      return res.status(400).json({ message: "Email already exists." });
    

    // Handle other errors
    res.status(500).json({ message: "An unexpected error occurred while creating the buyer account." });
>>>>>>> d3cc9eae2fce0ee8716ec4b262dbc227a5a0ac94
  }
});

// Product Detail (Protected Route)
<<<<<<< HEAD
router.get("/product-detail/:id", protect, async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await getBookById(bookId); // Fetch book details by ID

    if (!book) return res.status(404).send("Book not found");

    const buyer = await getBuyerById(req.user.id); // Fetch buyer with cart data
    const isInCart = buyer.cart.some(
      (item) => item.book._id.toString() === bookId
    );

    console.log("inside product detail route", isInCart);
    res.render("buyer/product-detail", {
      buyerName: buyer.firstname,
      styles: styles,
      book,
      isInCart, // Pass whether the book is in the cart
    });
  } catch (error) {
    console.error("Error loading product details:", error);
    res.status(500).send("Error loading product details");
  }
});

// Cart Page (Protected Route)
=======
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
>>>>>>> d3cc9eae2fce0ee8716ec4b262dbc227a5a0ac94

router.get("/cart", protect, async (req, res) => {
  try {
    const buyer = await getBuyerById(req.user.id); // Fetch buyer with populated cart
    if (!buyer) return res.status(404).send("Buyer not found");

    const cart = buyer.cart;
    const wishlist = buyer.wishlist;

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
      wishlist: wishlist,
      ...orderSummary,
      styles: styles,
      wishlist: buyer.wishlist,
    });
  } catch (error) {
    console.error("Error loading cart:", error);
    res.status(500).send("Error loading cart");
  }
});

router.post("/cart/add", protect, async (req, res) => {
  const { bookId, quantity } = req.body;

  try {
    const buyer = await getBuyerById(req.user.id);

    if (!buyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }

    // Check if the book is already in the cart
    const existingCartItem = buyer.cart.find(
      (item) => item.book.toString() === bookId
    );

    if (existingCartItem) {
      // If the book is already in the cart, update the quantity
      existingCartItem.quantity += quantity;
    } else {
      // Otherwise, add the book to the cart
      buyer.cart.push({ book: bookId, quantity });
    }

    // Save the updated cart
    await buyer.save();

    res.status(200).json({ message: "Book added to cart successfully." });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res
      .status(500)
      .json({ message: "An error occurred while adding to the cart." });
  }
});

router.delete("/cart/remove", protect, async (req, res) => {
  const { bookId } = req.body;

  try {
    const buyer = await getBuyerById(req.user.id);

    if (!buyer) return res.status(404).json({ message: "Buyer not found" });

    // Find the index of the item in the cart
    const cartItemIndex = buyer.cart.findIndex(
      (item) => item.book._id.toString() === bookId // Ensure proper comparison
    );

    if (cartItemIndex === -1)
      return res.status(404).json({ message: "Item not found in cart" });

    // Remove the item from the cart
    buyer.cart.splice(cartItemIndex, 1);

    // Save the updated cart
    await buyer.save();

    res.status(200).json({ message: "Item removed from cart successfully." });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({
      message: "An error occurred while removing the item from the cart.",
    });
  }
});

router.post("/wishlist/add", protect, async (req, res) => {
  const { bookId } = req.body;

  try {
    const buyer = await getBuyerById(req.user.id);

    if (!buyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }

    // Check if the book is already in the wishlist
    if (buyer.wishlist.includes(bookId)) {
      return res
        .status(400)
        .json({ message: "Book is already in the wishlist" });
    }

    // Add the book to the wishlist
    buyer.wishlist.push(bookId);
    await buyer.save();

    res.status(200).json({ message: "Book added to wishlist successfully." });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res
      .status(500)
      .json({ message: "An error occurred while adding to the wishlist." });
  }
});

router.patch("/cart/update-quantity", protect, async (req, res) => {
  const { bookId, quantity } = req.body;
  try {
    const buyer = await getBuyerById(req.user.id);

    if (!buyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }
    console.log("cart buyer", buyer.cart);
    // Find the item in the cart and update its quantity
    const cartItem = buyer.cart.find(
      (item) => item.book._id.toString() === bookId
    );
    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cartItem.quantity = quantity;

    await buyer.save();

    res.status(200).json({ message: "Quantity updated successfully." });
  } catch (error) {
    console.error("Error updating quantity:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the quantity." });
  }
});

router.post("/checkout/place-order", protect, async (req, res) => {
  try {
      const buyer = await getBuyerById(req.user.id);

      if (!buyer) {
          return res.status(404).json({ message: "Buyer not found" });
      }

      // Add current cart items to orders
      const newOrders = buyer.cart.map(item => ({
          book: item.book,
          quantity: item.quantity,
          orderDate: new Date(),
          delivered: false,
      }));
      buyer.orders.push(...newOrders);

      // Empty the cart
      buyer.cart = [];

      // Save the updated buyer
      await buyer.save();

      res.status(200).json({ message: "Order placed successfully." });
  } catch (error) {
      console.error("Error placing order:", error);
      res.status(500).json({ message: "An error occurred while placing the order." });
  }
});

router.get("/auction-ongoing/:id", protect, (req, res) => {
  res.render("buyer/auction-ongoing", {
    buyerName: req.user.firstname,
<<<<<<< HEAD
=======
    cart: cart,
    ...orderSummary,
>>>>>>> d3cc9eae2fce0ee8716ec4b262dbc227a5a0ac94
  });
});

router.get("/auction-ongoing/:id", protect, (req, res) => {
  res.render("buyer/auction-ongoing", {
    buyerName: req.user.firstname,
  });
});



export default router;
