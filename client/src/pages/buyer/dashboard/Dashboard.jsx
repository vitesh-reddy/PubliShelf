//client/src/pages/buyer/dashboard/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getDashboard } from "../../../services/buyer.services.js";
import BookCard from "./components/BookCard.jsx";

const Dashboard = () => {
  const [data, setData] = useState({ newlyBooks: [], mostSoldBooks: [], trendingBooks: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [buyerName, setBuyerName] = useState("Buyer"); // Assume from auth context
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getDashboard();
        if (response.success) {
          setData(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/auth/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.q.value.trim();
    if (query) {
      navigate(`/buyer/search?q=${encodeURIComponent(query)}`);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="bg-gray-50">
      {/* Navbar */}
      <nav className="fixed w-full bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/buyer/dashboard" className="flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
                  PubliShelf
                </span>
              </Link>
            </div>
            <div className="flex items-center md:space-x-8 relative">
              <div className="relative">
                <form id="searchForm" onSubmit={handleSearch}>
                  <input
                    type="text"
                    id="searchInput"
                    name="q"
                    placeholder="Search books..."
                    className="w-[25vw] px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                  <button type="submit" className="absolute right-3 top-[9px] text-gray-400">
                    <i className="fas fa-search"></i>
                  </button>
                </form>
              </div>
              <Link to="/buyer/cart/#wishlist-section" className="text-gray-700 hover:text-purple-600 hidden md:block">
                <i className="far fa-heart"></i>
              </Link>
              <Link to="/buyer/cart" className="text-gray-700 hover:text-purple-600 hidden md:block">
                <i className="fas fa-shopping-cart"></i>
              </Link>
              <button
                onClick={() => navigate("/buyer/auction-page")}
                className="bg-gradient-to-r hover:bg-gradient-to-l from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:-translate-y-[2px] transition-all duration-300 hidden md:block"
              >
                Enter Auction
              </button>
              <div className="relative group">
                <button
                  className="flex items-center space-x-2"
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                >
                  <img
                    src="https://img.icons8.com/?size=100&id=zxB19VPoVLjK&format=png&color=000000"
                    alt="Profile"
                    className="w-5 h-5 rounded-full"
                  />
                  <span className="text-gray-700 md:scale-100 scale-0">{buyerName}</span>
                </button>
                <div
                  className={`absolute top-full right-1 w-48 bg-white shadow-lg rounded-lg py-2 ${
                    showMobileMenu ? "block" : "hidden group-hover:block"
                  }`}
                >
                  <Link to="/buyer/profile" className="block px-4 py-2 text-gray-700 hover:bg-purple-50">
                    Your Profile
                  </Link>
                  <Link to="/buyer/auction-page" className="block px-4 py-2 text-gray-700 hover:bg-purple-50 md:hidden">
                    Enter Auction
                  </Link>
                  <Link to="/buyer/cart/#wishlist-section" className="block px-4 py-2 text-gray-700 hover:bg-purple-50 md:hidden">
                    WishList
                  </Link>
                  <Link to="/buyer/cart" className="block px-4 py-2 text-gray-700 hover:bg-purple-50 md:hidden">
                    Cart
                  </Link>
                  <Link to="/logout" className="block px-4 py-2 text-gray-700 hover:bg-purple-50" onClick={handleLogout}>
                    Logout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="py-12 pt-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Newly Added Books</h2>
          <div className="book-carousel" id="topRatedCarousel">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {data.newlyBooks.map((book) => (
                <BookCard key={book._id} book={book} onClick={() => navigate(`/buyer/product-detail/${book._id}`)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Most Sold Books</h2>
          <div className="book-carousel" id="mostSoldCarousel">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {data.mostSoldBooks.map((book) => (
                <BookCard key={book._id} book={book} onClick={() => navigate(`/buyer/product-detail/${book._id}`)} showSold />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Trending Now</h2>
          <div className="book-carousel" id="trendingCarousel">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {data.trendingBooks.map((book, idx) => (
                <BookCard key={book._id} book={book} onClick={() => navigate(`/buyer/product-detail/${book._id}`)} isTrending idx={idx} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;