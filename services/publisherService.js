import Publisher from "../models/Publisher.js";

export const getPublisherById = async (publisherId) => {
  return await Publisher.findById(publisherId).populate("books");
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
};