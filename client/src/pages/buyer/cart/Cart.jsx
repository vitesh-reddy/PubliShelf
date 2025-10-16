//client/src/pages/buyer/cart/Cart.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaUser, FaMinus, FaPlus, FaTrash, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { getCart, updateCartQuantity, removeFromCart } from "../../../services/buyer.services.js";

const Cart = () => {
  const [cartData, setCartData] = useState({ cart: [], wishlist: [], subtotal: 0, shipping: 0, tax: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [buyerName, setBuyerName] = useState("Buyer");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await getCart();
      if (response.success) {
        setCartData(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (bookId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const response = await updateCartQuantity({ bookId, quantity: newQuantity });
      if (response.success) {
        fetchCart(); // Refetch to update summary
      } else {
        alert(response.message);
      }
    } catch (err) {
      alert("Error updating quantity");
    }
  };

  const handleRemoveFromCart = async (bookId) => {
    if (!confirm("Remove this item from cart?")) return;
    try {
      const response = await removeFromCart(bookId);
      if (response.success) {
        fetchCart();
      } else {
        alert(response.message);
      }
    } catch (err) {
      alert("Error removing item");
    }
  };

  const handleProceedToCheckout = () => {
    if (cartData.cart.length === 0) {
      alert("Your cart is empty");
      return;
    }
    navigate("/buyer/checkout");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="bg-gray-50">
      {/* Navbar - similar */}
      <nav className="fixed w-full bg-white shadow-sm z-50">
        {/* ... */}
      </nav>

      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Section */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                <div className="p-6 border-b">
                  <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
                  <p className="text-gray-500 mt-1">You have {cartData.cart.length} items in your cart</p>
                </div>
                <div className="divide-y">
                  {cartData.cart.map((item) => (
                    <div key={item._id} className="p-6 flex items-center space-x-4">
                      <img src={item.book.image} alt={item.book.title} className="w-24 h-32 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{item.book.title}</h3>
                        <p className="text-gray-600">by {item.book.author}</p>
                        <div className="flex items-center mt-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className={i < Math.floor(item.book.rating) ? "fas" : "far"} />
                            ))}
                            {item.book.rating % 1 !== 0 && <FaStarHalfAlt />}
                          </div>
                          <span className="ml-2 text-gray-600">{item.book.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center border rounded-lg">
                          <button
                            onClick={() => handleQuantityChange(item.book._id, item.quantity - 1)}
                            className="px-3 py-1 text-gray-600 hover:text-purple-600"
                          >
                            <FaMinus />
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            min="1"
                            max={item.book.quantity}
                            onChange={(e) => handleQuantityChange(item.book._id, parseInt(e.target.value))}
                            className="w-12 text-center border-x focus:outline-none"
                          />
                          <button
                            onClick={() => handleQuantityChange(item.book._id, item.quantity + 1)}
                            className="px-3 py-1 text-gray-600 hover:text-purple-600"
                          >
                            <FaPlus />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">₹{item.book.price}</p>
                          <button onClick={() => handleRemoveFromCart(item.book._id)} className="text-red-500 hover:text-red-600 text-sm">
                            <FaTrash /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wishlist Section */}
              <div id="wishlist-section" className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-2xl font-bold text-gray-900">Wishlist</h2>
                  <p className="text-gray-500 mt-1">You have {cartData.wishlist.length} items in your wishlist</p>
                </div>
                <div className="divide-y">
                  {cartData.wishlist.map((item) => (
                    <div key={item._id} className="p-6 flex items-center space-x-4">
                      <img src={item.image} alt={item.title} className="w-24 h-32 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                        <p className="text-gray-600">by {item.author}</p>
                        <div className="flex items-center mt-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className={i < Math.floor(item.rating) ? "fas" : "far"} />
                            ))}
                            {item.rating % 1 !== 0 && <FaStarHalfAlt />}
                          </div>
                          <span className="ml-2 text-gray-600">{item.rating}</span>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="text-lg font-bold text-gray-900">₹{item.price}</p>
                        <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                          Add to Cart
                        </button>
                        <button className="text-red-500 hover:text-red-600 text-sm">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-gray-600">Subtotal ({cartData.cart.length} items) <span>₹{cartData.subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-gray-600">Shipping <span>₹{cartData.shipping.toFixed(2)}</span></div>
                  <div className="flex justify-between text-gray-600">Tax <span>₹{cartData.tax.toFixed(2)}</span></div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">Total <span>₹{cartData.total.toFixed(2)}</span></div>
                </div>
                <button onClick={handleProceedToCheckout} disabled={cartData.cart.length === 0} className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed">
                  Proceed to Checkout
                </button>
                <div className="text-center text-sm text-gray-500 mt-4">
                  <p>Free shipping on orders over ₹35</p>
                  <p className="mt-1">Expected delivery: 3-5 business days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;