import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearAuth } from "../../../store/slices/authSlice";
import { clearUser } from "../../../store/slices/userSlice";
import { clearCart } from "../../../store/slices/cartSlice";
import { clearWishlist } from "../../../store/slices/wishlistSlice";
import { useUser, useCart, useWishlist } from "../../../store/hooks";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const q = useSearchParams()[0].get("q");

  const user = useUser();
  const { items: cartItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [query, setQuery] = useState(q || "");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const profileMenuRef = useRef(null);
  const buyerName = user.firstname || "Buyer";

  const isOnAuctionPage = location.pathname.includes("/auction");
  const buttonDestination = isOnAuctionPage ? "/buyer/dashboard" : "/buyer/auction-page";

  const handleLogout = () => {
    dispatch(clearAuth());
    dispatch(clearUser());
    dispatch(clearCart());
    dispatch(clearWishlist());
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/auth/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query) navigate(`/buyer/search?q=${encodeURIComponent(query)}`);
  };

  const showSearchBar = !["/buyer/cart", "/buyer/checkout", "/buyer/profile"].includes(location.pathname);

  useEffect(() => {
    setShowProfileMenu(false);
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const closeOnEscape = (e) => e.key === "Escape" && (setIsMobileMenuOpen(false), setIsSearchOpen(false), setShowProfileMenu(false));
    const closeOnClick = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) setShowProfileMenu(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("mousedown", closeOnClick);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("mousedown", closeOnClick);
    };
  }, []);

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              PubliShelf
            </span>
          </Link>

          {/* ===== Desktop Section (unchanged) ===== */}
          <div className="flex items-center md:space-x-8 relative">
            <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
              <Link to="/buyer/dashboard" className="text-gray-700 hover:text-purple-600 px-3 py-2">Home</Link>
              <Link to={buttonDestination} className="text-gray-700 hover:text-purple-600 px-3 py-2">
                {isOnAuctionPage ? "Bookstore" : "Auctions"}
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-purple-600 px-3 py-2">About</Link>
              <Link to="/contact" className="text-gray-700 hover:text-purple-600 px-3 py-2">Contact</Link>
              <div className="relative group">
                <button className="text-gray-700 hover:text-purple-600 px-3 py-2">Categories</button>
                <div className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-lg py-2 hidden group-hover:block">
                  {["Fiction", "Non-Fiction", "Mystery", "Science Fiction", "Romance", "Thriller", "Other"].map((cat) => (
                    <Link
                      key={cat}
                      to={`/buyer/search?q=${encodeURIComponent(cat)}`}
                      className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop Search */}
            {showSearchBar && (
              <div className="relative hidden md:block">
                <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    name="q"
                    value={query}
                    placeholder="Search books..."
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-[35vw] lg:w-[24vw] xl:w-[20vw] px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                  <button type="submit" className="absolute right-3 top-[9px] text-gray-400">
                    <i className="fas fa-search"></i>
                  </button>
                </form>
              </div>
            )}

            {/* Wishlist & Cart (Desktop) */}
            <Link to="/buyer/cart/#wishlist-section" className="relative hidden md:flex text-gray-700 hover:text-purple-600">
              <i className="far fa-heart text-lg"></i>
              {!!wishlistItems.length && (
                <span className="absolute -top-2 -right-4 bg-pink-700 text-white text-[0.65rem] rounded-full px-[5px]">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <Link to="/buyer/cart" className="relative hidden md:flex text-gray-700 hover:text-purple-600">
              <i className="fas fa-shopping-cart text-lg"></i>
              {!!cartItems.length && (
                <span className="absolute -top-2 -right-3 bg-purple-600 text-white text-[0.65rem] rounded-full px-[5px]">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* Profile (Desktop) */}
            <div className="relative group hidden md:block" ref={profileMenuRef}>
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center space-x-2">
                <img
                  src="https://img.icons8.com/?size=100&id=zxB19VPoVLjK&format=png&color=000000"
                  alt="Profile"
                  className="w-5 h-5 rounded-full"
                />
                <span className="text-gray-700 md:scale-100 scale-0">{buyerName}</span>
              </button>
              <div
                className={`absolute top-full right-1 w-48 bg-white shadow-lg rounded-lg py-2 transition-all duration-200 ${
                  showProfileMenu ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
              >
                <Link to="/buyer/profile" className="block px-4 py-2 text-gray-700 hover:bg-purple-50">
                  Your Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* ===== Mobile Section (Fixed & Enhanced) ===== */}
            <div className="flex md:hidden items-center gap-4">
              {/* Search Icon */}
              {showSearchBar && (
                <button
                  onClick={() => setIsSearchOpen((prev) => !prev)}
                  className="relative text-purple-600 text-xl transition-transform duration-300 hover:scale-110"
                >
                  <i
                    className={`fa-solid ${
                      isSearchOpen ? "fa-xmark rotate-180" : "fa-magnifying-glass"
                    } transition-transform duration-300 ease-in-out`}
                  ></i>
                </button>
              )}

              {/* Animated Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="relative w-8 h-8 flex flex-col justify-center items-center group"
              >
                <span
                  className={`block w-6 h-0.5 bg-purple-600 rounded transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                ></span>
                <span
                  className={`block w-6 h-0.5 bg-purple-600 rounded transition-all duration-300 ease-in-out my-1 ${
                    isMobileMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></span>
                <span
                  className={`block w-6 h-0.5 bg-purple-600 rounded transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                ></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Dropdown (below navbar) */}
      <div
        className={`md:hidden px-4 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isSearchOpen ? "max-h-24 opacity-100 mt-2" : "max-h-0 opacity-0"
        }`}
      >
        <form
          onSubmit={handleSearch}
          className="relative bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl p-[2px] shadow-inner"
        >
          <div className="bg-white rounded-lg flex items-center px-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search books..."
              className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-700"
            />
            <button
              type="submit"
              className="ml-2 text-purple-500 hover:text-purple-700 transition-transform duration-300 hover:scale-110"
            >
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </form>
      </div>

      {/* Mobile Menu Dropdown (slide-down) */}
      <div
        className={`md:hidden bg-white shadow-md rounded-b-xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isMobileMenuOpen ? "max-h-64 opacity-100 mt-2" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col px-6 py-3 space-y-3 text-gray-700">
          <Link to="/buyer/dashboard" className="hover:text-purple-600 transition-colors">
            Home
          </Link>
          <Link to={buttonDestination} className="hover:text-purple-600 transition-colors">
            {isOnAuctionPage ? "Bookstore" : "Auctions"}
          </Link>
          <Link to="/about" className="hover:text-purple-600 transition-colors">
            About
          </Link>
          <Link to="/contact" className="hover:text-purple-600 transition-colors">
            Contact
          </Link>
          <Link to="/buyer/profile" className="hover:text-purple-600 transition-colors">
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="text-left text-gray-700 hover:text-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
