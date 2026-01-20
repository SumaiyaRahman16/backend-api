import React, { useState, useEffect } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { cartAPI, orderAPI } from '../api';
import './Checkout.css';

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

      
      const response = await fetch('http://localhost:3001/api/checkout/payment', {
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

  if (loading) return <div className="loading">Loading checkout...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!cart || !cart.products || cart.products.length === 0) {
    return (
      <div className="empty-checkout">
        <h2>Your cart is empty</h2>
        <a href="/" className="continue-shopping">Continue Shopping</a>
      </div>
    );
  }

  const isFormValid = Object.values(shippingAddress).every(value => value.trim() !== '');

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      
      <div className="checkout-content">
        {/* Order Summary */}
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="cart-items">
            {cart.products.map((item, index) => (
              <div key={index} className="checkout-item">
                <span>Product ID: {item.productId}</span>
                <span>Qty: {item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="summary-totals">
            <div className="summary-line">
              <span>Subtotal:</span>
              <span>${cart.totalAmount?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="summary-line">
              <span>Shipping:</span>
              <span>$10.00</span>
            </div>
            <div className="summary-line total">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address Form */}
        <div className="shipping-form">
          <h3>Shipping Address</h3>
          <form>
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={shippingAddress.firstName}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={shippingAddress.lastName}
                  onChange={handleAddressChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <input
                type="text"
                name="address"
                placeholder="Street Address"
                value={shippingAddress.address}
                onChange={handleAddressChange}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={shippingAddress.city}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={shippingAddress.state}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="zipCode"
                  placeholder="ZIP Code"
                  value={shippingAddress.zipCode}
                  onChange={handleAddressChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={shippingAddress.country}
                onChange={handleAddressChange}
                required
              />
            </div>
          </form>
        </div>
      </div>

      {/* Payment Section */}
      <div className="payment-section">
        {isFormValid ? (
          <StripeCheckout
            token={onToken}
            stripeKey={KEY}
            amount={calculateTotal() * 100} // Amount in cents
            name="Your Store Name"
            description="Complete your purchase"
            image="https://via.placeholder.com/300x200?text=Your+Logo"
            currency="USD"
            shippingAddress={true}
            billingAddress={true}
          >
            <button className="pay-button">
              Pay ${calculateTotal().toFixed(2)}
            </button>
          </StripeCheckout>
        ) : (
          <button className="pay-button disabled" disabled>
            Please fill in all address fields
          </button>
        )}
      </div>
    </div>
  );
};

export default Checkout;