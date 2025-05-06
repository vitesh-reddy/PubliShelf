import Buyer from "../models/Buyer.js";

export const createBuyer = async (buyerData) => {
  const newBuyer = new Buyer(buyerData);
  return await newBuyer.save();
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
