import AntiqueBook from "../models/AntiqueBook.js";

export const addBid = async (bookId, bidderId, bidAmount) => {
  const book = await AntiqueBook.findById(bookId);

  if (!book) {
    throw new Error("Antique book not found");
  }

  // Add the new bid to the bidding history
  book.biddingHistory.push({
    bidder: bidderId,
    bidAmount,
  });

  // Update the current price
  book.currentPrice = bidAmount;

  await book.save();
  return book;
};

export const createAntiqueBook = async (bookData) => {
  try {
    const newAntiqueBook = new AntiqueBook(bookData);
    return await newAntiqueBook.save();
  } catch (error) {
    console.error("Error creating antique book:", error);
    throw new Error("Failed to create antique book.");
  }
};