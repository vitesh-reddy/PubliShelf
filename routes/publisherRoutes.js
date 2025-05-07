import express from "express";
import bcrypt from "bcrypt";
import { generateToken, verifyToken } from "../utils/jwt.js";
import { protect } from "../middleware/authMiddleware.js";
import mockPublisherData from "../public/mockData/mockPublisherData.js";
import { BuyerLoginData } from "../public/mockData/MockUserData.js";
import { createPublisher, getPublisherById } from "../services/publisherService.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

import Book from "../models/Book.js";
import Buyer from "../models/Buyer.js";
import AntiqueBook from "../models/AntiqueBook.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "publishelf/books", // Folder in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"], // Allowed file formats
  },
});

const upload = multer({ storage });
const router = express.Router();


router.get("/dashboard", protect, async (req, res) => {
  try {
    const publisher = await getPublisherById(req.user.id);

    if (!publisher) {
      console.error("Publisher not found for ID:", req.user.id);
      return res.status(404).send("Publisher not found.");
    }

    // Fetch recent publications
    const books = await Book.find({ publisher: req.user.id }).sort({ createdAt: -1 }).limit(10);

    // Fetch recent auctions
    const auctions = await AntiqueBook.find({ publisher: req.user.id })
      .sort({ auctionStart: -1 })
      .limit(10);

    // Fetch all buyers who have ordered books published by this publisher
    const buyers = await Buyer.find({ "orders.book": { $in: books.map((book) => book._id) } });

    // Extract all orders for the publisher's books
    const orders = [];
    buyers.forEach((buyer) => {
      buyer.orders.forEach((order) => {
        if (books.some((book) => book._id.toString() === order.book.toString())) {
          orders.push(order);
        }
      });
    });

    // Calculate analytics
    const booksSold = orders.reduce((sum, order) => sum + order.quantity, 0);
    const totalRevenue = orders.reduce((sum, order) => {
      const book = books.find((b) => b._id.toString() === order.book.toString());
      return sum + (book ? book.price * order.quantity : 0);
    }, 0);

    const bookSales = books.map((book) => {
      const sales = orders
        .filter((order) => order.book.toString() === book._id.toString())
        .reduce((sum, order) => sum + order.quantity, 0);
      return { book, sales };
    });

    const mostSoldBook = bookSales.reduce((max, current) => (current.sales > max.sales ? current : max), { sales: 0 });

    const genreCounts = orders.reduce((acc, order) => {
      const book = books.find((b) => b._id.toString() === order.book.toString());
      if (book) {
        acc[book.genre] = (acc[book.genre] || 0) + order.quantity;
      }
      return acc;
    }, {});

    const topGenres = Object.entries(genreCounts)
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count);

    const analytics = {
      booksSold,
      totalRevenue,
      mostSoldBook: mostSoldBook.book ? { title: mostSoldBook.book.title, count: mostSoldBook.sales } : null,
      topGenres,
    };

    // Fetch recent buyer interactions
    const activities = buyers.flatMap((buyer) =>
      buyer.orders.map((order) => ({
        action: `Ordered ${order.quantity} copies of ${books.find((b) => b._id.toString() === order.book.toString())?.title}`,
        timestamp: order.orderDate,
      }))
    );

    // Fetch available books for auction
    const availableBooks = await Book.find({ publisher: req.user.id });

    res.render("publisher/dashboard", {
      sales: publisher.books,
      PublisherName: req.user.firstname,
      publisher: { ...publisher, status: "approved" }, // Pass the publisher object to the template
      analytics, // Pass the analytics object to the template
      books, // Pass the books variable to the template
      auctions, // Pass the auctions variable to the template
      activities, // Pass the activities variable to the template
      availableBooks, // Pass the availableBooks variable to the template
    });
  } catch (error) {
    console.error("Error fetching publisher dashboard:", error);
    res.status(500).send("An error occurred while fetching the dashboard.");
  }
});

router.get("/signup", (req, res) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = verifyToken(token);
      // Redirect logged-in users to their respective dashboard
      if (decoded.role === "publisher") {
        return res.redirect("/publisher/dashboard");
      } else if (decoded.role === "buyer") {
        return res.redirect("/buyer/dashboard");
      }
    } catch (error) {
      // If token is invalid, proceed to signup
    }
  }

  res.render("auth/signup-publisher");
});

router.post("/signup", async (req, res) => {
  const { firstname, lastname, publishingHouse, email, password } = req.body;
  try {
    // Create a new publisher
    const hashedPassword = await bcrypt.hash(password, 10);
    const newPublisher = await createPublisher({
      firstname,
      lastname,
      publishingHouse,
      email,
      password: hashedPassword,
    });  
    // Redirect to login page upon successful signup
    return res.status(201).json({ message: "Publisher account created successfully." });
  } catch (error) {
    if (error.code === 11000)
      return res.status(400).json({ message: "Email already exists" });
    res.status(500).json({ message: "Error creating publisher", error });
  }
});


// Sell Antique Book (Protected Route)
router.get("/sell-antique", protect, (req, res) => {
  res.render("publisher/sellAntique");
});
// Publisher Signup

router.get("/publish-book", protect, (req, res) => {
  res.render("publisher/publishBook");
});
import { createBook } from "../services/bookService.js";
import { addBookToPublisher } from "../services/publisherService.js";

router.post("/publish-book", protect, upload.single("imageFile"), async (req, res) => {
  try {
    const { title, author, description, genre, price, quantity } = req.body;

    // Check if the file was uploaded
    if (!req.file) {
      return res.status(400).send("No file uploaded. Please upload a book cover image.");
    }

    // Get the uploaded image URL from Cloudinary
    const imageUrl = req.file.path;

    const newBook = await createBook({
      title,
      author,
      description,
      genre,
      price,
      quantity,
      image: imageUrl, // Use the Cloudinary URL
      publisher: req.user.id,
    });

    await addBookToPublisher(req.user.id, newBook._id);

    res.status(201).send("Book published successfully");
  } catch (error) {
    console.error("Error publishing book:", error);
    res.status(500).send("An error occurred while publishing the book.");
  }
});

// Publish Book (Protected Route)
router.post("/publish-book", protect, (req, res) => {
  const { bookTitle, author, description, genre, price, quantity, image } = req.body;
  const parsedQuantity = parseInt(quantity, 10);

  // Logic to save the book (e.g., save to database)
  res.sendStatus(201);
});

export default router;
