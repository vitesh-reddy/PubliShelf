//client/src/pages/buyer/auction/components/AuctionCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const AuctionCard = ({ book, type }) => {
  const isOngoing = type === "ongoing";
  const currentPrice = isOngoing ? (book.currentPrice || book.basePrice) : book.basePrice;
  const label = isOngoing ? "Current Bid" : "Starting Bid";
  const timeLabel = isOngoing ? "Ends in" : "Starts in";
  const timeValue = isOngoing ? book.auctionEnd : book.auctionStart; // pass dates as props

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:-translate-y-1 transition-shadow">
      <img src={book.image} alt={book.title} className="w-full h-64 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{book.title}</h3>
        <p className="text-gray-600 text-sm">{book.author}</p>
        <div className="mt-2 flex justify-between items-center">
          <div>
            <p className="text-gray-600 text-sm">{label}</p>
            <p className="text-lg font-bold text-purple-600">₹{currentPrice}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">{timeLabel}</p>
            <p className="text-sm font-semibold">{/* countdown component */}00:00:00</p>
          </div>
        </div>
        <Link to={`/buyer/auction-item-detail/${book._id}`} className="mt-4 block w-full bg-purple-600 text-white text-center py-2 rounded-lg hover:bg-purple-700">
          {isOngoing ? "View Auction" : "View Details"}
        </Link>
      </div>
    </div>
  );
};

export default AuctionCard;