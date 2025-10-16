//client/src/pages/public/Home.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBook, FaUserTag, FaBookOpen, FaStar, FaTags, FaUniversity, FaLandmark, FaUsers, FaGavel, FaTwitter, FaFacebook,FaInstagram,FaLinkedin, } from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance.util.js";

const Home = () => {
  const [data, setData] = useState({
    newlyBooks: [],
    mostSoldBooks: [],
    trendingBooks: [],
    metrics: { booksAvailable: 0, activeReaders: 0, publishers: 0, booksSold: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/home/data");
      console.log(response.data);
      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Failed to fetch home data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="bg-gray-50">
      {/* Navbar */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">PubliShelf</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/buyer/dashboard" className="text-gray-700 hover:text-purple-600 transition-colors px-3 py-2">Bookstores</Link>
              <Link to="/about" className="text-gray-700 hover:text-purple-600 transition-colors px-3 py-2">About</Link>
              <Link to="/contact" className="text-gray-700 hover:text-purple-600 transition-colors px-3 py-2">Contact Us</Link>
              <Link to="/#faq-section" className="text-gray-700 hover:text-purple-600 transition-colors px-3 py-2">FAQ</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/auth/login" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:-translate-y-[2px] transition-all duration-300">Join Now</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-12 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Discover Your Next Literary Adventure</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">Join thousands of readers in the world's most vibrant book marketplace</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/login" className="bg-purple-600 text-white px-8 py-3 font-semibold rounded-lg hover:bg-purple-700 transform transition-all duration-300 hover:-translate-y-1">
                Start Reading
              </Link>
              <Link to="/auth/signup" className="bg-white text-purple-600 px-8 py-3 font-semibold rounded-lg border-2 border-purple-600 hover:bg-purple-50 transform transition-all duration-300 hover:-translate-y-1">
                Sell Your Books
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="stat-card">
              <FaBook className="text-4xl text-purple-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900">{data.metrics.booksAvailable}</h3>
              <p className="text-gray-600">Books Available</p>
            </div>
            <div className="stat-card">
              <FaUserTag className="text-4xl text-purple-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900">{data.metrics.activeReaders}</h3>
              <p className="text-gray-600">Active Readers</p>
            </div>
            <div className="stat-card">
              <FaBookOpen className="text-4xl text-purple-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900">{data.metrics.publishers}</h3>
              <p className="text-gray-600">Publishers</p>
            </div>
            <div className="stat-card">
              <FaStar className="text-4xl text-purple-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900">{data.metrics.booksSold}</h3>
              <p className="text-gray-600">Books Sold</p>
            </div>
          </div>
        </div>
      </section>

      {/* About PubliShelf Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Your Gateway to a World of Books</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                India's premier platform for buying and selling used books effortlessly. Connect with fellow book lovers, declutter your shelves, and discover affordable literary treasures.
              </p>
              <p className="text-lg text-gray-600">
                PubliShelf connects book lovers across India, making it easy to buy and sell used books. Whether you're a college student looking to offload textbooks or a collector searching for rare editions, our platform brings the book community together.
              </p>
              <blockquote className="italic text-gray-700 pl-4 border-l-4 border-purple-600">
                "Selling used books at your desired price has never been easier. With PubliShelf, your books find new readers, and you earn money effortlessly!"
              </blockquote>
              <div className="flex justify-center md:justify-start">
                <Link to="/auth/login" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:-translate-y-1 transition-all duration-300">
                  Join Our Community
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 rounded-xl p-4 shadow-md hover:-translate-y-1 transition-transform">
                <div className="h-32 flex items-center justify-center">
                  <FaTags className="text-6xl text-purple-500" />
                </div>
                <h3 className="text-center font-semibold mt-2">Used Books</h3>
              </div>
              <div className="bg-indigo-50 rounded-xl p-4 shadow-md hover:-translate-y-1 transition-transform">
                <div className="h-32 flex items-center justify-center">
                  <FaUniversity className="text-6xl text-indigo-500" />
                </div>
                <h3 className="text-center font-semibold mt-2">College Textbooks</h3>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 shadow-md hover:-translate-y-1 transition-transform">
                <div className="h-32 flex items-center justify-center">
                  <FaLandmark className="text-6xl text-blue-500" />
                </div>
                <h3 className="text-center font-semibold mt-2">Antique Books</h3>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 shadow-md hover:-translate-y-1 transition-transform">
                <div className="h-32 flex items-center justify-center">
                  <FaUsers className="text-6xl text-purple-500" />
                </div>
                <h3 className="text-center font-semibold mt-2">Book Community</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose PubliShelf */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Choose PubliShelf?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-purple-100 rounded-full mx-auto">
                <FaTags className="text-2xl text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-purple-600 mb-4">For Sellers</h3>
              <p className="text-gray-600">Turn your old books into cash! Sell your used books at prices you set and reach a community of eager readers.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-purple-100 rounded-full mx-auto">
                <FaBook className="text-2xl text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-purple-600 mb-4">For Buyers</h3>
              <p className="text-gray-600">Discover affordable second-hand books in great condition, directly from other book lovers.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-purple-100 rounded-full mx-auto">
                <FaGavel className="text-2xl text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-purple-600 mb-4">For Collectors</h3>
              <p className="text-gray-600">Dive into our exclusive antique book auctions and bid on rare, vintage, and collectible books.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books - Newly Added */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Newly Added Books</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {data.newlyBooks.map((book) => (
              <Link key={book._id} to={`/buyer/product-detail/${book._id}`} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-[5px] hover:shadow-lg cursor-pointer">
                <img src={book.image} alt={book.title} className="w-full h-64 object-cover" />
                <div className="p-3">
                  <h3 className="text-lg font-semibold mb-1 truncate">{book.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">by {book.author}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-purple-600 text-sm">₹{book.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Most Sold Books */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Most Sold Books</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {data.mostSoldBooks.map((book) => (
              <Link key={book._id} to={`/buyer/product-detail/${book._id}`} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-[5px] hover:shadow-lg cursor-pointer">
                <img src={book.image} alt={book.title} className="w-full h-64 object-cover" />
                <div className="p-3">
                  <h3 className="text-lg font-semibold mb-1 truncate">{book.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">by {book.author}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-600 text-sm">Total Sold: {book.totalSold}</span>
                    <span className="font-bold text-purple-600 text-sm">₹{book.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Books */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Trending Now</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {data.trendingBooks.map((book, idx) => (
              <Link key={book._id} to={`/buyer/product-detail/${book._id}`} className="bg-white rounded-lg shadow-md overflow-hidden relative transition-all duration-300 hover:-translate-y-[5px] hover:shadow-lg cursor-pointer">
                <img src={book.image} alt={book.title} className="w-full h-64 object-cover" />
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">#{(idx + 1)}</div>
                <div className="p-3">
                  <h3 className="text-lg font-semibold mb-1 truncate">{book.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">by {book.author}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-600 text-sm">Trending</span>
                    <span className="font-bold text-purple-600 text-sm">₹{book.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq-section" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="faq-item bg-white p-4 rounded-lg shadow-md">
              <button className="w-full flex justify-between items-center text-left">
                <span className="font-semibold">How do I sell my books?</span>
                <i className="fas fa-chevron-down text-gray-400" />
              </button>
              <div className="faq-content mt-2 text-gray-600 hidden">
                <p>Sign up as a seller, list your books with details and photos, set your price, and start selling to our community of book lovers.</p>
              </div>
            </div>
            <div className="faq-item bg-white p-4 rounded-lg shadow-md">
              <button className="w-full flex justify-between items-center text-left">
                <span className="font-semibold">What payment methods are accepted?</span>
                <i className="fas fa-chevron-down text-gray-400" />
              </button>
              <div className="faq-content mt-2 text-gray-600 hidden">
                <p>We accept all major credit cards, PayPal, and various digital payment methods for your convenience.</p>
              </div>
            </div>
            <div className="faq-item bg-white p-4 rounded-lg shadow-md">
              <button className="w-full flex justify-between items-center text-left">
                <span className="font-semibold">How does shipping work?</span>
                <i className="fas fa-chevron-down text-gray-400" />
              </button>
              <div className="faq-content mt-2 text-gray-600 hidden">
                <p>Sellers handle shipping. Most items are shipped within 2-3 business days, and tracking information is provided once available.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Start Collecting?</h2>
          <p className="text-xl text-gray-600 mb-8">Join PubliShelf today and discover the joy of rare book collecting.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/login" className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition">Sign In</Link>
            <Link to="/auth/signup" className="border border-purple-600 text-purple-600 px-8 py-3 rounded-lg hover:bg-purple-50 transition">Sign Up</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">PubliShelf</h3>
              <p className="text-gray-400">Your gateway to endless literary discoveries.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white"><FaTwitter /></a>
                <a href="#" className="text-gray-400 hover:text-white"><FaFacebook /></a>
                <a href="#" className="text-gray-400 hover:text-white"><FaInstagram /></a>
                <a href="#" className="text-gray-400 hover:text-white"><FaLinkedin /></a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
              <form className="flex">
                <input type="email" placeholder="Enter your email" className="px-4 py-2 rounded-l-lg w-full focus:outline-none focus:outline-purple-500" />
                <button className="bg-purple-600 px-4 py-2 rounded-r-lg hover:bg-purple-700">Subscribe</button>
              </form>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;