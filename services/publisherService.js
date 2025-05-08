import Publisher from "../models/Publisher.js";

export const getPublisherById = async (publisherId) => {
<<<<<<< HEAD
  return await Publisher.findById(publisherId).populate({
    path: "books",
    options: { sort: { publishedAt: -1 } }, // Sort books by publishedAt in descending order
  });
=======
  return await Publisher.findById(publisherId).populate("books");
>>>>>>> d3cc9eae2fce0ee8716ec4b262dbc227a5a0ac94
};

export const addBookToPublisher = async (publisherId, bookId) => {
  const publisher = await Publisher.findById(publisherId);
  publisher.books.push(bookId);
  return await publisher.save();
};

export const getAllPublishers = async () => {
  return await Publisher.find().populate("books");
};
export const getPublisherByEmail = async (email) => {
  return await Publisher.findOne({ email });
};

// Create a new publisher
export const createPublisher = async ({ firstname, lastname, publishingHouse, email, password }) => {
  const newPublisher = new Publisher({
    firstname,
    lastname,
    publishingHouse,
    email,
    password,
  });

  return await newPublisher.save();
<<<<<<< HEAD
};

export const deletePublisherById = async (publisherId) => {
  return await Publisher.findByIdAndDelete(publisherId); // Delete the publisher by ID
=======
>>>>>>> d3cc9eae2fce0ee8716ec4b262dbc227a5a0ac94
};