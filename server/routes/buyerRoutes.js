import express from "express";
import mockBuyerData from "../../public/mockData/mockBuyerData.js";
import styles from "../../public/css/styles.js";
import mockCart from "../../public/mockData/mockCart.js";
import mockWishlist from "../../public/mockData/mockWishlist.js";

const router = express.Router();

router.get("/dashboard", (req, res) =>
  res.render("buyer/dashboard", { books: mockBuyerData, styles: styles })
);
router.get("/signup", (req, res) => res.render("auth/signup-buyer"));
router.get("/product-detail", (req, res) => res.render("buyer/product-detail"));

router.get("/cart", (req, res) => {
  const calculateOrderSummary = (cart) => {
    const subtotal = cart.reduce((sum, item) => {
      return sum + parseFloat(item.price.replace("$", "")) * item.quantity;
    }, 0);

    const shipping = subtotal >= 35 ? 0 : 5.99;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
  };
  const orderSummary = calculateOrderSummary(mockCart);

  res.render("buyer/cart", {
    cart: mockCart,
    wishlist: mockWishlist,
    ...orderSummary,
  });
});

export default router;
