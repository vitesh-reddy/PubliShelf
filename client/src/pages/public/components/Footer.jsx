import React from "react";
import { Link } from "react-router-dom";

const Footer = () => (
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
            <li>
              <Link to="/about" className="text-gray-400 hover:text-white">About Us</Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link>
            </li>
            <li>
              <Link to="#" className="text-gray-400 hover:text-white">Terms of Service</Link>
            </li>
            <li>
              <Link to="#" className="text-gray-400 hover:text-white">Privacy Policy</Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 md:-translate-x-12">
            <h4 className="text-lg font-semibold mb-4 text-white">Site Stats</h4>
            <ul className="space-y-3">
              <li className="flex justify-between items-center">
                <span className="text-gray-300">Site Views</span>
                <span className="text-white font-bold text-lg">847,403</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-300">Users Today</span>
                <span className="text-white font-bold text-lg">69</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-300">Views Today</span>
                <span className="text-white font-bold text-lg">130</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-300">Server Time</span>
                <span className="text-white font-semibold">2026-02-05</span>
              </li>
            </ul>
          </div>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Connect</h4>
          <div className="flex space-x-4">
            <Link to="#" className="text-gray-400 hover:text-white"><i className="fab fa-twitter"></i></Link>
            <Link to="#" className="text-gray-400 hover:text-white"><i className="fab fa-facebook"></i></Link>
            <Link to="#" className="text-gray-400 hover:text-white"><i className="fab fa-instagram"></i></Link>
            <Link to="#" className="text-gray-400 hover:text-white"><i className="fab fa-linkedin"></i></Link>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;