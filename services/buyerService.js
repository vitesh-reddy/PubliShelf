import Buyer from "../models/Buyer.js";

export const createBuyer = async (buyerData) => {
  const newBuyer = new Buyer(buyerData);
  return await newBuyer.save();
};

export const getAllBuyers = async () => {
  return await Buyer.find(); // Fetch all buyers
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
    { $push: { orders: order } }, // Add the order to the orders array
    { new: true }
  ).populate("orders.book"); // Populate the book details in the orders
};

export const getAllOrders = async () => {
  return await Buyer.aggregate([
    { $unwind: "$orders" }, // Unwind the orders array
    {
      $lookup: {
        from: "books", // Reference the books collection
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

  const cartItem = buyer.cart.find(item => item.book.toString() === bookId);
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

  // Add cart items to orders
  const newOrders = cart.map(item => ({
      book: item.book,
      quantity: item.quantity,
      orderDate: new Date(),
      delivered: false,
  }));
  buyer.orders.push(...newOrders);

  // Empty the cart
  buyer.cart = [];

  // Save the updated buyer
  await buyer.save();
  return buyer;
};
