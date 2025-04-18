import Book from "./models/Book.js";
import Buyer from "./models/Buyer.js";

const addReview = async (bookId, buyerId, rating, comment) => {
  const book = await Book.findById(bookId);
  if (!book) throw new Error("Book not found");

  const review = {
    buyer: buyerId,
    rating,
    comment,
  };

  book.reviews.push(review);

  // Update the average rating
  const totalRatings = book.reviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );
  book.rating = totalRatings / book.reviews.length;

  await book.save();
  console.log("Review added successfully");
};

export { addReview };
