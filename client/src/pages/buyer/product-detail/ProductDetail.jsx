//client/src/pages/buyer/product-detail/ProductDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaStar, FaHeart, FaShoppingCart, FaHome, FaChevronRight } from "react-icons/fa";
import { getProductDetail, addToCart, addToWishlist } from "../../../services/buyer.services.js";

const ProductDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [isInCart, setIsInCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [buyerName, setBuyerName] = useState("Buyer");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const response = await getProductDetail(id);
      if (response.success) {
        setBook(response.data.book);
        setIsInCart(response.data.isInCart);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to fetch book details");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      const response = await addToCart({ bookId: id, quantity: 1 });
      if (response.success) {
        alert("Book added to cart successfully!");
        setIsInCart(true);
      } else {
        alert(response.message);
      }
    } catch (err) {
      alert("Error adding to cart");
    }
  };

  const handleAddToWishlist = async () => {
    try {
      const response = await addToWishlist(id);
      if (response.success) {
        alert("Added to wishlist!");
      } else {
        alert(response.message);
      }
    } catch (err) {
      alert("Error adding to wishlist");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!book) return <div className="min-h-screen flex items-center justify-center">Book not found</div>;

  return (
    <div className="bg-gray-50">
      {/* Navbar - similar */}
      <nav className="fixed w-full bg-white shadow-sm z-50">
        {/* ... */}
      </nav>

      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex mb-8" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1">
              <li className="inline-flex items-center">
                <Link to="/buyer/dashboard" className="text-gray-700 hover:text-purple-600 flex items-center">
                  <FaHome className="mr-2" /> Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <FaChevronRight className="text-gray-400 mx-2" />
                  <span className="text-gray-500">{book.title}</span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Product Details */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              {/* Image */}
              <div className="space-y-4">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-96 object-cover rounded-lg transform transition duration-500 hover:scale-105"
                />
              </div>

              {/* Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
                  <p className="text-lg text-gray-600 mt-2">{book.author}</p>
                  <p className="text-gray-600">Genre: {book.genre}</p>
                </div>

                <div className="flex items-center">
                  <span className="ml-2 text-gray-600">{book.rating} ({book.reviews.length})</span>
                  <span className="text-green-600 ml-4">In Stock ({book.quantity})</span>
                </div>

                <div className="border-t border-b py-4">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">₹{book.price}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Link to="/buyer/cart" className="block w-full text-center bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700">
                    Buy Now
                  </Link>
                  <div className="grid grid-cols-2 gap-4">
                    {isInCart ? (
                      <Link to="/buyer/cart" className="col-span-2 flex items-center justify-center space-x-2 bg-purple-600 text-white py-3 rounded-lg">
                        <FaShoppingCart /> Go to Cart
                      </Link>
                    ) : (
                      <button onClick={handleAddToCart} className="flex items-center justify-center space-x-2 border border-purple-600 text-purple-600 py-3 rounded-lg hover:bg-purple-50">
                        <FaShoppingCart /> Add to Cart
                      </button>
                    )}
                    <button onClick={handleAddToWishlist} className="flex items-center justify-center space-x-2 border border-purple-600 text-purple-600 hover:text-red-500 py-3 rounded-lg">
                      <FaHeart className="far fa-heart" /> Add to Wishlist
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Description</h3>
                  <p className="text-gray-600">{book.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-6">Customer Reviews</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {book.reviews.length > 0 ? (
                book.reviews.map((review) => (
                  <div key={review._id} className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-start space-x-4">
                      <img
                        src={`https://ui-avatars.com/api/?name=${review.buyer.firstname}+${review.buyer.lastname}`}
                        alt={review.buyer.firstname}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{review.buyer.firstname} {review.buyer.lastname}</h4>
                          <span className="text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex text-yellow-400 my-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < review.rating ? "fas" : "far"} />
                          ))}
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 col-span-2">No reviews yet. Be the first to review this book!</p>
              )}
            </div>
          </div>

          {/* Similar Books - hardcoded as in EJS */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6">You May Also Like</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* hardcoded books */}
              <div className="bg-white rounded-lg shadow-md p-4 cursor-pointer">
                <img src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300" alt="Book" className="w-full h-48 object-cover rounded" />
                <h4 className="font-semibold mt-2">Atomic Habits</h4>
                <p className="text-gray-600 text-sm">James Clear</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold text-purple-600">$24.99</span>
                  <FaHeart className="text-gray-400 hover:text-purple-600" />
                </div>
              </div>
              {/* repeat for 3 more */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;