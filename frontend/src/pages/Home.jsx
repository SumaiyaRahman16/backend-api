import React, { useState, useEffect } from 'react';
import { productAPI, cartAPI } from '../api';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

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

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to Our E-commerce Store</h1>
        <p>Discover amazing products at great prices!</p>
      </header>
      
      <div className="products-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="product-card">
              <img 
                src={product.img || '/placeholder-product.jpg'} 
                alt={product.title}
                className="product-image"
              />
              <div className="product-info">
                <h3 className="product-title">{product.title}</h3>
                <p className="product-description">{product.desc}</p>
                <div className="product-price">${product.price}</div>
                <button 
                  className="add-to-cart-btn"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-products">
            <p>No products available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;