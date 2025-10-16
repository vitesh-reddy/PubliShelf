//client/src/pages/public/About.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const About = () => {
  return (
    <>
      {/* Navbar */}
      <nav className="fixed w-full bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">PubliShelf</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/about" className="text-gray-700 hover:text-purple-600 transition-colors">About</Link>
              <Link to="/contact" className="text-gray-700 hover:text-purple-600 transition-colors">Contact</Link>
              <Link to="/#faq-section" className="text-gray-700 hover:text-purple-600 transition-colors">FAQ</Link>
              <Link to="/buyer/dashboard" className="text-gray-700 hover:text-purple-600 transition-colors">Bookstores</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/auth/login" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:-translate-y-[2px] transition-all duration-300">Join Now</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* About Section */}
      <section className="min-h-screen pt-16 bg-white">
        <div className="about-container max-w-7xl mx-auto px-4 py-16">
          <div className="about-header text-center mb-16">
            <h1 className="about-title text-5xl font-bold text-gray-900 mb-6">About Us</h1>
            <p className="about-subtitle text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the story behind PubliShelf and our mission to connect readers and authors worldwide.
            </p>
          </div>

          <div className="about-content grid md:grid-cols-2 gap-12 mb-16">
            <div className="about-card space-y-4">
              <h2 className="about-card-title text-2xl font-bold text-gray-900">Our Mission</h2>
              <p className="about-card-text text-gray-600">
                At PubliShelf, we believe in the power of books to transform lives. Our mission is to create a vibrant marketplace where readers can discover new books and authors can reach a global audience.
              </p>
              <p className="about-card-text text-gray-600">
                We are committed to providing a seamless experience for both buyers and sellers, ensuring that every transaction is smooth and enjoyable.
              </p>
            </div>
            <div className="about-card space-y-4">
              <h2 className="about-card-title text-2xl font-bold text-gray-900">Our Team</h2>
              <p className="about-card-text text-gray-600">
                Our team is made up of passionate book lovers and tech enthusiasts who are dedicated to making PubliShelf the best place to buy and sell books online.
              </p>
            </div>
          </div>

          {/* Team Members */}
          <div className="team-section">
            <h2 className="team-title text-3xl font-bold text-gray-900 mb-12 text-center">Meet Our Team</h2>
            <div className="team-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="team-card bg-white rounded-xl shadow-md p-6 text-center">
                <img src="https://source.unsplash.com/150x150/?portrait,man" alt="Team Member 1" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
                <h3 className="team-member-name text-xl font-semibold text-gray-900 mb-2">Akash Varma</h3>
                <p className="team-member-role text-purple-600 font-medium mb-2">Frontend Developer</p>
                <p className="team-member-desc text-gray-600">Handles the design and functionality of Forms and Authentication.</p>
              </div>

              <div className="team-card bg-white rounded-xl shadow-md p-6 text-center">
                <img src="https://source.unsplash.com/150x150/?portrait,woman,smile" alt="Team Member 2" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
                <h3 className="team-member-name text-xl font-semibold text-gray-900 mb-2">Ch Vinayak</h3>
                <p className="team-member-role text-purple-600 font-medium mb-2">Frontend Manager</p>
                <p className="team-member-desc text-gray-600">Drives user engagement and promotional campaigns.</p>
              </div>

              <div className="team-card bg-white rounded-xl shadow-md p-6 text-center">
                <img src="https://source.unsplash.com/150x150/?portrait,man,glasses" alt="Team Member 3" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
                <h3 className="team-member-name text-xl font-semibold text-gray-900 mb-2">KL Vitesh Reddy</h3>
                <p className="team-member-role text-purple-600 font-medium mb-2">Frontend Developer</p>
                <p className="team-member-desc text-gray-600">Focuses on creating intuitive and visually appealing pages.</p>
              </div>

              <div className="team-card bg-white rounded-xl shadow-md p-6 text-center">
                <img src="https://source.unsplash.com/150x150/?portrait,woman" alt="Team Member 4" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
                <h3 className="team-member-name text-xl font-semibold text-gray-900 mb-2">Rithish Reddy</h3>
                <p className="team-member-role text-purple-600 font-medium mb-2">Backend Developer</p>
                <p className="team-member-desc text-gray-600">Manages server-side logic and database integration.</p>
              </div>

              <div className="team-card bg-white rounded-xl shadow-md p-6 text-center">
                <img src="https://source.unsplash.com/150x150/?portrait,man,beard" alt="Team Member 5" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
                <h3 className="team-member-name text-xl font-semibold text-gray-900 mb-2">Vishnu Vardhan</h3>
                <p className="team-member-role text-purple-600 font-medium mb-2">Frontend Manager</p>
                <p className="team-member-desc text-gray-600">Oversees the creation and management of website content.</p>
              </div>
            </div>
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
    </>
  );
};

export default About;