import express from "express";
import bcrypt from "bcrypt";
import { generateToken, verifyToken } from "../utils/jwt.js";
import { protect } from "../middleware/authMiddleware.js";
import { createBook } from "../services/bookService.js";
import {
  createPublisher,
  getPublisherById,
  addBookToPublisher,
} from "../services/publisherService.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

import Book from "../models/Book.js";
import Buyer from "../models/Buyer.js";
import AntiqueBook from "../models/AntiqueBook.js";
import { createAntiqueBook } from "../services/antiqueBookService.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "publishelf/books", 
    allowed_formats: ["jpg", "jpeg", "png", "webp"], 
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

    
    const books = await Book.find({ publisher: req.user.id })
      .sort({ publishedAt: -1 })
      .limit(10);

    
    const auctions = await AntiqueBook.find({ publisher: req.user.id })
      .sort({ auctionStart: -1 })
      .limit(10);

    
    const buyers = await Buyer.find({
      "orders.book": { $in: books.map((book) => book._id) },
    });

    
    const orders = [];
    buyers.forEach((buyer) => {
      buyer.orders.forEach((order) => {
        if (
          books.some((book) => book._id.toString() === order.book.toString())
        ) {
          orders.push(order);
        }
      });
    });

    
    const booksSold = orders.reduce((sum, order) => sum + order.quantity, 0);
    const totalRevenue = orders.reduce((sum, order) => {
      const book = books.find(
        (b) => b._id.toString() === order.book.toString()
      );
      return sum + (book ? book.price * order.quantity : 0);
    }, 0);

    const bookSales = books.map((book) => {
      const sales = orders
        .filter((order) => order.book.toString() === book._id.toString())
        .reduce((sum, order) => sum + order.quantity, 0);
      return { book, sales };
    });

    const mostSoldBook = bookSales.reduce(
      (max, current) => (current.sales > max.sales ? current : max),
      { sales: 0 }
    );

    const genreCounts = orders.reduce((acc, order) => {
      const book = books.find(
        (b) => b._id.toString() === order.book.toString()
      );
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
      mostSoldBook: mostSoldBook.book
        ? { title: mostSoldBook.book.title, count: mostSoldBook.sales }
        : null,
      topGenres,
    };

    
    const activities = buyers.flatMap((buyer) =>
      buyer.orders.map((order) => ({
        action: `Ordered ${order.quantity} copies of ${
          books.find((b) => b._id.toString() === order.book.toString())?.title
        }`,
        timestamp: order.orderDate,
      }))
    );

    
    const availableBooks = await Book.find({ publisher: req.user.id });

    res.render("publisher/dashboard", {
      sales: publisher.books,
      PublisherName: req.user.firstname,
      publisher: { ...publisher, status: "approved" }, 
      analytics, 
      books, 
      auctions, 
      activities, 
      availableBooks, 
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
      
      if (decoded.role === "publisher")
        return res.redirect("/publisher/dashboard");
      else if (decoded.role === "buyer")
        return res.redirect("/buyer/dashboard");
    } catch (error) {
      
    }
  }

  res.render("auth/signup-publisher");
});

router.post("/signup", async (req, res) => {
  const { firstname, lastname, publishingHouse, email, password } = req.body;
  try {
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newPublisher = await createPublisher({
      firstname,
      lastname,
      publishingHouse,
      email,
      password: hashedPassword,
    });
    
    return res
      .status(201)
      .json({ message: "Publisher account created successfully." });
  } catch (error) {
    if (error.code === 11000)
      return res.status(400).json({ message: "Email already exists" });
    res.status(500).json({ message: "Error creating publisher", error });
  }
});


router.get("/sell-antique", protect, (req, res) => {
  res.render("publisher/sellAntique");
});

router.post("/sell-antique", protect, upload.fields([
    { name: "itemImage", maxCount: 1 },
    { name: "authenticationImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        title,
        author,
        description,
        genre,
        condition,
        basePrice,
        auctionStart,
        auctionEnd,
      } = req.body;
      if (!req.files || !req.files.itemImage || !req.files.authenticationImage)
        return res.status(400).send("Please upload both images.");

      const itemImageUrl = req.files.itemImage[0].path;
      const authenticationImageUrl = req.files.authenticationImage[0].path;

      const newAntiqueBook = await createAntiqueBook({
        title,
        author,
        description,
        genre,
        condition,
        basePrice,
        auctionStart,
        auctionEnd,
        image: itemImageUrl,
        authenticationImage: authenticationImageUrl,
        publisher: req.user.id,
        publishedAt: new Date(),
      });

      res.status(201).send("Antique book listed for auction successfully.");
    } catch (error) {
      console.error("Error listing antique book:", error);
      res.status(500).send("An error occurred while listing the antique book.");
    }
  }
);

router.get("/publish-book", protect, (req, res) => {
  res.render("publisher/publishBook");
});

router.post(
  "/publish-book",
  protect,
  upload.single("imageFile"),
  async (req, res) => {
    try {
      const { title, author, description, genre, price, quantity } = req.body;

      
      if (!req.file)
        return res
          .status(400)
          .send("No file uploaded. Please upload a book cover image.");

      
      const imageUrl = req.file.path;
      const newBook = await createBook({
        title,
        author,
        description,
        genre,
        price,
        quantity,
        image: imageUrl, 
        publisher: req.user.id,
        publishedAt: new Date(),
      });

      await addBookToPublisher(req.user.id, newBook._id);

      res.redirect("/publisher/dashboard"); 
    } catch (error) {
      console.error("Error publishing book:", error);
      res.status(500).send("An error occurred while publishing the book.");
    }
  }
);

export default router;
