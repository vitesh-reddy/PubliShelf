import Book from "../models/Book.js";

export const getAllBooks = async () => {
  return await Book.find();
};

export const getBookById = async (bookId) => {
<<<<<<< HEAD
  return await Book.findById(bookId).populate("reviews.buyer").populate("publisher");
=======
  return await Book.findById(bookId).populate("reviews.buyer");
>>>>>>> d3cc9eae2fce0ee8716ec4b262dbc227a5a0ac94
};

export const addReviewToBook = async (bookId, review) => {
  const book = await Book.findById(bookId);

  if (!book) {
    throw new Error("Book not found");
  }

  book.reviews.push(review);

  // Update the average rating
  const totalRatings = book.reviews.reduce((sum, review) => sum + review.rating, 0);
  book.rating = totalRatings / book.reviews.length;

  return await book.save();
};


export const createBook = async (bookData) => {
  const newBook = new Book(bookData);
  return await newBook.save();
<<<<<<< HEAD
};

export const searchBooks = async (query) => {
  if (!query) {
    return []; // Return an empty array if no query is provided
  }

  return await Book.find({
    $or: [
      { title: { $regex: query, $options: "i" } }, // Search by title
      { author: { $regex: query, $options: "i" } }, // Search by author
      { genre: { $regex: query, $options: "i" } }, // Search by genre
    ],
  });
};

export const filterBooks = async (filters) => {
  const { category, sort, condition, priceRange } = filters;

  const query = {};
  if (category && category !== "All") {
    query.genre = category;
  }
  if (condition && condition !== "All") {
    query.condition = condition;
  }
  if (priceRange) {
    const [minPrice, maxPrice] = priceRange.split("-").map(Number);
    query.price = { $gte: minPrice, $lte: maxPrice }; // Adjusted for INR
  }

  let books = await Book.find(query);

  if (sort) {
    if (sort === "priceLowToHigh") {
      books = books.sort((a, b) => a.price - b.price);
    } else if (sort === "priceHighToLow") {
      books = books.sort((a, b) => b.price - a.price);
    } else if (sort === "newestFirst") {
      books = books.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }

  return books;
=======
>>>>>>> d3cc9eae2fce0ee8716ec4b262dbc227a5a0ac94
};