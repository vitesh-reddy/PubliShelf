//client/src/pages/buyer/profile/Profile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfileById } from "../../../services/buyer.services.js";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getProfile();
      if (response.success) {
        setUser(response.data.user);
        setFormData({
          firstname: response.data.user.firstname,
          lastname: response.data.user.lastname,
          email: response.data.user.email,
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setFormError("Passwords do not match.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await updateProfileById({
        id: user._id,
        profileData: formData
      });
      if (response.success) {
        alert("Profile updated successfully.");
        setShowEditDialog(false);
        fetchProfile();
      } else {
        setFormError(response.message);
      }
    } catch (err) {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/auth/login");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  const getTimeAgo = (date) => {
    const now = new Date();
    const seconds = Math.floor((now - new Date(date)) / 1000);
    // similar logic as in EJS
    return "Member since " + new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="container mx-auto p-4" style={{ maxWidth: "1400px", margin: "20px auto", padding: "0 20px", display: "grid", gridTemplateColumns: "350px 1fr", gap: "25px" }}>
      {/* Profile Card */}
      <div className="profile-card bg-white rounded-lg shadow p-8 sticky top-20" style={{ borderRadius: "16px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", border: "1px solid rgba(138,74,243,0.1)" }}>
        <div className="profile-header text-center pb-5 relative">
          <div
            className="profile-pic w-35 h-35 mx-auto relative overflow-hidden rounded-full border-4 border-white shadow"
            style={{ width: "140px", height: "140px", background: "linear-gradient(135deg, #8a4af3, #6b48ff)", margin: "0 auto 15px" }}
          >
            <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "white", fontSize: "60px", fontWeight: "700" }}>
              {user.firstname[0].toUpperCase()}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-indigo-600 mb-2">{user.firstname} {user.lastname}</h2>
          <p className="text-gray-600 text-sm">{getTimeAgo(user.createdAt)}</p>
        </div>

        <div className="profile-stats grid grid-cols-2 gap-4 mb-5 p-4 bg-gray-100 rounded-lg">
          <div className="stat-item text-center p-3 bg-white rounded-lg hover:scale-105 transition">
            <span className="block text-purple-600 font-semibold text-xl">{user.orders.length}</span>
            Orders
          </div>
          <div className="stat-item text-center p-3 bg-white rounded-lg hover:scale-105 transition">
            <span className="block text-purple-600 font-semibold text-xl">{user.wishlist.length}</span>
            Wishlist
          </div>
        </div>

        <div className="profile-details space-y-2">
          <div className="detail-row grid grid-cols-[130px_1fr] p-4 border-b border-gray-100 bg-white rounded-lg hover:bg-purple-50 transition">
            <span className="attribute text-indigo-600 font-semibold text-sm">First Name:</span>
            <span className="value text-gray-700 text-sm">{user.firstname}</span>
          </div>
          <div className="detail-row grid grid-cols-[130px_1fr] p-4 border-b border-gray-100 bg-white rounded-lg hover:bg-purple-50 transition">
            <span className="attribute text-indigo-600 font-semibold text-sm">Last Name:</span>
            <span className="value text-gray-700 text-sm">{user.lastname}</span>
          </div>
          <div className="detail-row grid grid-cols-[130px_1fr] p-4 border-b border-gray-100 bg-white rounded-lg hover:bg-purple-50 transition">
            <span className="attribute text-indigo-600 font-semibold text-sm">Email:</span>
            <span className="value text-gray-700 text-sm">{user.email}</span>
          </div>
        </div>

        <div className="action-buttons flex gap-4 mt-6">
          <button onClick={() => setShowEditDialog(true)} className="btn flex-1 p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:brightness-110 hover:-translate-y-0.5 transition">
            Edit Profile
          </button>
          <button onClick={handleLogout} className="btn flex-1 p-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 hover:-translate-y-0.5 transition">
            Logout
          </button>
        </div>
      </div>

      {/* Orders Section */}
      <div>
        <div className="orders-section p-5 bg-white rounded-lg shadow mb-6">
          <h3 className="section-title text-2xl font-semibold text-indigo-600 mb-6 relative pb-2">Your Orders</h3>
          {user.orders && user.orders.length > 0 ? (
            user.orders.map((order) => (
              <div key={order._id} className="order-card flex bg-white rounded-lg shadow p-5 mb-5 gap-6 hover:translate-x-2 transition">
                <div className="order-details flex-1">
                  <h4 className="text-purple-600 font-semibold text-lg mb-3">{order.book.title}</h4>
                  <p><strong>Author:</strong> {order.book.author}</p>
                  <p><strong>Genre:</strong> {order.book.genre}</p>
                  <p><strong>Price:</strong> ₹{order.book.price}</p>
                  <p><strong>Quantity:</strong> {order.quantity}</p>
                  <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                  <p><strong>Description:</strong> {order.book.description || "No description"}</p>
                </div>
                <div className="flex flex-col justify-center">
                  <img
                    src={order.book.image || "https://m.media-amazon.com/images/I/61R+Cpm+HxL._SL1000_.jpg"}
                    alt={order.book.title}
                    className="w-40 h-56 object-cover rounded shadow mb-2"
                  />
                  <span className={`status px-3 py-1 rounded text-center font-semibold ${order.delivered ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                    {order.delivered ? "Delivered" : "Pending"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No orders yet.</p>
          )}
        </div>

        {/* Wishlist Section */}
        <div className="wishlist-section p-5 bg-white rounded-lg shadow">
          <h3 className="section-title text-2xl font-semibold text-indigo-600 mb-6 relative pb-2">Your Wishlist</h3>
          {user.wishlist && user.wishlist.length > 0 ? (
            <div className="wishlist-grid grid grid-cols-1 md:grid-cols-4 gap-5">
              {user.wishlist.map((book) => (
                <div key={book._id} className="wishlist-item text-center p-4 bg-white rounded-lg shadow hover:-translate-y-1 transition">
                  <img
                    src={book.image || "https://m.media-amazon.com/images/I/61R+Cpm+HxL._SL1000_.jpg"}
                    alt={book.title}
                    className="w-full h-32 object-cover rounded mb-3"
                  />
                  <h4 className="text-purple-600 font-semibold text-sm mb-1">{book.title}</h4>
                  <p className="text-gray-600 text-xs mb-1">{book.author}</p>
                  <p className="text-indigo-600 font-semibold text-xs">₹{book.price}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">Your wishlist is empty.</p>
          )}
        </div>
      </div>

      {/* Edit Profile Dialog */}
      {showEditDialog && (
        <div className="dialog-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="dialog bg-white rounded-lg p-8 w-full max-w-md transform transition">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Edit Profile</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm mb-2">First Name</label>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="form-section border-t pt-4">
                <h4 className="text-gray-700 mb-4">Change Password</h4>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm mb-2">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm mb-2">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              {formError && <p className="text-red-500 text-sm mb-4">{formError}</p>}
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setShowEditDialog(false)} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50">
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;