import Book from "../models/Book.js";

export const addReview = async (req, res) => {
  const { bookId, rating, comment } = req.body;

  try {
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const review = {
      buyer: req.user.id,
      rating,
      comment,
      createdAt: new Date(),
    };

    book.reviews.push(review);

    
    const totalRatings = book.reviews.reduce((sum, review) => sum + review.rating, 0);
    book.rating = totalRatings / book.reviews.length;

    await book.save();

    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    res.status(500).json({ message: "Error adding review", error });
  }
};