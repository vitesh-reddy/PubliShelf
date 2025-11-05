// client/src/pages/buyer/profile/Profile.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfileById } from "../../../services/buyer.services.js";
import { useDispatch } from 'react-redux';
import { updateUser } from '../../../store/slices/userSlice';
import { clearAuth } from '../../../store/slices/authSlice';
import { clearUser } from '../../../store/slices/userSlice';
import { clearCart } from '../../../store/slices/cartSlice';
import { clearWishlist } from '../../../store/slices/wishlistSlice';
import { useUser, useCart, useWishlist } from '../../../store/hooks';
import { logout } from "../../../services/auth.services";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BuyerProfile = () => {
  const dispatch = useDispatch();
  const user = useUser();
  const { items: cartItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { orders = [] } = useUser();

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const res = await getProfile();
        if (!ignore && res?.success && res?.data?.user) {
          const srvUser = res.data.user;
          dispatch(updateUser({
            firstname: srvUser.firstname,
            lastname: srvUser.lastname,
            email: srvUser.email,
            createdAt: srvUser.createdAt,
            orders: Array.isArray(srvUser.orders) ? srvUser.orders : [],
          }));
        }
      } catch (e) {
        console.error("Failed to load profile:", e);
      }
    };
    load();
    return () => { ignore = true; };
  }, [dispatch]);
  
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [formData, setFormData] = useState({
    firstname: user.firstname || "",
    lastname: user.lastname || "",
    email: user.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({
    emailError: "",
    currentPasswordError: "",
    passwordError: "",
    generalError: "",
  });
  const saveBtnRef = useRef(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({
      emailError: "",
      currentPasswordError: "",
      passwordError: "",
      generalError: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, currentPassword, newPassword, confirmPassword } = formData;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormErrors({ ...formErrors, generalError: "Please enter a valid email address." });
      return;
    }

    if (newPassword || confirmPassword) {
      if (!currentPassword) {
        setFormErrors({ ...formErrors, currentPasswordError: "Current password is required to change password." });
        return;
      }
      if (newPassword !== confirmPassword) {
        setFormErrors({ ...formErrors, passwordError: "New passwords do not match." });
        return;
      }
    }

    try {
      saveBtnRef.current.innerText = "Saving...";
      saveBtnRef.current.disabled = true;

      const response = await updateProfileById({
        id: user._id,
        profileData: {
          firstname: formData.firstname.trim(),
          lastname: formData.lastname.trim(),
          email: formData.email.trim(),
          currentPassword: formData.currentPassword.trim(),
          confirmPassword: formData.confirmPassword.trim() || formData.currentPassword.trim(),
        },
      });

      if (!response.success) {
        setFormErrors({ ...formErrors, generalError: response.message });
      } else {
        alert("Profile updated successfully.");
        dispatch(updateUser({
          firstname: formData.firstname.trim(),
          lastname: formData.lastname.trim(),
          email: formData.email.trim(),
        }));
        setShowEditDialog(false);
        // Reset password fields
        setFormData({
          ...formData,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      // Revert on error
      dispatch(updateUser(previousUserData));
      setFormErrors({ ...formErrors, generalError: "Something went wrong. Please try again." });
    } finally {
      saveBtnRef.current.innerText = "Save Changes";
      saveBtnRef.current.disabled = false;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    // Clear all Redux stores
    dispatch(clearAuth());
    dispatch(clearUser());
    dispatch(clearCart());
    dispatch(clearWishlist());
    navigate("/auth/login");
  };

  const closeEditDialog = () => {
    setShowEditDialog(false);
    setFormErrors({
      emailError: "",
      currentPasswordError: "",
      passwordError: "",
      generalError: "",
    });
  };

  const getTimeAgo = (date) => {
    return `Member since ${new Date(date).toLocaleString("en-US", { month: "long", year: "numeric" })}`;
  };

  console.log(user);
  if (!user || !user._id) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const wishlist = wishlistItems || [];


  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] text-[#333] leading-[1.6] overflow-x-hidden font-['Poppins',_sans-serif]">
      <Navbar />
      
      <div className="max-w-[1400px] mt-20 mb-[20px] mx-auto px-[20px] grid grid-cols-[350px_1fr] gap-[25px] max-lg:grid-cols-[300px_1fr] max-md:grid-cols-1">
        {/* Profile Card */}
        <div className="bg-white rounded-[16px] shadow-[0_4px_15px_rgba(0,0,0,0.1)] p-[30px] sticky top-[20px] translate-y-0 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] border border-[rgba(138,74,243,0.1)] hover:-translate-y-[8px] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] max-md:static">
          <div className="text-center pb-[20px] relative">
            <div className="w-[140px] h-[140px] bg-[linear-gradient(135deg,#8a4af3,#6b48ff)] rounded-full mb-[15px] mx-auto relative overflow-hidden border-4 border-white shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-[60px] font-bold">
                {user.firstname ? user.firstname[0].toUpperCase() : "U"}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-[#6b48ff] mb-[10px]">
              {user.firstname} {user.lastname}
            </h2>
            <p className="text-[#666] text-[14px]">{getTimeAgo(user.createdAt)}</p>
          </div>

          <div className="grid grid-cols-2 gap-[15px] mt-[5px] mb-[20px] p-[15px] bg-[#f5f5f5] rounded-[10px]">
            <div className="text-center p-[10px] bg-white rounded-[8px] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-105">
              <span className="block text-[#8a4af3] font-semibold text-[18px]">{orders.length}</span>
              Orders
            </div>
            <div className="text-center p-[10px] bg-white rounded-[8px] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-105">
              <span className="block text-[#8a4af3] font-semibold text-[18px]">{wishlist.length}</span>
              Wishlist
            </div>
          </div>

          <div>
            <div className="grid grid-cols-[130px_1fr] p-[15px] border-b border-[#f5f5f5] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] bg-white my-[5px] rounded-[8px] hover:bg-[rgba(138,74,243,0.05)]">
              <span className="text-[#6b48ff] font-semibold text-[14px]">First Name:</span>
              <span className="text-[#444] text-[14px]">{user.firstname}</span>
            </div>
            <div className="grid grid-cols-[130px_1fr] p-[15px] border-b border-[#f5f5f5] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] bg-white my-[5px] rounded-[8px] hover:bg-[rgba(138,74,243,0.05)]">
              <span className="text-[#6b48ff] font-semibold text-[14px]">Last Name:</span>
              <span className="text-[#444] text-[14px]">{user.lastname}</span>
            </div>
            <div className="grid grid-cols-[130px_1fr] p-[15px] border-b border-[#f5f5f5] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] bg-white my-[5px] rounded-[8px] hover:bg-[rgba(138,74,243,0.05)]">
              <span className="text-[#6b48ff] font-semibold text-[14px]">Email:</span>
              <span className="text-[#444] text-[14px]">{user.email}</span>
            </div>
          </div>

          <div className="mt-[25px] flex gap-[15px]">
            <button
              className="flex-1 p-[14px] border-none rounded-[8px] cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] font-semibold text-[14px] uppercase tracking-[0.5px] bg-[linear-gradient(135deg,#8a4af3,#6b48ff)] text-white hover:brightness-110 hover:-translate-y-[2px]"
              onClick={() => setShowEditDialog(true)}
            >
              Edit Profile
            </button>
            <button
              className="flex-1 p-[14px] border-none rounded-[8px] cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] font-semibold text-[14px] uppercase tracking-[0.5px] bg-[#eee] text-[#666] hover:bg-[#ddd] hover:-translate-y-[2px]"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Orders and Wishlist Sections */}
        <div>
          <div className="p-[20px] bg-white rounded-[16px] shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
            <h3 className="text-[#6b48ff] mb-[25px] relative pb-[10px] text-[24px] font-semibold">
              Your Orders
              <span className="absolute bottom-0 left-0 w-[60px] h-[4px] bg-[linear-gradient(135deg,#8a4af3,#6b48ff)] rounded-[2px]"></span>
            </h3>
            {orders && orders.length > 0 ? (
              orders
                .filter((order) => order.book)
                .map((order) => (
                  <div
                    key={order._id}
                    className="flex justify-between bg-white rounded-[12px] shadow-[0_4px_15px_rgba(0,0,0,0.1)] p-[20px] mb-[20px] gap-[25px] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] animate-[slideIn_0.5s_ease-out] border border-[rgba(138,74,243,0.1)] hover:translate-x-[8px] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)]"
                  >
                    <div className="py-[10px] px-0">
                      <h4 className="text-[#8a4af3] mb-[12px] text-[18px] font-semibold">{order.book.title}</h4>
                      <p className="my-[8px] mx-0 text-[14px]">
                        <strong className="text-[#6b48ff]">Author:</strong> {order.book.author}
                      </p>
                      <p className="my-[8px] mx-0 text-[14px]">
                        <strong className="text-[#6b48ff]">Genre:</strong> {order.book.genre}
                      </p>
                      <p className="my-[8px] mx-0 text-[14px]">
                        <strong className="text-[#6b48ff]">Price:</strong> ₹{order.book.price || 0}
                      </p>
                      <p className="my-[8px] mx-0 text-[14px]">
                        <strong className="text-[#6b48ff]">Quantity:</strong> {order.quantity}
                      </p>
                      <p className="my-[8px] mx-0 text-[14px]">
                        <strong className="text-[#6b48ff]">Order Date:</strong>{" "}
                        {new Date(order.orderDate).toLocaleString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                      <p className="my-[8px] mx-0 text-[14px] line-clamp-3">
                        <strong className="text-[#6b48ff]">Description:</strong>{" "}
                        {order.book.description || "No description available"}
                      </p>
                    </div>
                    <div className="min-w-[23%] space-y-2">
                      <img
                        src={order.book.image || "https://m.media-amazon.com/images/I/61R+Cpm+HxL._SL1000_.jpg"}
                        alt={order.book.title}
                        className="w-[175px] h-[250px] mx-auto object-cover rounded-[8px] shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-105 cursor-pointer"
                        onClick={() => navigate(`/buyer/product-detail/${order.book._id}`)}
                      />
                      <div className="flex flex-col gap-[10px] justify-center items-stretch max-md:flex-row max-md:flex-wrap">
                        <span className="w-full text-center p-[12px] rounded-[6px] text-[14px] bg-[#f5f5f5] text-[#6b48ff] font-semibold">
                          {order.delivered ? "Delivered" : "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-center text-[#666]">No orders yet.</p>
            )}
          </div>

          <div className="bg-white rounded-[16px] shadow-[0_4px_15px_rgba(0,0,0,0.1)] p-[20px] mt-[25px]">
            <h3 className="text-[#6b48ff] mb-[25px] relative pb-[10px] text-[24px] font-semibold">
              Your Wishlist
              <span className="absolute bottom-0 left-0 w-[60px] h-[4px] bg-[linear-gradient(135deg,#8a4af3,#6b48ff)] rounded-[2px]"></span>
            </h3>
            {wishlist && wishlist.length > 0 ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-[20px] mt-[20px]">
                {wishlist.map((book, idx) => (
                  <div
                    key={book._id + idx}
                    className="text-center p-[15px] bg-white rounded-[10px] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-[5px] hover:shadow-[0_4px_15px_rgba(0,0,0,0.1)]"
                  >
                    <img
                      src={book.image || "https://m.media-amazon.com/images/I/61R+Cpm+HxL._SL1000_.jpg"}
                      alt={book.title}
                      className="mx-auto w-[100px] h-[130px] object-cover mb-[10px] rounded-[6px]"
                    />
                    <h4 className="text-[#8a4af3] text-[14px] mb-[5px]">{book.title}</h4>
                    <p className="text-[12px] text-[#666]">{book.author}</p>
                    <p className="text-[12px] text-[#6b48ff] font-semibold">₹{book.price || 0}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-[#666]">Your wishlist is empty.</p>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-[100] opacity-0 invisible transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          showEditDialog ? "opacity-100 visible" : ""
        }`}
        onClick={closeEditDialog}
      >
        <div
          className={`bg-white rounded-[12px] p-[30px] w-full max-w-[500px] shadow-[0_4px_15px_rgba(0,0,0,0.1)] scale-90 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            showEditDialog ? "scale-100" : ""
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-black mb-[20px] text-[20px] font-semibold">Edit Profile</h3>
          <form id="updateProfileForm" className="w-full flex flex-col justify-center items-center gap-[5px]" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="firstname" className="block mb-[3px] text-[rgb(55,65,81)] text-[12px]">
                First Name
              </label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                value={formData.firstname}
                onChange={handleInputChange}
                className="w-[440px] px-[12px] py-[10px] border border-[#f5f5f5] rounded-[6px] text-[14px] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none focus:border-[#8a4af3] focus:shadow-[0_0_0_3px_rgba(138,74,243,0.1)]"
              />
            </div>
            <div>
              <label htmlFor="lastname" className="block mb-[3px] text-[rgb(55,65,81)] text-[12px]">
                Last Name
              </label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
                className="w-[440px] px-[12px] py-[10px] border border-[#f5f5f5] rounded-[6px] text-[14px] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none focus:border-[#8a4af3] focus:shadow-[0_0_0_3px_rgba(138,74,243,0.1)]"
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-[3px] text-[rgb(55,65,81)] text-[12px]">
                Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-[440px] px-[12px] py-[10px] border border-[#f5f5f5] rounded-[6px] text-[14px] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none focus:border-[#8a4af3] focus:shadow-[0_0_0_3px_rgba(138,74,243,0.1)]"
              />
              <p className={`text-[#e63946] text-[12px] mt-[5px] ${formErrors.emailError ? "block" : "hidden"}`} id="emailError">
                {formErrors.emailError}
              </p>
            </div>
            <div className="w-full pt-[10px] border-t border-[#f5f5f5] mt-[15px]">
              <h4 className="text-[#6b48ff] mb-[15px] text-[16px]">Change Password</h4>
              <div>
                <label htmlFor="currentPassword" className="block mb-[3px] text-[rgb(55,65,81)] text-[12px]">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-[440px] px-[12px] py-[10px] border border-[#f5f5f5] rounded-[6px] text-[14px] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none focus:border-[#8a4af3] focus:shadow-[0_0_0_3px_rgba(138,74,243,0.1)]"
                />
                <p
                  className={`text-[#e63946] text-[12px] mt-[5px] ${
                    formErrors.currentPasswordError ? "block" : "hidden"
                  }`}
                  id="currentPasswordError"
                >
                  {formErrors.currentPasswordError}
                </p>
              </div>
              <div>
                <label htmlFor="newPassword" className="block mb-[3px] text-[rgb(55,65,81)] text-[12px]">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-[440px] px-[12px] py-[10px] border border-[#f5f5f5] rounded-[6px] text-[14px] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none focus:border-[#8a4af3] focus:shadow-[0_0_0_3px_rgba(138,74,243,0.1)]"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block mb-[3px] text-[rgb(55,65,81)] text-[12px]">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-[440px] px-[12px] py-[10px] border border-[#f5f5f5] rounded-[6px] text-[14px] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none focus:border-[#8a4af3] focus:shadow-[0_0_0_3px_rgba(138,74,243,0.1)]"
                />
                <p className={`text-[#e63946] text-[12px] mt-[5px] ${formErrors.passwordError ? "block" : "hidden"}`} id="passwordError">
                  {formErrors.passwordError}
                </p>
              </div>
            </div>
            <p
              id="errorMessage"
              className={`text-[#e63946] text-[14px] mt-[5px] ${formErrors.generalError ? "block" : "hidden"}`}
            >
              {formErrors.generalError}
            </p>
            <div className="flex gap-[10px] mt-[6px]">
              <button
                type="button"
                className="flex-1 border-none rounded-[8px] cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] font-semibold uppercase tracking-[0.5px] p-[12px] text-[14px] bg-[#eee] text-[#666]"
                onClick={closeEditDialog}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="border-none rounded-[8px] cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] font-semibold uppercase tracking-[0.5px] p-[12px] text-[14px] bg-[linear-gradient(135deg,#8a4af3,#6b48ff)] text-white disabled:opacity-70 disabled:cursor-not-allowed"
                id="saveBtn"
                ref={saveBtnRef}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BuyerProfile;  