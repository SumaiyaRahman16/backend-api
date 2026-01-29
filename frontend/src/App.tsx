import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Success from './pages/Success';


interface User {
  _id: string;
  username: string;
  email: string;
}

const App: React.FC = () => {
  const userString = localStorage.getItem('user');
  const user: User | null = userString ? JSON.parse(userString) : null;

  const handleLogout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Professional Navbar */}
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo Section */}
              <div className="flex items-center">
                <Link to="/" className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <img width="20" height="20" src="https://img.icons8.com/ios-glyphs/30/workstation.png" alt="logo" className="filter invert"/>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">DevSnippet</span>
                </Link>
              </div>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center space-x-8">
                <Link 
                  to="/" 
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Home
                </Link>
                <Link 
                  to="/cart" 
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                >
                  <img width="16" height="16" src="https://img.icons8.com/ios-glyphs/30/fast-cart.png" alt="cart"/>
                  Cart
                </Link>
              </div>

              {/* User Menu / Auth Buttons */}
              <div className="flex items-center space-x-4">
                {user ? (
                  <div className="flex items-center space-x-4">
                    <div className="hidden sm:flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-indigo-600">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-700">Welcome, {user.username}</span>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-red-200 hover:border-red-300"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link 
                    to="/login"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Navigation (hidden by default, can be expanded) */}
          <div className="md:hidden border-t border-gray-200">
            <div className="px-4 py-3 space-y-2">
              <Link 
                to="/" 
                className="block text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Home
              </Link>
              <Link 
                to="/cart" 
                className="block text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium flex items-center gap-2"
              >
                <img width="16" height="16" src="https://img.icons8.com/ios-glyphs/30/fast-cart.png" alt="cart"/>
                Cart
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/success" element={<Success />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
