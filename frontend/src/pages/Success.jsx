import React from 'react';
import './Success.css';

const Success = () => {
  return (
    <div className="success-container">
      <div className="success-content">
        <div className="success-icon">
          ✅
        </div>
        <h1>Order Placed Successfully!</h1>
        <p>Thank you for your purchase. Your order has been processed and you will receive a confirmation email shortly.</p>
        
        <div className="success-actions">
          <a href="/" className="btn-primary">
            Continue Shopping
          </a>
          <a href="/orders" className="btn-secondary">
            View Orders
          </a>
        </div>
      </div>
    </div>
  );
};

export default Success;