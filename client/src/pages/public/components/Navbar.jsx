import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav className="fixed w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
              PubliShelf
            </span>
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/buyer/dashboard" className="navBtnStyle">Bookstores</Link>
          <Link to="/about" className="navBtnStyle">About</Link>
          <Link to="/contact" className="navBtnStyle">Contact Us</Link>
          <Link to="/#faq-section" className="navBtnStyle">FAQ</Link>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => (window.location.href = "/auth/login")}
            className="bg-gradient-to-r hover:bg-gradient-to-l from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:-translate-y-[2px] transition-all duration-300"
          >
            Join Now
          </button>
          <div className="relative group">
            <button className="md:hidden text-gray-700 hover:text-purple-600 transition-colors px-3 py-2">
              <img
                className="h-5 w-5"
                src="https://img.icons8.com/?size=100&id=3096&format=png&color=000000"
                alt="="
              />
            </button>
            <div className="absolute top-full right-1 w-32 bg-white shadow-lg rounded-lg py-2 hidden group-hover:block">
              <Link to="/#faq-section" className="categoryBtnStyle">FAQ</Link>
              <Link to="/about" className="categoryBtnStyle">About</Link>
              <Link to="/contact" className="categoryBtnStyle">Contact Us</Link>
              <Link to="/auth/login" className="categoryBtnStyle">Bookstores</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;