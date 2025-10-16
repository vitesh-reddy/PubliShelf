//services/buyer.services.js
import bcrypt from "bcrypt";
import Buyer from "../models/Buyer.model.js";
import Publisher from "../models/Publisher.model.js";
import Book from "../models/Book.model.js";

export const createBuyer = async (buyerData) => {
  const newBuyer = new Buyer(buyerData);
  return await newBuyer.save();
};

export const getAllBuyers = async () => {
  return await Buyer.find();
};

export const getBuyerById = async (buyerId) => {
  return await Buyer.findById(buyerId).populate("cart.book").populate("wishlist");
};

export const updateBuyerCart = async (buyerId, cart) => {
  return await Buyer.findByIdAndUpdate(buyerId, { cart }, { new: true });
};

export const updateBuyerWishlist = async (buyerId, wishlist) => {
  return await Buyer.findByIdAndUpdate(buyerId, { wishlist }, { new: true });
};

export const addOrderToBuyer = async (buyerId, order) => {
  return await Buyer.findByIdAndUpdate(
    buyerId,
    { $push: { orders: order } },
    { new: true }
  ).populate("orders.book");
};

export const getAllOrders = async () => {
  return await Buyer.aggregate([
    { $unwind: "$orders" },
    {
      $lookup: {
        from: "books",
        localField: "orders.book",
        foreignField: "_id",
        as: "bookDetails",
      },
    },
    { $unwind: "$bookDetails" },
    {
      $project: {
        _id: 0,
        buyerName: { $concat: ["$firstname", " ", "$lastname"] },
        email: "$email",
        book: "$bookDetails",
        quantity: "$orders.quantity",
        delivered: "$orders.delivered",
        orderDate: "$orders.orderDate",
      },
    },
  ]);
};

export const updateCartItemQuantity = async (buyerId, bookId, quantity) => {
  const buyer = await Buyer.findById(buyerId);
  if (!buyer) {
    throw new Error("Buyer not found");
  }

  const cartItem = buyer.cart.find((item) => item.book.toString() === bookId);
  if (!cartItem) {
    throw new Error("Item not found in cart");
  }

  cartItem.quantity = quantity;
  await buyer.save();
  return buyer;
};

export const placeOrder = async (buyerId, cart) => {
  const buyer = await Buyer.findById(buyerId);
  if (!buyer) {
    throw new Error("Buyer not found");
  }

  const newOrders = cart.map((item) => ({
    book: item.book,
    quantity: item.quantity,
    orderDate: new Date(),
    delivered: false,
  }));
  buyer.orders.push(...newOrders);

  buyer.cart = [];

  await buyer.save();
  return buyer;
};

export const updateBuyerDetails = async (buyerId, currentPassword, updatedData) => {
  const buyer = await Buyer.findById(buyerId);
  if (!buyer) throw new Error("Buyer not found");

  const isPasswordValid = await bcrypt.compare(currentPassword, buyer.password);
  if (!isPasswordValid) throw new Error("Incorrect Password");

  if (updatedData.email && updatedData.email !== buyer.email) {
    const existingBuyer = await Buyer.findOne({ email: updatedData.email });
    if (existingBuyer) throw new Error("Email already exists");
  }
  Object.assign(buyer, updatedData);
  return await buyer.save();
};

export const getTopSoldBooks = async () => {
  try {
    const topBooks = await Buyer.aggregate([
      { $unwind: "$orders" },
      {
        $group: {
          _id: "$orders.book",
          totalSold: { $sum: "$orders.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 8 },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      { $unwind: "$bookDetails" },
      {
        $project: {
          _id: "$bookDetails._id",
          title: "$bookDetails.title",
          author: "$bookDetails.author",
          price: "$bookDetails.price",
          image: "$bookDetails.image",
          rating: "$bookDetails.rating",
          totalSold: 1,
        },
      },
    ]);

    return topBooks;
  } catch (error) {
    throw new Error("Failed to fetch top sold books: " + error.message);
  }
};

export const getTrendingBooks = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const trendingBooks = await Buyer.aggregate([
      { $unwind: "$orders" },
      {
        $match: {
          "orders.orderDate": { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: "$orders.book",
          totalOrdered: { $sum: "$orders.quantity" },
        },
      },
      { $sort: { totalOrdered: -1 } },
      { $limit: 8 },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      { $unwind: "$bookDetails" },
      {
        $project: {
          _id: "$bookDetails._id",
          title: "$bookDetails.title",
          author: "$bookDetails.author",
          price: "$bookDetails.price",
          image: "$bookDetails.image",
          rating: "$bookDetails.rating",
          totalOrdered: 1,
        },
      },
    ]);

    return trendingBooks;
  } catch (error) {
    throw new Error("Failed to fetch trending books: " + error.message);
  }
};

export const getMetrics = async () => {
  try {
    const booksAvailable = await Book.countDocuments({ quantity: { $gt: 0 } });
    const activeReaders = await Buyer.countDocuments({ orders: { $ne: [] } });
    const publishers = await Publisher.countDocuments();
    const booksSold = await Buyer.aggregate([
      { $unwind: "$orders" },
      {
        $group: {
          _id: null,
          totalSold: { $sum: "$orders.quantity" },
        },
      },
      {
        $project: {
          _id: 0,
          totalSold: 1,
        },
      },
    ]).then((result) => (result.length > 0 ? result[0].totalSold : 0));

    return {
      booksAvailable,
      activeReaders,
      publishers,
      booksSold,
    };
  } catch (error) {
    throw new Error("Failed to fetch book metrics: " + error.message);
  }
};