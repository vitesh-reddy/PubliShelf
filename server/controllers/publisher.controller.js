//controllers/publisher.controller.js
import {
  getPublisherById,
  addBookToPublisher,
  getAllPublishers,
  getPublisherByEmail,
  createPublisher,
  deletePublisherById,
} from "../services/publisher.services.js";
import { createBook } from "../services/book.services.js";
import { createAntiqueBook } from "../services/antiqueBook.services.js";
import Book from "../models/Book.model.js";
import Buyer from "../models/Buyer.model.js";
import AntiqueBook from "../models/AntiqueBook.model.js";

export const getPublisherDashboard = async (req, res) => {
  try {
    const publisher = await getPublisherById(req.user.id);

    if (!publisher) {
      console.error("Publisher not found for ID:", req.user.id);
      return res.status(404).json({
        success: false,
        message: "Publisher not found",
        data: null
      });
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

    res.status(200).json({
      success: true,
      message: "Publisher dashboard data fetched successfully",
      data: {
        publisher: { ...publisher.toObject(), status: "approved" },
        analytics,
        books,
        auctions,
        activities,
        availableBooks,
      }
    });
  } catch (error) {
    console.error("Error fetching publisher dashboard:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the dashboard",
      data: null
    });
  }
};

export const createPublisherSignup = async (req, res) => {
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

    res.status(201).json({
      success: true,
      message: "Publisher account created successfully",
      data: null
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
        data: null
      });
    }
    res.status(500).json({
      success: false,
      message: "Error creating publisher",
      data: null
    });
  }
};

export const publishBook = async (req, res) => {
  try {
    const { title, author, description, genre, price, quantity } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please upload a book cover image",
        data: null
      });
    }

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

    res.status(201).json({
      success: true,
      message: "Book published successfully",
      data: { book: newBook }
    });
  } catch (error) {
    console.error("Error publishing book:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while publishing the book",
      data: null
    });
  }
};

export const sellAntique = async (req, res) => {
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
    if (!req.files || !req.files.itemImage || !req.files.authenticationImage) {
      return res.status(400).json({
        success: false,
        message: "Please upload both images",
        data: null
      });
    }

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

    res.status(201).json({
      success: true,
      message: "Antique book listed for auction successfully",
      data: { antiqueBook: newAntiqueBook }
    });
  } catch (error) {
    console.error("Error listing antique book:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while listing the antique book",
      data: null
    });
  }
};