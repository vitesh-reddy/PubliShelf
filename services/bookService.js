import Book from "../models/Book.js";

export const getAllBooks = async () => {
  return await Book.find();
};

export const getBookById = async (bookId) => {
  return await Book.findById(bookId).populate("reviews.buyer");
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
};