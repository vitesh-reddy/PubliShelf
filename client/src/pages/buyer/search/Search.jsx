import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { searchBooks, addToWishlist } from "../../../services/buyer.services.js";
import BookGrid from "./components/BookGrid.jsx";
import { useDispatch } from 'react-redux';
import { addToWishlist as addToWishlistInStore } from '../../../store/slices/wishlistSlice';
import { useUser, useWishlist } from '../../../store/hooks';

const SearchPage = () => {
  const dispatch = useDispatch();
  const user = useUser();
  const { items: wishlistItems } = useWishlist();
  
  const [books, setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentCategory, setCurrentCategory] = useState("All Books");
  const [currentPriceFilter, setCurrentPriceFilter] = useState("all");
  const [currentSort, setCurrentSort] = useState("relevance");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await searchBooks(q);
      if (response.success) {
        setAllBooks(response.data.books);
        setError("");
      } else {
        setError(response.message);
      }
    } catch {
      setError("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [q]);

  useEffect(() => {
    if (allBooks.length === 0) return;
    let filtered = [...allBooks];
    if (currentCategory !== "All Books") {
      filtered = filtered.filter((b) => b.genre?.toLowerCase().includes(currentCategory.toLowerCase()));
    }
    switch (currentPriceFilter) {
      case "under500": filtered = filtered.filter((b) => (b.price || 0) < 500); break;
      case "500-1000": filtered = filtered.filter((b) => (b.price || 0) >= 500 && (b.price || 0) <= 1000); break;
      case "1000-2000": filtered = filtered.filter((b) => (b.price || 0) >= 1000 && (b.price || 0) <= 2000); break;
      case "2000-3000": filtered = filtered.filter((b) => (b.price || 0) >= 2000 && (b.price || 0) <= 3000); break;
      case "over3000": filtered = filtered.filter((b) => (b.price || 0) > 3000); break;
      default: break;
    }
    switch (currentSort) {
      case "price-asc": filtered.sort((a,b) => (a.price || 0) - (b.price || 0)); break;
      case "price-desc": filtered.sort((a,b) => (b.price || 0) - (a.price || 0)); break;
      case "rating-asc": filtered.sort((a,b) => (a.rating || 0) - (b.rating || 0)); break;
      case "rating-desc": filtered.sort((a,b) => (b.rating || 0) - (a.rating || 0)); break;
      case "quantity-asc": filtered.sort((a,b) => (a.quantity || 0) - (b.quantity || 0)); break;
      case "quantity-desc": filtered.sort((a,b) => (b.quantity || 0) - (a.quantity || 0)); break;
      case "newest": filtered.sort((a,b) => new Date(b.publishedAt) - new Date(a.publishedAt)); break;
      default: break;
    }
    setBooks(filtered);
  }, [allBooks, currentCategory, currentPriceFilter, currentSort]);

  const handleCategoryClick = (category) => setCurrentCategory(category);
  const handlePriceRangeChange = (e) => setCurrentPriceFilter(e.target.value);
  const handleSortChange = (e) => setCurrentSort(e.target.value);
  const handleResetFilters = () => {
    setCurrentCategory("All Books");
    setCurrentPriceFilter("all");
    setCurrentSort("relevance");
  };

  const handleWishlistAdd = async (bookId, buttonRef) => {
    // Find the book from the books array
    const bookToAdd = books.find(b => b._id === bookId);
    if (!bookToAdd) return;
    
    // Check if already in wishlist
    const isAlreadyInWishlist = wishlistItems.some(item => item._id === bookId);
    if (isAlreadyInWishlist) {
      alert("Book is already in your wishlist!");
      return;
    }
    
    // Optimistic update
    dispatch(addToWishlistInStore(bookToAdd));
    buttonRef.current.querySelector("i").classList.replace("far", "fas");
    buttonRef.current.classList.add("text-red-500");
    
    try {
      const response = await addToWishlist(bookId);
      if (!response.success) {
        alert(`Failed to add to wishlist: ${response.message}`);
      }
    } catch { 
      alert("Error adding to wishlist"); 
    }
  };

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/auth/login");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="bg-gray-50">
      <nav className="fixed w-full bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/buyer/dashboard" className="flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">PubliShelf</span>
              </Link>
            </div>
            <div className="flex items-center md:space-x-8 relative">
              <Link to="/buyer/cart/#wishlist-section" className="text-gray-700 hover:text-purple-600 hidden md:block"><i className="far fa-heart"></i></Link>
              <Link to="/buyer/cart" className="text-gray-700 hover:text-purple-600 hidden md:block"><i className="fas fa-shopping-cart"></i></Link>
              <button onClick={() => navigate("/buyer/auction-page")} className="bg-gradient-to-r hover:bg-gradient-to-l from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:-translate-y-[2px] transition-all duration-300 hidden md:block">Enter Auction</button>
              <div className="relative group">
                <button className="flex items-center space-x-2" onClick={() => setShowMobileMenu(!showMobileMenu)}>
                  <img src="https://img.icons8.com/?size=100&id=zxB19VPoVLjK&format=png&color=000000" alt="Profile" className="w-5 h-5 rounded-full"/>
                  <span className="text-gray-700 md:scale-100 scale-0">{user.firstname || "Buyer"}</span>
                </button>
                <div className={`absolute top-full right-1 w-48 bg-white shadow-lg rounded-lg py-2 ${showMobileMenu ? "block" : "hidden group-hover:block"}`}>
                  <Link to="/buyer/profile" className="block px-4 py-2 text-gray-700 hover:bg-purple-50">Your Profile</Link>
                  <Link to="/buyer/auction-page" className="block px-4 py-2 text-gray-700 hover:bg-purple-50 md:hidden">Enter Auction</Link>
                  <Link to="/buyer/cart/#wishlist-section" className="block px-4 py-2 text-gray-700 hover:bg-purple-50 md:hidden">WishList</Link>
                  <Link to="/buyer/cart" className="block px-4 py-2 text-gray-700 hover:bg-purple-50 md:hidden">Cart</Link>
                  <Link to="/logout" className="block px-4 py-2 text-gray-700 hover:bg-purple-50" onClick={handleLogout}>Logout</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16">
        <div className="bg-white border-b border-gray-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8 py-4">
              {["All Books", "Fiction", "Non-Fiction", "Mystery", "Science Fiction", "Romance", "Thriller", "Other"].map(category => (
                <Link key={category} to="#" className={`${currentCategory === category ? "text-purple-600 border-b-2 border-purple-600 pb-4 -mb-4" : "text-gray-600 hover:text-purple-600"}`} onClick={(e)=>{e.preventDefault(); handleCategoryClick(category);}}>{category}</Link>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xs px-4 py-3 transition-all">
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 tracking-tight">Filter & Sort Books</h2>
              <p className="text-sm text-gray-500 hidden sm:block">Refine your results by price or sort preferences</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <select value={currentSort} onChange={handleSortChange} className="appearance-none px-4 py-2.5 pr-10 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition">
                  <option value="relevance">Sort by: Relevance</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Rating: High to Low</option>
                  <option value="rating-asc">Rating: Low to High</option>
                  <option value="quantity-desc">Quantity: High to Low</option>
                  <option value="quantity-asc">Quantity: Low to High</option>
                  <option value="newest">Newest First</option>
                </select>
                <i className="fas fa-chevron-down absolute right-3 top-[15px] text-gray-500 pointer-events-none text-xs"></i>
              </div>
              <div className="relative">
                <select value={currentPriceFilter} onChange={handlePriceRangeChange} className="appearance-none px-4 py-2.5 pr-10 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition">
                  <option value="all">All Prices</option>
                  <option value="under500">Under ₹500</option>
                  <option value="500-1000">₹500 - ₹1000</option>
                  <option value="1000-2000">₹1000 - ₹2000</option>
                  <option value="2000-3000">₹2000 - ₹3000</option>
                  <option value="over3000">Over ₹3000</option>
                </select>
                <i className="fas fa-chevron-down absolute right-3 top-[15px] text-gray-500 pointer-events-none text-xs"></i>
              </div>
              <button onClick={handleResetFilters} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition">
                Reset Filters
              </button>
            </div>
          </div>

          <BookGrid books={books} onWishlistAdd={handleWishlistAdd} />

          {/* Pagination (Commented out to match EJS) */}
          {/* <div className="flex justify-center mt-8">
            <nav className="flex space-x-2">
              <button className="px-3 py-2 rounded-lg bg-purple-600 text-white">1</button>
              <button className="px-3 py-2 rounded-lg text-gray-600 hover:bg-purple-50">2</button>
              <button className="px-3 py-2 rounded-lg text-gray-600 hover:bg-purple-50">3</button>
              <span className="px-3 py-2">...</span>
              <button className="px-3 py-2 rounded-lg text-gray-600 hover:bg-purple-50">10</button>
            </nav>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;