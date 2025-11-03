//client/src/pages/buyer/checkout/Checkout.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCheckout, placeOrder } from "../../../services/buyer.services.js";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Checkout = () => {
    const [orderSummary, setOrderSummary] = useState({ subtotal: 0, shipping: 0, tax: 0, total: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedPayment, setSelectedPayment] = useState("cod");
    const [showCardForm, setShowCardForm] = useState(false);
    const [showUpiForm, setShowUpiForm] = useState(false);
    const [showNewAddressForm, setShowNewAddressForm] = useState(false);
    const [addresses, setAddresses] = useState([
        { id: 1, name: "Vitesh Reddy", address: "Mandapeta, East Godavari District, 532459", phone: "+91 98765 43210" },
        { id: 2, name: "Balayya Babu", address: "Sri City, Tirupati District, 517425", phone: "+91 80992 69269" }
    ]);
    const [savedCards, setSavedCards] = useState([]);
    const [savedUpiIds, setSavedUpiIds] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(1);
    const [newAddress, setNewAddress] = useState({ fullName: "", phoneNumber: "", address: "", city: "", state: "", postalCode: "" });
    const [cardDetails, setCardDetails] = useState({ cardNumber: "", expiryDate: "", cvv: "" });
    const [upiDetails, setUpiDetails] = useState({ upiId: "" });
    const [formErrors, setFormErrors] = useState({});
    const [cardErrors, setCardErrors] = useState({});
    const [upiErrors, setUpiErrors] = useState({});
    const [isSavingAddress, setIsSavingAddress] = useState(false);
    const [placingOrder, setPlacingOrder] = useState(false);
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
        if (!/^\+?[0-9]{10}$/.test(newAddress.phoneNumber)) errors.phoneNumber = "Phone number must be exactly 10 digits";
        if (newAddress.address.trim().length < 10) errors.address = "Address must be at least 10 characters";
        if (!/^[a-zA-Z\s]+$/.test(newAddress.city)) errors.city = "City must contain only letters and spaces";
        if (!/^[a-zA-Z\s]+$/.test(newAddress.state)) errors.state = "State must contain only letters and spaces";
        if (!/^[0-9]{6}$/.test(newAddress.postalCode)) errors.postalCode = "Postal code must be exactly 6 digits";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateCard = () => {
        const errors = {};
        if (!/^[0-9]{16}$/.test(cardDetails.cardNumber)) errors.cardNumber = "Card number must be exactly 16 digits";
        if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(cardDetails.expiryDate)) errors.expiryDate = "Expiry date must be in MM/YY format";
        if (!/^[0-9]{3}$/.test(cardDetails.cvv)) errors.cvv = "CVV must be exactly 3 digits";
        setCardErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateUpi = () => {
        const errors = {};
        if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(upiDetails.upiId)) errors.upiId = "Please enter a valid UPI ID (username@provider)";
        setUpiErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const addNewAddress = (e) => {
        e.preventDefault();
        if (validateAddress()) {
            setIsSavingAddress(true);
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
            setFormErrors({});
            setIsSavingAddress(false);
        }
    };

    const handleSaveCard = (e) => {
        e.preventDefault();
        if (validateCard()) {
            const newCard = {
                id: `card${savedCards.length + 1}`,
                number: cardDetails.cardNumber,
                expiry: cardDetails.expiryDate
            };
            setSavedCards([newCard, ...savedCards]);
            setCardDetails({ cardNumber: "", expiryDate: "", cvv: "" });
            setCardErrors({});
            setShowCardForm(false);
            setSelectedPayment(newCard.id);
        }
    };

    const handleSaveUpi = (e) => {
        e.preventDefault();
        if (validateUpi()) {
            const newUpi = {
                id: `upi${savedUpiIds.length + 1}`,
                upiId: upiDetails.upiId
            };
            setSavedUpiIds([newUpi, ...savedUpiIds]);
            setUpiDetails({ upiId: "" });
            setUpiErrors({});
            setShowUpiForm(false);
            setSelectedPayment(newUpi.id);
        }
    };

    const togglePaymentForm = (type) => {
        if (type === "card") {
            setSelectedPayment("creditCard");
            setShowCardForm(!showCardForm);
            setShowUpiForm(false);
            if (showCardForm) {
                setCardDetails({ cardNumber: "", expiryDate: "", cvv: "" });
                setCardErrors({});
            }
        } else if (type === "upi") {
            setSelectedPayment("upi");
            setShowUpiForm(!showUpiForm);
            setShowCardForm(false);
            if (showUpiForm) {
                setUpiDetails({ upiId: "" });
                setUpiErrors({});
            }
        } else {
            setSelectedPayment("cod");
            setShowCardForm(false);
            setShowUpiForm(false);
        }
    };

    const handlePlaceOrder = async () => {        
        if (!selectedPayment) {
            alert("Please select a payment method before placing your order.");
            return;
        }
        if (orderSummary.subtotal <= 0) {
            alert("Your cart is empty. Please add items before placing an order.");
            return;
        }
        setPlacingOrder(true);
        try {
            const response = await placeOrder();
            if (response.success) {
                alert("Order placed successfully!");
                navigate("/buyer/cart");
            } else
                alert(response.message);
        } catch (err) {
            alert("Error placing order");
        }
        setPlacingOrder(false);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

    const inputStyle = "w-full p-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white transition-all duration-300 ease-in-out focus:border-purple-600 focus:outline-none focus:ring-3 focus:ring-purple-600/10";
    const errorInputStyle = "border-red-500";

    return (
        <div className="flex flex-col min-h-screen checkout-page">
            <Navbar />

            <div className="bg-gradient-to-b from-[#f3e8ff] to-white pt-20">
                <div className="max-w-[800px] mx-auto p-5 md:p-5">
                    <h1 className="text-3xl font-bold text-gray-800 mb-5">Checkout</h1>

                    {/* Shipping Address */}
                    <div className="bg-white rounded-lg shadow-md p-5 mb-5 animate-fade-in md:p-5">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Shipping Address</h2>
                        <div className="flex flex-col gap-2.5" id="savedAddresses">
                            {addresses.map((addr) => (
                                <div key={addr.id} className="flex items-center gap-2.5 p-2.5 border border-gray-200 rounded-lg cursor-pointer">
                                    <input
                                        type="radio"
                                        name="address"
                                        id={`address${addr.id}`}
                                        checked={selectedAddress === addr.id}
                                        onChange={() => setSelectedAddress(addr.id)}
                                        className="mr-2.5"
                                    />
                                    <label htmlFor={`address${addr.id}`} className="w-full">
                                        <strong className="text-gray-800">{addr.name}</strong><br />
                                        <span className="text-gray-600">{addr.address}</span><br />
                                        <span className="text-gray-600">Phone: {addr.phone}</span>
                                    </label>
                                </div>
                            ))}
                            <button className="p-2.5 bg-gray-100 border border-dashed border-gray-200 rounded-lg text-center cursor-pointer text-purple-600 font-medium hover:bg-gray-200" onClick={() => setShowNewAddressForm(!showNewAddressForm)}>
                                + Add New Address
                            </button>
                        </div>

                        {showNewAddressForm && (
                            <div className="mt-5 bg-white rounded-lg shadow-md p-5 animate-[slideIn_0.5s_ease-out]" id="newAddressForm">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Address</h3>
                                <form id="addressForm" onSubmit={addNewAddress}>
                                    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
                                        <div className="mb-5">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                            <input type="text" value={newAddress.fullName} onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })} className={`${inputStyle} ${formErrors.fullName ? errorInputStyle : ''}`} required minLength="3" />
                                            <div className={`text-red-500 text-xs mt-1 ${formErrors.fullName ? 'block' : 'hidden'}`}>{formErrors.fullName}</div>
                                        </div>
                                        <div className="mb-5">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                            <input type="tel" value={newAddress.phoneNumber} onChange={(e) => setNewAddress({ ...newAddress, phoneNumber: e.target.value })} className={`${inputStyle} ${formErrors.phoneNumber ? errorInputStyle : ''}`} required />
                                            <div className={`text-red-500 text-xs mt-1 ${formErrors.phoneNumber ? 'block' : 'hidden'}`}>{formErrors.phoneNumber}</div>
                                        </div>
                                    </div>
                                    <div className="mb-5">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                        <textarea rows="3" value={newAddress.address} onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })} className={`${inputStyle} ${formErrors.address ? errorInputStyle : ''}`} required />
                                        <div className={`text-red-500 text-xs mt-1 ${formErrors.address ? 'block' : 'hidden'}`}>{formErrors.address}</div>
                                    </div>
                                    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
                                        <div className="mb-5">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                            <input type="text" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} className={`${inputStyle} ${formErrors.city ? errorInputStyle : ''}`} required />
                                            <div className={`text-red-500 text-xs mt-1 ${formErrors.city ? 'block' : 'hidden'}`}>{formErrors.city}</div>
                                        </div>
                                        <div className="mb-5">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                            <input type="text" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} className={`${inputStyle} ${formErrors.state ? errorInputStyle : ''}`} required />
                                            <div className={`text-red-500 text-xs mt-1 ${formErrors.state ? 'block' : 'hidden'}`}>{formErrors.state}</div>
                                        </div>
                                        <div className="mb-5">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                                            <input type="text" value={newAddress.postalCode} onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })} className={`${inputStyle} ${formErrors.postalCode ? errorInputStyle : ''}`} required />
                                            <div className={`text-red-500 text-xs mt-1 ${formErrors.postalCode ? 'block' : 'hidden'}`}>{formErrors.postalCode}</div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2.5 mt-4">
                                        <button type="button" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg" onClick={() => setShowNewAddressForm(false)}>Cancel</button>
                                        <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg disabled:bg-purple-400" disabled={isSavingAddress}>{isSavingAddress ? "Saving..." : "Save Address"}</button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white rounded-lg shadow-md p-5 mb-5 animate-fade-in-delay md:p-5">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Method</h2>
                        <div className="flex flex-col gap-2.5">
                            <div className="flex items-center gap-2.5 p-2.5 border border-gray-200 rounded-lg cursor-pointer" onClick={() => togglePaymentForm("card")}>
                                <div className="flex items-center gap-2">
                                    <img src="https://logos-world.net/wp-content/uploads/2004/09/Visa-Logo-2014.png" alt="Visa" className="h-5" />
                                    <img src="https://logos-world.net/wp-content/uploads/2020/09/Mastercard-Logo.png" alt="MasterCard" className="h-5" />
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/RuPay-Logo.svg/2560px-RuPay-Logo.svg.png" alt="Rupay" className="h-5" />
                                    Credit/Debit Card
                                </div>
                            </div>
                            {showCardForm && (
                                <div className="mt-5 bg-white rounded-lg shadow-md p-5 animate-[slideIn_0.5s_ease-out]">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">Enter Card Details</h3>
                                    <form onSubmit={handleSaveCard}>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                                            <input type="text" value={cardDetails.cardNumber} onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })} className={`${inputStyle} ${cardErrors.cardNumber ? errorInputStyle : ''}`} required />
                                            <div className={`text-red-500 text-xs mt-1 ${cardErrors.cardNumber ? 'block' : 'hidden'}`}>{cardErrors.cardNumber}</div>
                                        </div>
                                        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Expiration Date</label>
                                                <input type="text" placeholder="MM/YY" value={cardDetails.expiryDate} onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: e.target.value })} className={`${inputStyle} ${cardErrors.expiryDate ? errorInputStyle : ''}`} required />
                                                <div className={`text-red-500 text-xs mt-1 ${cardErrors.expiryDate ? 'block' : 'hidden'}`}>{cardErrors.expiryDate}</div>
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                                                <input type="text" value={cardDetails.cvv} onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })} className={`${inputStyle} ${cardErrors.cvv ? errorInputStyle : ''}`} required />
                                                <div className={`text-red-500 text-xs mt-1 ${cardErrors.cvv ? 'block' : 'hidden'}`}>{cardErrors.cvv}</div>
                                            </div>
                                        </div>
                                        <div className="flex justify-end mt-4">
                                            <button type="submit" className="w-full p-3 bg-purple-600 text-white rounded-lg text-base font-medium transition-all duration-300 ease-in-out hover:bg-purple-700 hover:-translate-y-0.5">Save Card</button>
                                        </div>
                                    </form>
                                </div>
                            )}
                            {savedCards.map((card) => (
                                <div key={card.id} className="flex items-center gap-2.5 p-2.5 border border-gray-200 rounded-lg cursor-pointer bg-gray-50" onClick={() => setSelectedPayment(card.id)}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        id={card.id}
                                        checked={selectedPayment === card.id}
                                        onChange={() => setSelectedPayment(card.id)}
                                        className="mr-2"
                                    />
                                    <label htmlFor={card.id} className="w-full cursor-pointer">
                                        <span className="font-semibold text-gray-800">
                                            Card ending in {card.number.slice(-4)}
                                        </span>
                                        <br />
                                        <span className="text-gray-500 text-sm">Expires: {card.expiry}</span>
                                    </label>
                                </div>
                            ))}                            
                            <div className="flex items-center gap-2.5 p-2.5 border border-gray-200 rounded-lg cursor-pointer" onClick={() => togglePaymentForm('upi')}>
                                <input type="radio" name="payment" id="upi" checked={selectedPayment === 'upi'} onChange={() => {}} className="hidden" />
                                <label htmlFor="upi" className="flex items-center gap-2 cursor-pointer">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" alt="UPI" className="h-5" />
                                    UPI
                                </label>
                            </div>
                            {showUpiForm && (
                                <div className="mt-5 bg-white rounded-lg shadow-md p-5 animate-[slideIn_0.5s_ease-out]">
                                     <h3 className="text-xl font-bold text-gray-800 mb-4">Enter UPI ID</h3>
                                     <form onSubmit={handleSaveUpi}>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
                                            <input type="text" value={upiDetails.upiId} onChange={e => setUpiDetails({...upiDetails, upiId: e.target.value})} className={`${inputStyle} ${upiErrors.upiId ? errorInputStyle : ''}`} required />
                                            <div className={`text-red-500 text-xs mt-1 ${upiErrors.upiId ? 'block' : 'hidden'}`}>{upiErrors.upiId}</div>
                                        </div>
                                        <div className="flex justify-end mt-4">
                                            <button type="submit" className="w-full p-3 bg-purple-600 text-white rounded-lg text-base font-medium transition-all duration-300 ease-in-out hover:bg-purple-700 hover:-translate-y-0.5">Save UPI</button>
                                        </div>
                                     </form>
                                </div>
                            )}
                             {savedUpiIds.map((upi) => (
                                <div key={upi.id} className="flex items-center gap-2.5 p-2.5 border border-gray-200 rounded-lg cursor-pointer bg-gray-50" onClick={() => setSelectedPayment(upi.id)}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        id={upi.id}
                                        checked={selectedPayment === upi.id}
                                        onChange={() => setSelectedPayment(upi.id)}
                                        className="mr-2"
                                    />
                                    <label htmlFor={upi.id} className="w-full cursor-pointer">
                                        <span className="font-semibold text-gray-800">
                                            UPI ID: {upi.upiId}
                                        </span>
                                    </label>
                                </div>
                            ))}                            

                            <div className="flex items-center gap-2.5 p-2.5 border border-gray-200 rounded-lg cursor-pointer" onClick={() => togglePaymentForm('cod')}>
                                <input type="radio" name="payment" id="cod" checked={selectedPayment === 'cod'} onChange={() => {}} />
                                <label htmlFor="cod" className="flex items-center gap-2 cursor-pointer">
                                    <i className="fas fa-money-bill-wave"></i>
                                    Cash on Delivery
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white rounded-lg shadow-md p-5 animate-fade-in-delay-2 md:p-5">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>
                        <div className="flex justify-between mb-3 text-sm text-gray-700">
                            <span>Subtotal</span>
                            <span>₹{orderSummary.subtotal}</span>
                        </div>
                        <div className="flex justify-between mb-3 text-sm text-gray-700">
                            <span>Shipping</span>
                            <span>₹{orderSummary.shipping}</span>
                        </div>
                        <div className="flex justify-between mb-3 text-sm text-gray-700">
                            <span>Tax</span>
                            <span>₹{orderSummary.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-base text-gray-800 mb-3">
                            <span>Total</span>
                            <span>₹{orderSummary.total.toFixed(2)}</span>
                        </div>
                        <button disabled={placingOrder} onClick={handlePlaceOrder} className="w-full p-3 bg-purple-600 disabled:bg-purple-400 disabled:cursor-not-allowed text-white border-none rounded-lg text-base font-medium cursor-pointer transition-all duration-300 ease-in-out hover:bg-purple-700 hover:-translate-y-0.5">
                            {placingOrder ? "Placing" : "Place"}  Your Order
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Checkout;
