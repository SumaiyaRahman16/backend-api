import React, { useState, useEffect } from 'react';
import { cartAPI } from '../api';

interface CartItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  language?: string;
  description?: string;
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

  const updateQuantity = async (productId: string, newQuantity: number): Promise<void> => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    try {
      const userString = localStorage.getItem('user');
      if (userString) {
        const user: User = JSON.parse(userString);
        const response = await cartAPI.getCart(user._id);
        const cart = response.data;
        
        // Update the quantity in the cart
        const updatedProducts = cart.products.map((item: any) => 
          item.productId === productId 
            ? { ...item, quantity: newQuantity }
            : item
        );
        
        const updatedCart = {
          ...cart,
          products: updatedProducts
        };
        
        await cartAPI.updateCart(cart._id, updatedCart);
        
        // Update local state
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.productId === productId
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      setError('Failed to update quantity');
    }
  };

  const removeFromCart = async (productId: string): Promise<void> => {
    try {
      const userString = localStorage.getItem('user');
      if (userString) {
        const user: User = JSON.parse(userString);
        const response = await cartAPI.getCart(user._id);
        const cart = response.data;
        
        // Remove the product from the cart
        const updatedProducts = cart.products.filter((item: any) => item.productId !== productId);
        
        const updatedCart = {
          ...cart,
          products: updatedProducts
        };
        
        await cartAPI.updateCart(cart._id, updatedCart);
        
        // Update local state
        setCartItems(prevItems =>
          prevItems.filter(item => item.productId !== productId)
        );
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      setError('Failed to remove item');
    }
  };

  const calculateTotal = (): number => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const proceedToCheckout = (): void => {
    window.location.href = '/checkout';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your cart...</p>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Shopping Cart</h1>
          <p className="text-gray-600">Review your code snippets before checkout</p>
        </div>
        
        {cartItems.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.productId} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Product Image/Icon */}
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-cyan-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <div className="text-center">
                            <div className="text-2xl mb-1">💻</div>
                            {item.language && (
                              <span className="text-xs text-gray-500 font-mono">{item.language}</span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">{item.title}</h3>
                        {item.description && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                        )}
                        <div className="flex items-center gap-3">
                          <p className="text-2xl font-bold text-indigo-600">${item.price.toFixed(2)}</p>
                          {item.language && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-mono rounded">
                              {item.language}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center bg-gray-50 rounded-xl p-1">
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-10 h-10 rounded-lg bg-white shadow-sm hover:bg-gray-50 flex items-center justify-center font-bold text-gray-700 transition-colors"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-semibold text-gray-800">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-10 h-10 rounded-lg bg-white shadow-sm hover:bg-gray-50 flex items-center justify-center font-bold text-gray-700 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      
                      {/* Item Total */}
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-xl font-bold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      
                      {/* Remove Button */}
                      <button 
                        onClick={() => removeFromCart(item.productId)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove from cart"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 sticky top-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-800">${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-gray-800">$10.00</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-bold text-gray-800">Total</span>
                    <span className="font-bold text-indigo-600">${(calculateTotal() + 10).toFixed(2)}</span>
                  </div>
                </div>
                
                <button 
                  onClick={proceedToCheckout}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                >
                  Proceed to Checkout
                </button>
                
                <div className="mt-4 text-center">
                  <a 
                    href="/" 
                    className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                  >
                    ← Continue Shopping
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 p-12 max-w-md mx-auto">
              <div className="mb-6 flex justify-center">
                <img width="60" height="60" src="https://img.icons8.com/ios-glyphs/30/fast-cart.png" alt="cart"/>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Looks like you haven't added any code snippets yet</p>
              <a 
                href="/" 
                className="inline-block py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                Start Shopping
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;