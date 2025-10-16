//client/src/pages/buyer/search/components/BookGrid.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

const BookGrid = ({ books, viewMode, onWishlistAdd }) => {
  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {books.map((book) => (
          <div key={book._id} className="flex bg-white p-4 rounded-lg shadow-md">
            <img src={book.image} alt={book.title} className="w-20 h-28 object-cover mr-4" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{book.title}</h3>
              <p className="text-gray-600">{book.author}</p>
              <p className="text-sm text-gray-500">₹{book.price}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => onWishlistAdd(book._id)} className="text-gray-600 hover:text-red-500">
                <FaHeart />
              </button>
              <Link to={`/buyer/product-detail/${book._id}`} className="bg-purple-600 text-white px-4 py-2 rounded">View</Link>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {books.map((book) => (
        <div key={book._id} className="relative bg-white rounded-lg shadow-md overflow-hidden">
          <img src={book.image} alt={book.title} className="w-full h-40 object-cover" />
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-1">{book.title}</h3>
            <p className="text-gray-600 text-sm">{book.author}</p>
            <button
              onClick={() => onWishlistAdd(book._id)}
              className="absolute bottom-4 right-4 wishlist-btn text-gray-600 hover:text-red-500"
            >
              <FaHeart className="text-xl" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookGrid;