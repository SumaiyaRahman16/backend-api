import React, { useState, useEffect } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { cartAPI, orderAPI } from '../api';

const KEY = "pk_test_51Sra3yGYRtriaUNUYMA0DU6NIzwBFKA0k3Nrc6NHu1aOkZk6OPslddHlodP90LH1MXM3uD3pJydbwFSUm3ORGwUk009ZKkF10v"; // Stripe test publishable key

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const userString = localStorage.getItem('user');
      if (!userString) {
        setError('Please login to checkout');
        return;
      }

      const user = JSON.parse(userString);
      const response = await cartAPI.getCart(user._id);
      setCart(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch cart');
      setLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const calculateTotal = () => {
    return cart ? cart.totalAmount + 10 : 0; 
  };

  const onToken = async (token) => {
    setOrderLoading(true);
    try {
      const userString = localStorage.getItem('user');
      const user = JSON.parse(userString);


      const orderData = {
        userId: user._id,
        products: cart.products,
        amount: calculateTotal() * 100, 
        address: shippingAddress,
        token: token
      };

      
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/checkout/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (response.ok) {
        // Payment successful - create order in database
        const newOrder = {
          userId: user._id,
          products: cart.products,
          amount: calculateTotal(),
          address: shippingAddress,
          status: 'paid'
        };

        await orderAPI.createOrder(newOrder);

        // Clear cart after successful order
        await cartAPI.deleteCart(cart._id);

        alert('Order placed successfully!');
        window.location.href = '/success';
      } else {
        throw new Error(result.message || 'Payment failed');
      }
    } catch (err) {
      console.error('Payment error:', err);
      alert(`Payment failed: ${err.message}`);
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <img width="64" height="64" src="https://img.icons8.com/dotty/80/error--v1.png" alt="error"/>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Checkout Error</h2>
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!cart || !cart.products || cart.products.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 13M7 13v8a2 2 0 002 2h6a2 2 0 002-2v-8m-8 0V9a2 2 0 012-2h4a2 2 0 012 2v4.01" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart before checkout</p>
          <a 
            href="/" 
            className="inline-block py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  const isFormValid = Object.values(shippingAddress).every(value => value.trim() !== '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-8 px-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Checkout</h1>
          <p className="text-gray-600">Review your order and complete your purchase</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Order Summary */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h3>
            <div className="space-y-4 mb-6">
              {cart.products.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{item.title || item.productId?.title || `Product ID: ${item.productId}`}</h4>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">${((item.price || 0) * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-800">${cart.totalAmount?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold text-gray-800">$10.00</span>
              </div>
              <div className="flex justify-between items-center text-lg pt-2 border-t border-gray-200">
                <span className="font-bold text-gray-800">Total</span>
                <span className="font-bold text-indigo-600">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Shipping Address</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={shippingAddress.firstName}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={shippingAddress.lastName}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                </div>
              </div>
              
              <div>
                <input
                  type="text"
                  name="address"
                  placeholder="Street Address"
                  value={shippingAddress.address}
                  onChange={handleAddressChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={shippingAddress.city}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={shippingAddress.state}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                </div>
              </div>

              <div>
                <input
                  type="text"
                  name="zipCode"
                  placeholder="ZIP Code"
                  value={shippingAddress.zipCode}
                  onChange={handleAddressChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                />
              </div>
              
              <div>
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={shippingAddress.country}
                  onChange={handleAddressChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 text-center">
          {isFormValid ? (
            <StripeCheckout
              token={onToken}
              stripeKey={KEY}
              amount={calculateTotal() * 100} // Amount in cents
              name="DevSnippet Marketplace"
              description="Complete your code snippet purchase"
              image="https://via.placeholder.com/300x200?text=DevSnippet"
              currency="USD"
              shippingAddress={true}
              billingAddress={true}
            >
              <button className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center gap-2 mx-auto">
                <img width="20" height="20" src="https://img.icons8.com/dotty/80/credit-card-front.png" alt="credit-card" className="filter brightness-0 invert"/>
                Pay ${calculateTotal().toFixed(2)}
              </button>
            </StripeCheckout>
          ) : (
            <button className="px-8 py-4 bg-gray-400 text-white font-bold text-lg rounded-xl cursor-not-allowed opacity-50" disabled>
              Please fill in all address fields
            </button>
          )}
          <p className="text-sm text-gray-500 mt-4 flex items-center justify-center gap-2">
            <img width="16" height="16" src="https://img.icons8.com/dotty/80/lock-2.png" alt="lock"/>
            Your payment information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;