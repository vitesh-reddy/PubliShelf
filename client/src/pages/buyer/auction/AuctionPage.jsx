//client/src/pages/buyer/auction/AuctionPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaUser, FaBookOpen, FaHome, FaChevronRight } from "react-icons/fa";
import { getAuctionPage } from "../../../services/antiqueBook.services.js";

const AuctionPage = () => {
  const [auctions, setAuctions] = useState({ ongoingAuctions: [], futureAuctions: [], endedAuctions: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [buyerName, setBuyerName] = useState("Buyer");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const response = await getAuctionPage();
      if (response.success) {
        setAuctions(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to fetch auctions");
    } finally {
      setLoading(false);
    }
  };

  const formatTimeRemaining = (endDate) => {
    const now = new Date();
    const diff = new Date(endDate) - now;
    if (diff <= 0) return "Ended";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="bg-gray-50">
      {/* Navbar */}
      <nav className="fixed w-full bg-white shadow-sm z-50">
        {/* similar navbar */}
      </nav>

      <div className="pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex mb-6">
            <ol className="inline-flex items-center space-x-1">
              <li>
                <Link to="/buyer/dashboard" className="text-gray-700 hover:text-purple-600 flex items-center">
                  <FaHome className="mr-2" /> Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <FaChevronRight className="text-gray-400 mx-2" />
                  <span className="text-gray-500">Auctions</span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Ongoing Auctions */}
          {auctions.ongoingAuctions.length > 0 && (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Ongoing Auctions</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                {auctions.ongoingAuctions.map((book) => (
                  <div key={book._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:-translate-y-1 transition">
                    <img src={book.image} alt={book.title} className="w-full h-64 object-cover" />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900">{book.title}</h3>
                      <p className="text-gray-600 text-sm">{book.author}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <div>
                          <p className="text-gray-600 text-sm">Current Bid</p>
                          <p className="text-lg font-bold text-purple-600">₹{book.currentPrice || book.basePrice}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Ends in</p>
                          <p className="text-sm font-semibold">{formatTimeRemaining(book.auctionEnd)}</p>
                        </div>
                      </div>
                      <Link to={`/buyer/auction-item-detail/${book._id}`} className="mt-4 block w-full bg-purple-600 text-white text-center py-2 rounded-lg hover:bg-purple-700">
                        View Auction
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Future Auctions */}
          {auctions.futureAuctions.length > 0 && (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Upcoming Auctions</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                {auctions.futureAuctions.map((book) => (
                  <div key={book._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:-translate-y-1 transition">
                    <img src={book.image} alt={book.title} className="w-full h-64 object-cover" />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900">{book.title}</h3>
                      <p className="text-gray-600 text-sm">{book.author}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <div>
                          <p className="text-gray-600 text-sm">Starting Bid</p>
                          <p className="text-lg font-bold text-purple-600">₹{book.basePrice}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Starts in</p>
                          <p className="text-sm font-semibold">{formatTimeRemaining(book.auctionStart)}</p>
                        </div>
                      </div>
                      <Link to={`/buyer/auction-item-detail/${book._id}`} className="mt-4 block w-full bg-purple-600 text-white text-center py-2 rounded-lg hover:bg-purple-700">
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Ended Auctions */}
          {auctions.endedAuctions.length > 0 && (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Past Auctions</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {auctions.endedAuctions.map((book) => (
                  <div key={book._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:-translate-y-1 transition">
                    <img src={book.image} alt={book.title} className="w-full h-64 object-cover" />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900">{book.title}</h3>
                      <p className="text-gray-600 text-sm">{book.author}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <div>
                          <p className="text-gray-600 text-sm">Final Price</p>
                          <p className="text-lg font-bold text-purple-600">₹{book.currentPrice || "Not sold"}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Status</p>
                          <p className="text-sm font-semibold">{book.currentPrice ? "Sold" : "Not sold"}</p>
                        </div>
                      </div>
                      <Link to={`/buyer/auction-item-detail/${book._id}`} className="mt-4 block w-full bg-purple-600 text-white text-center py-2 rounded-lg hover:bg-purple-700">
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {auctions.ongoingAuctions.length === 0 && auctions.futureAuctions.length === 0 && auctions.endedAuctions.length === 0 && (
            <div className="text-center py-12">
              <FaBookOpen className="text-5xl text-gray-300 mb-4 mx-auto" />
              <h2 className="text-2xl font-semibold text-gray-700">No auctions available</h2>
              <p className="text-gray-500 mt-2">Check back later for new antique book auctions</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer with modals for T&C and Privacy - similar to EJS */}
      <footer className="bg-gray-800 text-gray-300 py-6">
        {/* ... */}
      </footer>
    </div>
  );
};

export default AuctionPage;