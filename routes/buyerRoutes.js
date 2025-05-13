import express from "express";
import styles from "../public/css/styles.js";
import { protect } from "../middleware/authMiddleware.js";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import {
  getBuyerById,
  createBuyer,
  updateBuyerDetails,
  getTopSoldBooks,
  getTrendingBooks,
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

router.get("/dashboard", protect, async (req, res) => {
  try {
      const newlyBooks = await Book.find().sort({ publishedAt: -1 }).limit(8);
      const mostSoldBooks = await getTopSoldBooks();
      const trendingBooks = await getTrendingBooks();
    res.render("buyer/dashboard", {
      newlyBooks: newlyBooks,
      mostSoldBooks: mostSoldBooks,
      trendingBooks: trendingBooks,
      buyerName: req.user.firstname,
      styles: styles,
    });
  } catch (error) {
    console.error("Error loading buyer dashboard:", error);
    res.status(500).send("Error loading dashboard");
  }
});

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

router.get("/search", protect, async (req, res) => {
  const searchQuery = req.query.q; 
  try {
    const books = await searchBooks(searchQuery); 
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

router.get("/filter", protect, async (req, res) => {
  const { category, sort, condition, priceRange } = req.query;

  try {
    const filters = { category, sort, condition, priceRange };
    const books = await filterBooks(filters); 

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

router.get("/checkout", protect, async (req, res) => {
  try {
    const buyer = await getBuyerById(req.user.id); 
    if (!buyer) return res.status(404).send("Buyer not found");

    const cart = buyer.cart;

    const calculateOrderSummary = (cart) => {
      const subtotal = cart.reduce(
        (sum, item) => sum + item.book.price * item.quantity,
        0
      );
      const shipping = subtotal >= 35 ? 0 : 5.99;
      const tax = subtotal * 0.08; 
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

router.get("/signup", (req, res) => {
  res.render("auth/signup-buyer", { styles: styles });
});

router.post("/signup", async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    
    await createBuyer({
      firstname,
      lastname,
      email,
      password: hashedPassword, 
    });
    
    res.status(201).json({ message: "Buyer account created successfully." });
  } catch (error) {
    console.error("Error during buyer signup:", error); 

    
    if (error.code === 11000)
      return res.status(400).json({ message: "Email already exists." });

    
    res.status(500).json({
      message: "An unexpected error occurred while creating the buyer account.",
    });
  }
});

router.get("/product-detail/:id", protect, async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await getBookById(bookId); 

    if (!book) return res.status(404).send("Book not found");

    const buyer = await getBuyerById(req.user.id); 
    const isInCart = buyer.cart.some(
      (item) => item.book._id.toString() === bookId
    );

    res.render("buyer/product-detail", {
      buyerName: buyer.firstname,
      styles: styles,
      book,
      isInCart, 
    });
  } catch (error) {
    console.error("Error loading product details:", error);
    res.status(500).send("Error loading product details");
  }
});

router.get("/cart", protect, async (req, res) => {
  try {
    const buyer = await getBuyerById(req.user.id); 
    if (!buyer) return res.status(404).send("Buyer not found");

    const cart = buyer.cart;
    const wishlist = buyer.wishlist;

    const calculateOrderSummary = (cart) => {
      const subtotal = cart.reduce(
        (sum, item) => sum + item.book.price * item.quantity,
        0
      );
      const shipping = subtotal >= 35 ? 0 : 5.99;
      const tax = subtotal * 0.08; 
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

    
    const existingCartItem = buyer.cart.find(
      (item) => item.book.toString() === bookId
    );

    if (existingCartItem)
      
      existingCartItem.quantity += quantity;
    
    else buyer.cart.push({ book: bookId, quantity });

    
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

    const cartItemIndex = buyer.cart.findIndex(
      (item) => item.book._id.toString() === bookId
    );

    if (cartItemIndex === -1)
      return res.status(404).json({ message: "Item not found in cart" });

    buyer.cart.splice(cartItemIndex, 1);
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

    
    if (buyer.wishlist.includes(bookId)) {
      return res
        .status(400)
        .json({ message: "Book is already in the wishlist" });
    }

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
    

    const newOrders = buyer.cart.map((item) => ({
      book: item.book,
      quantity: item.quantity,
      orderDate: new Date(),
      delivered: false,
    }));
    buyer.orders.push(...newOrders);

    buyer.cart.forEach(async (item) => {
        await Book.findByIdAndUpdate(
          { _id: item.book._id },
          { $inc: { quantity: -parseInt(item.quantity) } },
          { new: "true" }
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

router.get("/auction-page", protect, async (req, res) => {
  try {
    const ongoingAuctions = await getOngoingAuctions();
    const futureAuctions = await getFutureAuctions();
    const endedAuctions = await getEndedAuctions();

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

router.get("/auction-item-detail/:id", protect, async (req, res) => {
  try {
    const auctionId = req.params.id;

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

    const book = await getAuctionItemById(auctionId);

    if (!book) return res.status(404).send("Auction item not found");

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
    const bidderId = req.user.id;
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

router.put("/profile", protect, async (req, res) => {
  try {
    const { firstName, lastName, email, currentPassword, newPassword } =
      req.body;
    const buyerId = req.user.id;

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
