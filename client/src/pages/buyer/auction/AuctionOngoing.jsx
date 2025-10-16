//client/src/pages/buyer/auction/AuctionOngoing.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHome, FaChevronRight, FaGavel, FaInfoCircle } from "react-icons/fa";
import { getAuctionOngoing, placeBidApi } from "../../../services/antiqueBook.services.js";

const AuctionOngoing = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [showBidModal, setShowBidModal] = useState(false);
  const [modalBidAmount, setModalBidAmount] = useState(0);
  const [formError, setFormError] = useState("");
  const [countdown, setCountdown] = useState("00:00:00");
  const [progress, setProgress] = useState(0);
  const [buyerName, setBuyerName] = useState("Buyer");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAuction();
    const interval = setInterval(() => {
      updateCountdown();
    }, 1000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchAuction = async () => {
    try {
      setLoading(true);
      const response = await getAuctionOngoing(id);
      if (response.success) {
        setBook(response.data.book);
        updateCountdown();
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to fetch auction");
    } finally {
      setLoading(false);
    }
  };

  const updateCountdown = () => {
    if (!book) return;
    const now = new Date();
    const end = new Date(book.auctionEnd);
    if (now >= end) {
      setCountdown("Auction Ended");
      setProgress(100);
      return;
    }
    const diff = end - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);

    const start = new Date(book.auctionStart);
    const total = end - start;
    const elapsed = now - start;
    const prog = Math.min((elapsed / total) * 100, 100);
    setProgress(prog);
  };

  const handlePlaceBid = () => {
    const current = book.currentPrice || book.basePrice;
    const minBid = current + 100;
    if (!bidAmount || parseInt(bidAmount) < minBid) {
      setFormError(`Bid must be at least ₹${minBid}`);
      return;
    }
    setFormError("");
    setModalBidAmount(parseInt(bidAmount));
    setShowBidModal(true);
  };

  const confirmBid = async () => {
    try {
      const response = await placeBidApi({ auctionId: id, bidAmount: modalBidAmount });
      if (response.success) {
        alert("Bid placed successfully!");
        fetchAuction();
        setShowBidModal(false);
        setBidAmount("");
      } else {
        alert(response.message);
      }
    } catch (err) {
      alert("Error placing bid");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!book) return <div className="min-h-screen flex items-center justify-center">Auction not found</div>;

  const isActive = new Date() <= new Date(book.auctionEnd);

  return (
    <div className="bg-gray-50">
      {/* Navbar */}
      <nav className="fixed w-full bg-white shadow-sm z-50">
        {/* ... */}
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
                  <Link to="/buyer/auction-page" className="text-gray-700 hover:text-purple-600">Auctions</Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <FaChevronRight className="text-gray-400 mx-2" />
                  <span className="text-gray-500">{book.title}</span>
                </div>
              </li>
            </ol>
          </nav>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-96 object-cover"
                  />
                  {isActive && <span className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold animate-pulse">Live</span>}
                </div>
                {/* Document Carousel - implement as needed */}
                <div className="flex overflow-x-auto space-x-3">
                  {/* auth images */}
                  <img src={book.authenticationImage || "placeholder"} alt="Auth" className="h-24 w-24 rounded object-cover flex-shrink-0" />
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
                  <p className="text-lg text-gray-600 mt-1">{book.author}</p>
                  <p className="text-gray-600 text-sm">Genre: {book.genre}</p>
                  <p className="text-gray-600 text-sm">Condition: {book.condition}</p>
                </div>

                <div className="flex items-center space-x-3 text-sm">
                  <span className={`font-medium ${isActive ? "text-green-600" : "text-red-600"}`}>Active Auction</span>
                  <span className="text-gray-600">Ends in: <span className="font-semibold">{countdown}</span></span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Time Remaining</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-purple-600 h-1.5 rounded-full transition-width duration-500" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="border-t border-b py-3">
                  <div className="flex items-baseline space-x-4">
                    <div>
                      <span className="text-3xl font-bold text-gray-900">₹{book.currentPrice || book.basePrice}</span>
                      <p className="text-gray-600 text-xs">Current Bid</p>
                    </div>
                    <div>
                      <span className="text-lg text-gray-600">₹{book.basePrice}</span>
                      <p className="text-gray-600 text-xs">Base Price</p>
                    </div>
                  </div>
                </div>

                {/* Bid Form */}
                <div className="space-y-3">
                  <div className="relative">
                    <label className="text-gray-600 text-sm block mb-1">Your Bid (₹)</label>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      min={(book.currentPrice || book.basePrice) + 100}
                      placeholder={`Enter bid (min ₹${(book.currentPrice || book.basePrice) + 100})`}
                      className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      disabled={!isActive}
                    />
                    <FaInfoCircle className="absolute right-3 top-12 text-gray-400 cursor-pointer text-sm" title="Minimum ₹100 increment" />
                  </div>
                  <button onClick={handlePlaceBid} disabled={!isActive} className={`w-full py-3 rounded-lg flex items-center justify-center space-x-2 text-sm ${isActive ? "bg-purple-600 text-white hover:bg-purple-700" : "bg-gray-400 text-gray-500 cursor-not-allowed"}`}>
                    <FaGavel />
                    <span>{isActive ? "Place Bid" : "Auction Ended"}</span>
                  </button>
                  {formError && <p className="text-red-600 text-xs">{formError}</p>}
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-semibold">Description</h3>
                  <p className="text-gray-600 text-sm">{book.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bidding History */}
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-4">Bidding History</h3>
            <div className="bg-white rounded-xl shadow-lg p-5">
              {book.biddingHistory && book.biddingHistory.length > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-4 pb-3 border-b">
                    <p className="text-sm text-gray-600">Total Bids: <span className="font-semibold">{book.biddingHistory.length}</span></p>
                    <p className="text-sm text-gray-600">Highest Bid: <span className="font-bold text-purple-600">₹{Math.max(...book.biddingHistory.map(b => b.bidAmount))}</span></p>
                  </div>
                  <div className="space-y-3">
                    {book.biddingHistory.sort((a, b) => new Date(b.bidTime) - new Date(a.bidTime)).map((bid, index) => (
                      <div key={bid._id} className={`flex items-center justify-between p-3 rounded-md ${index === 0 ? "bg-purple-50 border-l-4 border-purple-400" : ""} hover:bg-gray-50`}>
                        <div className="flex items-center space-x-3">
                          <img
                            src={`https://ui-avatars.com/api/?name=${bid.bidder?.firstname || "Anonymous"}&background=random&color=fff`}
                            alt="Bidder"
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-semibold text-gray-800">{bid.bidder?.firstname} {bid.bidder?.lastname || ""}</p>
                            <p className="text-xs text-gray-500">{bid.bidder?.email || "N/A"} • {new Date(bid.bidTime).toLocaleString()}</p>
                          </div>
                        </div>
                        <p className="font-bold text-purple-600">₹{bid.bidAmount}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <FaGavel className="text-4xl text-gray-400 mb-2 mx-auto" />
                  <p className="text-gray-600">No bids yet.</p>
                  <p className="text-sm text-gray-500">Be the first to place a bid!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bid Modal */}
      {showBidModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-5 w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Bid</h3>
            <p className="text-gray-600 text-sm mb-4">Place a bid of <span className="font-bold text-purple-600">₹{modalBidAmount}</span> for {book.title}?</p>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowBidModal(false)} className="px-3 py-2 text-gray-600 border rounded hover:bg-gray-100">
                Cancel
              </button>
              <button onClick={confirmBid} className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionOngoing;