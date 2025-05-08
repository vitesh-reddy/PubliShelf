import express from "express";
import styles from "../public/css/styles.js";
import { protect } from "../middleware/authMiddleware.js";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import {
  getBuyerById,
  createBuyer,
  updateBuyerDetails,
} from "../services/buyerService.js";
import {
  getAllBooks,
  getBookById,
  searchBooks,
} from "../services/bookService.js";
import {
  getOngoingAuctions,
  getFutureAuctions,
  getEndedAuctions,
  getAuctionItemById,
  addBid,
} from "../services/antiqueBookService.js";
import Buyer from "../models/Buyer.js";
import Book from "../models/Book.js";

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

// Buyer Dashboard (Protected Route)
router.get("/dashboard", protect, async (req, res) => {
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

// Checkout Page (Protected Route)
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
      ...orderSummary,
    });
  } catch (error) {
    console.error("Error loading Checkout Page:", error);
    res.status(500).send("Error loading Checkout Page");
  }
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
  try {
    const bookId = req.params.id;
    const book = await getBookById(bookId); // Fetch book details by ID

    if (!book) return res.status(404).send("Book not found");

    const buyer = await getBuyerById(req.user.id); // Fetch buyer with cart data
    const isInCart = buyer.cart.some(
      (item) => item.book._id.toString() === bookId
    );

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

    if (!buyer) return res.status(404).json({ message: "Buyer not found" });

    // Check if the book is already in the cart
    const existingCartItem = buyer.cart.find(
      (item) => item.book.toString() === bookId
    );

    if (existingCartItem)
      // If the book is already in the cart, update the quantity
      existingCartItem.quantity += quantity;
    // Otherwise, add the book to the cart
    else buyer.cart.push({ book: bookId, quantity });

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

    if (!buyer) return res.status(404).json({ message: "Buyer not found" });

    // Find the item in the cart and update its quantity
    const cartItem = buyer.cart.find(
      (item) => item.book._id.toString() === bookId
    );
    if (!cartItem)
      return res.status(404).json({ message: "Item not found in cart" });

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
    // console.log(buyer.cart);

    // Add current cart items to orders
    const newOrders = buyer.cart.map((item) => ({
      book: item.book,
      quantity: item.quantity,
      orderDate: new Date(),
      delivered: false,
    }));
    buyer.orders.push(...newOrders);

    buyer.cart.forEach(async (item) => {
      console.log(
        await Book.findByIdAndUpdate(
          { _id: item.book._id },
          { $inc: { quantity: -parseInt(item.quantity) } },
          { new: "true" }
        )
      );
    });
    buyer.cart = [];
    await buyer.save();
    res.status(200).json({ message: "Order placed successfully." });
  } catch (error) {
    console.error("Error placing order:", error);
    res
      .status(500)
      .json({ message: "An error occurred while placing the order." });
  }
});

// Auction Page (Protected Route)
router.get("/auction-page", protect, async (req, res) => {
  try {
    // Fetch data using service methods
    const ongoingAuctions = await getOngoingAuctions();
    const futureAuctions = await getFutureAuctions();
    const endedAuctions = await getEndedAuctions();

    // Render the auction-page.ejs file with the fetched data
    res.render("buyer/auction-page", {
      buyerName: req.user.firstname,
      ongoingAuctions,
      futureAuctions,
      endedAuctions,
    });
  } catch (error) {
    console.error("Error fetching auction data:", error);
    res.status(500).send("An error occurred while fetching auction data.");
  }
});

// Auction Item Detail (Protected Route)
router.get("/auction-item-detail/:id", protect, async (req, res) => {
  try {
    const auctionId = req.params.id;

    // Fetch auction item details using the auctionId
    const book = await getAuctionItemById(auctionId);
    if (!book) return res.status(404).send("Auction item not found");

    res.render("buyer/auction-item-detail", {
      buyerName: req.user.firstname,
      book,
    });
  } catch (error) {
    console.error("Error loading auction item details:", error);
    res.status(500).send("Error loading auction item details");
  }
});

router.get("/auction-ongoing/:id", protect, async (req, res) => {
  try {
    const auctionId = req.params.id;

    // Fetch the auction item details using the service method
    const book = await getAuctionItemById(auctionId);

    if (!book) return res.status(404).send("Auction item not found");

    // Render the auction-ongoing.ejs file with the fetched data
    res.render("buyer/auction-ongoing", {
      buyerName: req.user.firstname,
      buyerId: req.user.id,
      book,
    });
  } catch (error) {
    console.error("Error fetching auction item details:", error);
    res
      .status(500)
      .send("An error occurred while fetching auction item details.");
  }
});

router.post("/auctions/:id/bid", protect, async (req, res) => {
  try {
    const { id: auctionId } = req.params;
    const { bidAmount } = req.body;
    const bidderId = req.user.id; // Get the logged-in buyer's ID
    // Use the service method to add the bid
    const updatedBook = await addBid(auctionId, bidderId, bidAmount);

    res.status(200).json({
      message: "Bid placed successfully",
      currentPrice: updatedBook.currentPrice,
      biddingHistory: updatedBook.biddingHistory,
    });
  } catch (error) {
    console.error("Error placing bid:", error);
    res
      .status(500)
      .json({ message: "An error occurred while placing the bid." });
  }
});

router.get("/profile", protect, async (req, res) => {
  try {
    const user = await Buyer.findById(req.user.id)
      .populate("orders.book")
      .populate("wishlist")
      .lean();
    if (!user) return res.status(404).send("User not found");

    if (user.orders && user.orders.length > 0)
      user.orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

    res.render("buyer/profile", { user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).send("Server error");
  }
});

// Update Buyer Profile (Protected Route)
router.put("/profile", protect, async (req, res) => {
  try {
    const { firstName, lastName, email, currentPassword, newPassword } =
      req.body;
    const buyerId = req.user.id;

    // Call the service to update the buyer profile
    const updatedBuyer = await updateBuyerProfile(buyerId, {
      firstName,
      lastName,
      email,
      currentPassword,
      newPassword,
    });

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    if (error.message === "Incorrect password")
      return res.status(401).json({ message: "Incorrect password" });
    if (error.message === "Email already exists")
      return res.status(400).json({ message: "Email already exists" });
    console.error("Error updating profile:", error);
    res.status(400).json({ message: error.message });
  }
});

router.post("/update-profile/:id", protect, async (req, res) => {
  const buyerId = req.params.id;
  const { currentPassword, firstname, lastname, email, confirmPassword } =
    req.body;
  console.log(
    "update buyer",
    buyerId,
    currentPassword,
    confirmPassword,
    firstname,
    lastname,
    email
  );
  try {
    const updatedBuyer = await updateBuyerDetails(buyerId, currentPassword, {
      firstname,
      lastname,
      email,
      password: await bcrypt.hash(confirmPassword, 10),
    });

    res.status(200).json({ success: true, buyer: updatedBuyer });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

export default router;
