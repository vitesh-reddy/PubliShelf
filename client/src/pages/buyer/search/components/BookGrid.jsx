//client/src/pages/buyer/search/components/BookGrid.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const BookGrid = ({ books, onWishlistAdd }) => {
  const navigate = useNavigate();
  return (
    <div id="bookGrid" className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {books.length === 0 ? (
        <div className="col-span-full text-center text-gray-500 py-10">
          No books found for selected filters.
        </div>
      ) : (
        books.map((book) => (
          <div
            key={book._id}
            className="relative bg-white rounded-lg shadow-md overflow-hidden hover:-translate-y-1 transition-transform cursor-pointer bookCardStyle"
            onClick={() =>navigate(`/buyer/product-detail/${book._id}`)}
          >
            <div className="relative w-full h-40 md:h-64 bg-gray-100 flex items-center justify-center">
              <img
                src={book.image}
                alt={book.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="p-3 md:p-4">
              <h3 className="text-lg font-semibold mb-1 truncate">{book.title}</h3>
              <p className="text-gray-600 text-sm mb-2">by {book.author}</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-purple-600 text-sm">
                  ₹{book.price}
                </span>
                <button
                  className="bottom-3 right-3 wishlist-btn text-gray-600 hover:text-red-500"
                  data-book-id={book._id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onWishlistAdd(book._id, e);
                  }}
                >
                  <i className="far fa-heart text-xl"></i>
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default BookGrid;