//client/src/pages/buyer/search/Search.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaUser, FaBookOpen } from "react-icons/fa";
import { getSearchPage, searchBooksApi, filterBooksApi } from "../../../services/buyer.services.js";
import BookGrid from "./components/BookGrid.jsx";

const Search = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ category: "All", sort: "Relevance", condition: "All", priceRange: "" });
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [buyerName, setBuyerName] = useState("Buyer");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await getSearchPage();
      if (response.success) {
        setBooks(response.data.books);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return fetchBooks();
    try {
      setLoading(true);
      const response = await searchBooksApi(searchQuery);
      if (response.success) {
        setBooks(response.data.books);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    try {
      setLoading(true);
      const response = await filterBooksApi(filters);
      if (response.success) {
        setBooks(response.data.books);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Filter failed");
    } finally {
      setLoading(false);
    }
  };

  const handleWishlistAdd = async (bookId) => {
    // Call addToWishlist
    await addToWishlist(bookId);
    // Update UI or refetch
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="bg-gray-50">
      {/* Navbar - similar to dashboard */}
      <nav className="fixed w-full bg-white shadow-sm z-50">
        {/* ... similar navbar structure ... */}
      </nav>

      <div className="pt-16">
        {/* Categories Bar */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8 py-4">
              <Link to="#" className="text-purple-600 border-b-2 border-purple-600 pb-4 -mb-4">All Books</Link>
              <Link to="#" className="text-gray-600 hover:text-purple-600">Young Adult</Link>
              {/* other categories */}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex space-x-4">
              <select value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })} className="px-4 py-2 rounded-lg border">
                <option>Sort by: Relevance</option>
                <option value="priceLowToHigh">Price: Low to High</option>
                <option value="priceHighToLow">Price: High to Low</option>
                <option value="newestFirst">Newest First</option>
              </select>
              <select value={filters.condition} onChange={(e) => setFilters({ ...filters, condition: e.target.value })} className="px-4 py-2 rounded-lg border">
                <option>Condition: All</option>
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                {/* other conditions */}
              </select>
              <select value={filters.priceRange} onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })} className="px-4 py-2 rounded-lg border">
                <option>Price Range</option>
                <option value="0-10">Under ₹10</option>
                <option value="10-20">₹10 - ₹20</option>
                {/* other ranges */}
              </select>
              <button onClick={handleFilter} className="px-4 py-2 bg-purple-600 text-white rounded-lg">Apply Filters</button>
            </div>
            <div className="flex space-x-4">
              <button onClick={() => setViewMode("grid")} className={`text-gray-600 hover:text-purple-600 ${viewMode === "grid" ? "text-purple-600" : ""}`}>
                <i className="fas fa-th-large" />
              </button>
              <button onClick={() => setViewMode("list")} className={`text-gray-600 hover:text-purple-600 ${viewMode === "list" ? "text-purple-600" : ""}`}>
                <i className="fas fa-list" />
              </button>
            </div>
          </div>

          {/* Books Grid */}
          <BookGrid books={books} viewMode={viewMode} onWishlistAdd={handleWishlistAdd} />

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <nav className="flex space-x-2">
              <button className="px-3 py-2 rounded-lg bg-purple-600 text-white">1</button>
              <button className="px-3 py-2 rounded-lg text-gray-600 hover:bg-purple-50">2</button>
              {/* other pages */}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;