//client/src/pages/buyer/cart/Cart.jsx
import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { updateCartQuantity, removeFromCart } from "../../../services/buyer.services.js";
import { useDispatch } from 'react-redux';
import { updateCartQuantity as updateCartInStore, removeFromCart as removeFromCartInStore } from '../../../store/slices/cartSlice';
import { removeFromWishlist as removeFromWishlistInStore } from '../../../store/slices/wishlistSlice';
import { useCart, useWishlist } from '../../../store/hooks';
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const Cart = () => {
  const dispatch = useDispatch();
  const { items: cartItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const navigate = useNavigate();

  // Calculate totals from cart items
  const cartTotals = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.book?.price || 0) * item.quantity, 0);
    const shipping = subtotal > 35 ? 0 : 35;
    const tax = subtotal * 0.18;
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total };
  }, [cartItems]);

  // Optimistic update: update store first, then backend
  const handleQuantityChange = async (bookId, newQuantity) => {
    if (newQuantity < 1) return;
    
    // Update store immediately (optimistic)
    dispatch(updateCartInStore({ bookId, quantity: newQuantity }));
    
    // Sync with backend
    try {
      const response = await updateCartQuantity({ bookId, quantity: newQuantity });
      if (!response.success) {
        // Revert on failure - would need to fetch fresh data
        alert(response.message || "Failed to update quantity");
      }
    } catch (err) {
      alert("Error updating quantity");
    }
  };

  // Optimistic update: remove from store first, then backend
  const handleRemoveFromCart = async (bookId) => {
    if (!confirm("Remove this item from cart?")) return;
    
    // Update store immediately (optimistic)
    dispatch(removeFromCartInStore({ bookId }));
    
    // Sync with backend
    try {
      const response = await removeFromCart(bookId);
      if (!response.success) {
        alert(response.message);
      }
    } catch (err) {
      alert("Error removing item");
    }
  };

  const handleAddToCartFromWishlist = async (bookId) => {
    // For now, just show message - implement add to cart logic
    alert("Add to cart from wishlist - implement this with your backend");
  };

  const handleRemoveFromWishlist = async (bookId) => {
    // Update store immediately (optimistic)
    dispatch(removeFromWishlistInStore({ bookId }));
    
    // Sync with backend
    try {
      // Call your backend wishlist remove API
      alert("Removed from wishlist!");
    } catch (err) {
      alert("Error removing from wishlist");
    }
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }
    navigate("/buyer/checkout");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-16">
        <div className="max-w-7xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Cart Section */}
            <div className="lg:w-2/3">
              <div className="overflow-hidden bg-white rounded-xl shadow-lg">
                <div className="p-6 border-b border-gray-300">
                  <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
                  <p id="cart-count-text" className="mt-1 text-gray-500">
                    You have {cartItems.length} items in your cart
                  </p>
                </div>
                <div id="cart-items" className="divide-y divide-gray-300">
                  {cartItems.map((item, idx) => (
                    <div
                      key={item._id + idx}
                      className="flex items-center p-6 space-x-4 cart-item"
                      data-book-id={item.book._id}
                    >
                      <img
                        src={item.book.image}
                        alt={item.book.title}
                        className="object-contain w-24 h-32 rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          <Link to={`/buyer/product/${item.book._id}`}>{item.book.title}</Link>
                        </h3>
                        <p className="text-gray-600">by {item.book.author}</p>
                        <div className="flex items-center mt-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => {
                              const rating = item.rating || 0;
                              const floorRating = Math.floor(rating);
                              const hasHalf = rating % 1 >= 0.5 && i === floorRating;

                              let starClass = "far fa-star";
                              if (i < floorRating)
                                starClass = "fas fa-star";
                              else if (hasHalf)
                                starClass = "fas fa-star-half-alt";

                              return <i key={i} className={starClass}></i>;
                            })}
                          </div>
                          <span className="ml-2 text-gray-600">{item.book.rating || 0}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            type="button"
                            className="px-3 py-1 text-gray-600 hover:text-purple-600 decrement-btn"
                            data-book-id={item.book._id}
                            onClick={() => handleQuantityChange(item.book._id, item.quantity - 1)}
                          >
                            <i className="fas fa-minus"></i> 
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            min="1"
                            max={item.book.quantity}
                            className="w-12 text-center border-x border-gray-300 focus:outline-none focus:ring-0 quantity-input"
                            data-book-id={item.book._id}
                            onChange={(e) => handleQuantityChange(item.book._id, parseInt(e.target.value))}
                          />
                          <button
                            type="button"
                            className="px-3 py-1 text-gray-600 hover:text-purple-600 increment-btn"
                            data-book-id={item.book._id}
                            onClick={() => handleQuantityChange(item.book._id, item.quantity + 1)}
                          >
                            <i className="fas fa-plus"></i> 
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900 unit-price" data-unit-price={item.book.price}>
                            ₹{item.book.price}
                          </p>
                          <p className="text-sm text-gray-600">
                            Item total: ₹<span className="line-total">{(item.book.price * item.quantity).toFixed(2)}</span>
                          </p>
                          <button
                            type="button"
                            className="text-sm text-red-500 hover:text-red-600 remove-from-cart-btn"
                            data-book-id={item.book._id}
                            onClick={() => handleRemoveFromCart(item.book._id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wishlist Section */}
              <div id="wishlist-section" className="mt-8 overflow-hidden bg-white rounded-xl shadow-lg">
                <div className="p-6 border-b border-gray-300">
                  <h2 className="text-2xl font-bold text-gray-900">Wishlist</h2>
                  <p className="mt-1 text-gray-500">You have {wishlistItems.length} items in your wishlist</p>
                </div>
                <div className="divide-y">
                  {wishlistItems.map((item, idx) => (
                    <div
                      key={item._id + idx}
                      className="flex items-center p-6 space-x-4 wishlist-item border-b border-gray-300"
                      data-book-id={item._id}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="object-contain w-24 h-32 rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                        <p className="text-gray-600">by {item.author}</p>
                        <div className="flex items-center mt-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => {
                              const rating = item.rating || 0;
                              const floorRating = Math.floor(rating);
                              const hasHalf = rating % 1 >= 0.5 && i === floorRating;

                              let starClass = "far fa-star";
                              if (i < floorRating)
                                starClass = "fas fa-star";
                              else if (hasHalf)
                                starClass = "fas fa-star-half-alt";

                              return <i key={i} className={starClass}></i>;
                            })}
                          </div>
                          <span className="ml-2 text-gray-600">{item.rating || 0}</span>
                        </div>
                      </div>
                      <div className="space-y-2 text-right">
                        <p className="text-lg font-bold text-gray-900">₹{item.price}</p>
                        <button
                          type="button"
                          className="w-full px-4 py-2 text-white transition-colors rounded-lg bg-purple-600 hover:bg-purple-700 add-to-cart-btn"
                          data-book-id={item._id}
                          data-title={item.title}
                          data-author={item.author}
                          data-price={item.price}
                          data-image={item.image}
                          data-rating={item.rating || 0}
                          onClick={() => handleAddToCartFromWishlist(item._id)}
                        >
                          Add to Cart
                        </button>
                        <button
                          className="text-sm text-red-500 hover:text-red-600 remove-from-wishlist-btn"
                          data-book-id={item._id}
                          onClick={() => handleRemoveFromWishlist(item._id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="sticky top-24 overflow-hidden bg-white rounded-xl shadow-lg">
                <div className="p-6 border-b border-gray-300">
                  <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
                </div>
                <div
                  id="order-summary"
                  className="p-6 space-y-4"
                  data-tax-rate={cartTotals.subtotal > 0 ? cartTotals.tax / cartTotals.subtotal : 0}
                  data-shipping-charge="35"
                  data-shipping-threshold="35"
                >
                  <div className="flex justify-between text-gray-600">
                    <span>
                      Subtotal (<span id="summary-count">{cartItems.length}</span> items)
                    </span>
                    <span id="summary-subtotal">₹{cartTotals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span id="summary-shipping">₹{cartTotals.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span id="summary-tax">₹{cartTotals.tax.toFixed(2)}</span>
                  </div>
                  <div className="pt-4 border-t border-gray-300">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span id="summary-total">₹{cartTotals.total.toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    id="proceedToCheckoutBtn"
                    onClick={handleProceedToCheckout}
                    className={`w-full py-3 text-white transition-colors rounded-lg bg-purple-600 hover:bg-purple-700 ${
                      cartItems.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={cartItems.length === 0}
                  >
                    Proceed to Checkout
                  </button>
                  <div className="text-sm text-center text-gray-500">
                    <p>Free shipping on orders over ₹35</p>
                    <p className="mt-1">Expected delivery: 3-5 business days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inline styles from EJS */}
      <style jsx>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          margin: 0;
          -webkit-appearance: none;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>

      <Footer />
    </div>
  );
};

export default Cart;