//client/src/pages/buyer/dashboard/components/BookCard.jsx
import React from "react";

const BookCard = ({ book, onClick, showSold = false, isTrending = false, idx }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-[5px] hover:shadow-lg cursor-pointer" onClick={onClick}>
      <div className="relative">
        <img src={book.image} alt={book.title} className="w-full h-64 object-cover" />
        {isTrending && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
            #{idx + 1}
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-lg font-semibold mb-1 truncate">{book.title}</h3>
        <p className="text-gray-600 text-sm mb-2">by {book.author}</p>
        <div className="flex justify-between items-center">
          {showSold && (
            <span className="text-purple-600 text-sm">Total Sold: {book.totalSold}</span>
          )}
          {!showSold && isTrending && <span className="text-purple-600 text-sm">Trending</span>}
          <span className="font-bold text-purple-600 text-sm">₹{book.price}</span>
        </div>
      </div>
    </div>
  );
};

export default BookCard;