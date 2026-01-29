import React, { useState, useEffect } from 'react';
import { productAPI, cartAPI } from '../api';
import './Home.css';

// MarqueeSection Component
const MarqueeSection = ({ products, onAddToCart, onPreview }) => {
  // Double the products array to create infinite loop effect
  const doubledProducts = [...products, ...products];

  const SnippetCard = ({ product }) => (
    <div className="group relative flex-shrink-0 w-80 mx-3">
      {/* Clean, modern card with subtle shadow */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden transform transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
        {/* Mac-style header with dots - lighter theme */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <div className="bg-gray-200 px-3 py-1 rounded-md">
            <span className="text-gray-600 text-xs font-mono font-medium">{product.language || 'javascript'}</span>
          </div>
        </div>
        
        {/* Card Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 leading-tight pr-2">{product.title}</h3>
            <span className="text-2xl font-bold text-emerald-600 whitespace-nowrap">${product.price}</span>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
          
          {/* Code preview section - lighter */}
          <div className="bg-gray-900 rounded-lg p-4 mb-4 border border-gray-200 overflow-hidden">
            <pre className="text-emerald-400 text-xs font-mono overflow-hidden">
              <code>{product.codeContent ? product.codeContent.substring(0, 120) + '...' : 'const snippet = () => {\n  // Amazing code here\n  return magic;\n};'}</code>
            </pre>
          </div>
          
          {/* Stats and buttons */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{product.purchaseCount || 0} downloads</span>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onPreview(product);
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-all duration-200 border border-slate-300 hover:border-slate-400"
            >
              Preview
            </button>
          </div>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full py-12 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      <div className="mb-8 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-3">
          <img width="40" height="40" src="https://img.icons8.com/matisse/100/fire.png" alt="fire" className="inline-block"/>
          Top Code Snippets
        </h2>
        <p className="text-gray-600 text-lg">Premium code snippets from our community</p>
      </div>
      
      {/* Marquee Container with subtle fade edges */}
      <div className="relative">
        {/* Left fade gradient - much subtler */}
        <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-white via-white to-transparent z-10 pointer-events-none"></div>
        
        {/* Right fade gradient - much subtler */}
        <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white via-white to-transparent z-10 pointer-events-none"></div>
        
        {/* Scrolling container */}
        <div className="flex marquee-scroll">
          {doubledProducts.map((product, index) => (
            <SnippetCard 
              key={`${product._id}-${index}`} 
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Snippet Preview Modal Component
const SnippetPreviewModal = ({ product, isOpen, onClose }) => {
  const [copyText, setCopyText] = useState('Copy Preview');

  const copyToClipboard = async () => {
    try {
      // Only copy the preview, not the full code
      const previewCode = product.codeContent ? product.codeContent.substring(0, 200) + '...\n\n// Purchase to see the complete code!' : '';
      await navigator.clipboard.writeText(previewCode);
      setCopyText('Preview Copied!');
      setTimeout(() => setCopyText('Copy Preview'), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Create a limited preview of the code (first 5-8 lines)
  const getPreviewCode = () => {
    if (!product.codeContent) return 'No code preview available';
    
    const lines = product.codeContent.split('\n');
    const previewLines = lines.slice(0, Math.min(8, lines.length));
    const preview = previewLines.join('\n');
    
    // Add ellipsis if there's more content
    if (lines.length > 8) {
      return preview + '\n\n// ... and ' + (lines.length - 8) + ' more lines\n// Purchase to unlock the complete code!';
    }
    return preview;
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-[#0f172a] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-white">{product.title}</h2>
            <div className="flex items-center gap-4 mt-1">
              <p className="text-slate-400 text-sm">{product.language || 'javascript'}</p>
              <div className="bg-amber-500/20 text-amber-400 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                <img width="12" height="12" src="https://img.icons8.com/dotty/80/lock-2.png" alt="lock" className="filter brightness-0 invert"/>
                PREVIEW ONLY
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Code Content with blur effect */}
        <div className="relative">
          {/* Copy button */}
          <button
            onClick={copyToClipboard}
            className="absolute top-4 right-4 z-10 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {copyText}
          </button>
          
          {/* Preview badge */}
          <div className="absolute top-4 left-4 z-10 bg-amber-500/20 text-amber-400 px-3 py-2 rounded-lg text-sm font-medium border border-amber-500/30 flex items-center gap-2">
            <img width="16" height="16" src="https://img.icons8.com/ios/50/add-rule.png" alt="preview" className="filter brightness-0 invert"/>
            Limited Preview
          </div>
          
          {/* Code block with blur effect */}
          <div className="p-6 pt-16 overflow-x-auto max-h-[45vh] relative">
            <pre className="text-green-400 font-mono text-sm leading-relaxed">
              <code>{getPreviewCode()}</code>
            </pre>
            
            {/* Gradient blur overlay for the bottom part */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-transparent pointer-events-none"></div>
          </div>
          
          {/* Blur overlay message */}
          <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
            <div className="inline-block bg-slate-800/90 backdrop-blur-sm border border-slate-600 rounded-lg px-4 py-2 mx-4">
              <p className="text-slate-300 text-sm font-medium flex items-center gap-2">
                <img width="16" height="16" src="https://img.icons8.com/dotty/80/lock-2.png" alt="lock" className="filter brightness-0 invert"/>
                Complete code available after purchase
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer with purchase incentive */}
        <div className="flex items-center justify-between p-6 border-t border-slate-700 bg-slate-900/50">
          <div className="text-slate-400 text-sm">
            <div className="flex items-center gap-4">
              <span>{product.purchaseCount || 0} developers purchased</span>
              <span className="text-emerald-400 font-bold text-lg">${product.price}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Close Preview
            </button>
            <button
              onClick={() => {
                // Add to cart instead of direct purchase
                const addToCartEvent = new CustomEvent('addToCart', { detail: product });
                window.dispatchEvent(addToCartEvent);
                onClose();
              }}
              className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <img width="16" height="16" src="https://img.icons8.com/ios-glyphs/30/fast-cart.png" alt="cart" className="filter brightness-0 invert"/>
              Add to Cart - Unlock Full Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
    
    // Add event listener for modal add to cart
    const handleAddToCart = (event) => {
      addToCart(event.detail);
    };
    
    window.addEventListener('addToCart', handleAddToCart);
    
    return () => {
      window.removeEventListener('addToCart', handleAddToCart);
    };
  }, []);

  const openPreviewModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closePreviewModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const fetchProducts = async () => {
    try {
      console.log('Fetching products from API...');
      const response = await productAPI.getAllProducts();
      console.log('API Response:', response.data);
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(`Failed to fetch products: ${err.response?.data?.message || err.message}`);
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    try {
      const userString = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (!userString || !token) {
        alert('Please login to add items to cart');
        window.location.href = '/login';
        return;
      }

      const user = JSON.parse(userString);
      console.log('User:', user);
      console.log('Token:', token);
      console.log('Adding to cart:', product);
      

      let cartResponse;
      try {
        cartResponse = await cartAPI.getCart(user._id);
        console.log('Existing cart:', cartResponse.data);
      } catch (error) {
        console.log('Cart error:', error.response);

        if (error.response?.status === 404) {
          console.log('Creating new cart...');
          const newCart = {
            userId: user._id,
            products: [{
              productId: product._id,
              quantity: 1
            }],
            totalAmount: product.price,
            address: {} // Empty address object for now
          };
          cartResponse = await cartAPI.createCart(newCart);
          console.log('New cart created:', cartResponse.data);
          alert('Product added to cart!');
          return;
        }
        throw error;
      }

      // If cart exists, update it
      const existingCart = cartResponse.data;
      const existingProduct = existingCart.products.find(p => p.productId === product._id);
      
      if (existingProduct) {
        // Increase quantity
        existingProduct.quantity += 1;
      } else {
        // Add new product
        existingCart.products.push({
          productId: product._id,
          quantity: 1
        });
      }

      // Recalculate total amount (you'll need to fetch product prices or store them)
      existingCart.totalAmount = (existingCart.totalAmount || 0) + product.price;

      const updateResponse = await cartAPI.updateCart(existingCart._id, existingCart);
      console.log('Cart updated:', updateResponse.data);
      alert('Product added to cart!');
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(`Failed to add product to cart: ${error.response?.data?.message || error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 font-medium">Loading amazing snippets...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl">
          <div className="mb-4 flex justify-center">
            <img width="64" height="64" src="https://img.icons8.com/dotty/80/error--v1.png" alt="error"/>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchProducts}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-cyan-50 rounded-3xl shadow-xl border border-indigo-100/50 mb-8">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-cyan-500/5"></div>
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
          
          <div className="relative px-8 py-16 text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-semibold text-indigo-700 bg-indigo-100 rounded-full shadow-sm">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse"></span>
              Premium Code Marketplace
            </div>
            
            {/* Main title with gradient */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                DevSnippet
              </span>
              <br />
              <span className="text-gray-800">Marketplace</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover premium code snippets, components, and templates crafted by developers, for developers. 
              <span className="text-indigo-600 font-semibold"> Save hours of coding time!</span>
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{products.length}+</div>
                <div className="text-sm text-gray-500">Code Snippets</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">50+</div>
                <div className="text-sm text-gray-500">Languages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">10k+</div>
                <div className="text-sm text-gray-500">Developers</div>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => document.querySelector('.grid')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                Browse Snippets
              </button>
              <button className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-indigo-300 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200">
                Start Selling
              </button>
            </div>
          </div>
        </header>
      </div>
      
      {/* Marquee Section - Only show if products exist */}
      {products.length > 0 && (
        <MarqueeSection products={products} onAddToCart={addToCart} onPreview={openPreviewModal} />
      )}
      
      {/* Products Grid Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {products.length > 0 ? (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">All Code Snippets</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Browse our complete collection of premium code snippets, components, and templates</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 group">
                  {/* Code Preview Section */}
                  <div className="aspect-video bg-gray-900 p-4 overflow-hidden relative">
                    {product.codeContent ? (
                      <div className="relative h-full">
                        {/* Mac-style header */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                          <div className="ml-2 text-gray-400 text-xs font-mono">
                            {product.language || 'javascript'}
                          </div>
                        </div>
                        {/* Code preview */}
                        <pre className="text-green-400 text-xs font-mono leading-relaxed overflow-hidden">
                          <code>
                            {product.codeContent.split('\n').slice(0, 6).join('\n')}
                            {product.codeContent.split('\n').length > 6 && '\n...'}
                          </code>
                        </pre>
                        {/* Gradient fade overlay */}
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-900 to-transparent"></div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-center">
                        <div>
                          <div className="mb-2 flex justify-center">
                            <img width="32" height="32" src="https://img.icons8.com/ios-glyphs/30/workstation.png" alt="workstation" className="filter invert"/>
                          </div>
                          <span className="text-sm text-gray-400 font-mono">{product.language || 'javascript'}</span>
                          <p className="text-xs text-gray-500 mt-1">Code preview unavailable</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{product.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-emerald-600">${product.price}</span>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{product.purchaseCount || 0} downloads</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-all duration-200 border border-slate-300 hover:border-slate-400"
                        onClick={() => openPreviewModal(product)}
                      >
                        Preview
                      </button>
                      <button 
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="mb-6 flex justify-center">
              <img width="80" height="80" src="https://img.icons8.com/pastel-glyph/128/box--v2.png" alt="box"/>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No products available yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">We're working hard to bring you amazing code snippets. Check back soon!</p>
            <button 
              onClick={fetchProducts}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        )}
      </div>
      
      {/* Snippet Preview Modal */}
      <SnippetPreviewModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closePreviewModal}
      />
    </div>
  );
};

export default Home;