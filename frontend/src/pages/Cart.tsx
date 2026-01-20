import React, { useState, useEffect } from 'react';
import { cartAPI } from '../api';
import './Cart.css';


interface CartItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

interface User {
  _id: string;
  username: string;
  email: string;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async (): Promise<void> => {
    try {
      const userString = localStorage.getItem('user');
      if (userString) {
        const user: User = JSON.parse(userString);
        const response = await cartAPI.getCart(user._id);
        setCartItems(response.data.products || []);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch cart');
      setLoading(false);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number): void => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: string): void => {
    setCartItems(prevItems =>
      prevItems.filter(item => item.productId !== productId)
    );
  };

  const calculateTotal = (): number => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const proceedToCheckout = (): void => {

    window.location.href = '/checkout';
  };

  if (loading) return <div className="loading">Loading cart...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="cart-container">
      <h1>Shopping Cart</h1>
      
      {cartItems.length > 0 ? (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.productId} className="cart-item">
                <div className="item-info">
                  <h3>{item.title}</h3>
                  <p className="item-price">${item.price}</p>
                </div>
                <div className="quantity-controls">
                  <button 
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="qty-btn"
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>
                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <button 
                  onClick={() => removeFromCart(item.productId)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-line">
              <span>Subtotal:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <div className="summary-line">
              <span>Shipping:</span>
              <span>$10.00</span>
            </div>
            <div className="summary-line total">
              <span>Total:</span>
              <span>${(calculateTotal() + 10).toFixed(2)}</span>
            </div>
            <button 
              onClick={proceedToCheckout}
              className="checkout-btn"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <a href="/" className="continue-shopping">Continue Shopping</a>
        </div>
      )}
    </div>
  );
};

export default Cart;