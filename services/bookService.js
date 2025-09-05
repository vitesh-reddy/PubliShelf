import Book from "../models/Book.js";

export const getAllBooks = async () => {
  return await Book.find();
};

export const getBookById = async (bookId) => {
  return await Book.findById(bookId).populate("reviews.buyer").populate("publisher");
};

export const addReviewToBook = async (bookId, review) => {
  const book = await Book.findById(bookId);

  if (!book) {
    throw new Error("Book not found");
  }

  book.reviews.push(review);

  
  const totalRatings = book.reviews.reduce((sum, review) => sum + review.rating, 0);
  book.rating = totalRatings / book.reviews.length;

  return await book.save();
};


export const createBook = async (bookData) => {
  const newBook = new Book(bookData);
  return await newBook.save();
};

export const searchBooks = async (query) => {
  if (!query) {
    return []; 
  }

  return await Book.find({
    $or: [
      { title: { $regex: query, $options: "i" } }, 
      { author: { $regex: query, $options: "i" } }, 
      { genre: { $regex: query, $options: "i" } }, 
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
    query.price = { $gte: minPrice, $lte: maxPrice }; 
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
};