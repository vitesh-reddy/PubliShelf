//client/src/pages/buyer/checkout/Checkout.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCheckout, placeOrder } from "../../../services/buyer.services.js";

const Checkout = () => {
  const [orderSummary, setOrderSummary] = useState({ subtotal: 0, shipping: 0, tax: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [showCardForm, setShowCardForm] = useState(false);
  const [showUpiForm, setShowUpiForm] = useState(false);
  const [addresses, setAddresses] = useState([
    { id: 1, name: "Vitesh Reddy", address: "Mandapeta, East Godavari District, 532459", phone: "+91 98765 43210" },
    { id: 2, name: "Balayya Babu", address: "Sri City, Tirupati District, 517425", phone: "+91 80992 69269" }
  ]);
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ fullName: "", phoneNumber: "", address: "", city: "", state: "", postalCode: "" });
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchCheckout();
  }, []);

  const fetchCheckout = async () => {
    try {
      setLoading(true);
      const response = await getCheckout();
      if (response.success) {
        setOrderSummary(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to fetch checkout data");
    } finally {
      setLoading(false);
    }
  };

  const validateAddress = () => {
    const errors = {};
    if (newAddress.fullName.trim().length < 3) errors.fullName = "Name must be at least 3 characters";
    if (!/^[0-9+\s]{10,15}$/.test(newAddress.phoneNumber)) errors.phoneNumber = "Invalid phone number";
    if (newAddress.address.trim().length < 10) errors.address = "Address must be at least 10 characters";
    if (newAddress.city.trim().length < 3) errors.city = "City must be at least 3 characters";
    if (newAddress.state.trim().length < 2) errors.state = "State must be at least 2 characters";
    if (!/^[0-9]{6}$/.test(newAddress.postalCode)) errors.postalCode = "Invalid postal code";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addNewAddress = (e) => {
    e.preventDefault();
    if (validateAddress()) {
      const newAddr = {
        id: Date.now(),
        name: newAddress.fullName,
        address: `${newAddress.address}, ${newAddress.city}, ${newAddress.state}, ${newAddress.postalCode}`,
        phone: newAddress.phoneNumber
      };
      setAddresses([...addresses, newAddr]);
      setSelectedAddress(newAddr.id);
      setShowNewAddressForm(false);
      setNewAddress({ fullName: "", phoneNumber: "", address: "", city: "", state: "", postalCode: "" });
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const response = await placeOrder();
      if (response.success) {
        alert("Order placed successfully!");
        navigate("/buyer/profile");
      } else {
        alert(response.message);
      }
    } catch (err) {
      alert("Error placing order");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {/* Shipping Address */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          <div className="space-y-3 mb-4">
            {addresses.map((addr) => (
              <label key={addr.id} className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="address"
                  checked={selectedAddress === addr.id}
                  onChange={() => setSelectedAddress(addr.id)}
                  className="mt-1"
                />
                <div>
                  <strong>{addr.name}</strong><br />
                  {addr.address}<br />
                  Phone: {addr.phone}
                </div>
              </label>
            ))}
          </div>
          <button onClick={() => setShowNewAddressForm(true)} className="text-purple-600 hover:underline">+ Add New Address</button>
        </div>

        {showNewAddressForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Add New Address</h3>
            <form onSubmit={addNewAddress}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={newAddress.fullName}
                    onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg ${formErrors.fullName ? "border-red-500" : ""}`}
                    required
                  />
                  {formErrors.fullName && <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={newAddress.phoneNumber}
                    onChange={(e) => setNewAddress({ ...newAddress, phoneNumber: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg ${formErrors.phoneNumber ? "border-red-500" : ""}`}
                    required
                  />
                  {formErrors.phoneNumber && <p className="text-red-500 text-xs mt-1">{formErrors.phoneNumber}</p>}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  rows="3"
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg ${formErrors.address ? "border-red-500" : ""}`}
                  required
                />
                {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg ${formErrors.city ? "border-red-500" : ""}`}
                    required
                  />
                  {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg ${formErrors.state ? "border-red-500" : ""}`}
                    required
                  />
                  {formErrors.state && <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={newAddress.postalCode}
                    onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg ${formErrors.postalCode ? "border-red-500" : ""}`}
                    required
                  />
                  {formErrors.postalCode && <p className="text-red-500 text-xs mt-1">{formErrors.postalCode}</p>}
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setShowNewAddressForm(false)} className="px-4 py-2 border border-gray-300 rounded text-gray-700">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded">
                  Save Address
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Payment */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          <div className="space-y-3">
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                checked={selectedPayment === "card"}
                onChange={() => setSelectedPayment("card")}
              />
              <div className="ml-3">
                <span>Credit/Debit Card</span>
                {/* logos */}
              </div>
            </label>
            {showCardForm && (
              <div className="p-4 border rounded-lg">
                {/* card form fields */}
              </div>
            )}
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                checked={selectedPayment === "upi"}
                onChange={() => setSelectedPayment("upi")}
              />
              <div className="ml-3">UPI</div>
            </label>
            {showUpiForm && (
              <div className="p-4 border rounded-lg">
                {/* UPI form */}
              </div>
            )}
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                checked={selectedPayment === "cod"}
                onChange={() => setSelectedPayment("cod")}
              />
              <div className="ml-3">Cash on Delivery</div>
            </label>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">Subtotal <span>₹{orderSummary.subtotal}</span></div>
            <div className="flex justify-between">Shipping <span>₹{orderSummary.shipping}</span></div>
            <div className="flex justify-between">Tax <span>₹{orderSummary.tax.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold pt-2 border-t">Total <span>₹{orderSummary.total.toFixed(2)}</span></div>
          </div>
          <button onClick={handlePlaceOrder} className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700">
            Place Your Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;