import axios from 'axios';

// Base API configuration
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api', // Your backend server URL
});

// Add request interceptor to include token in headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.token = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const authAPI = {
  register: (userData) => API.post('/auth/register', userData),
  login: (credentials) => API.post('/auth/login', credentials),
};

// User API calls
export const userAPI = {
  getProfile: (userId) => API.get(`/user/${userId}`),
  updateProfile: (userId, userData) => API.put(`/user/${userId}`, userData),
  deleteProfile: (userId) => API.delete(`/user/${userId}`),
  getAllUsers: () => API.get('/user'),
  getUserStats: () => API.get('/user/stats'),
};

// Product API calls
export const productAPI = {
  getAllProducts: () => API.get('/products'),
  getProduct: (productId) => API.get(`/products/${productId}`),
  createProduct: (productData) => API.post('/products', productData),
  updateProduct: (productId, productData) => API.put(`/products/${productId}`, productData),
  deleteProduct: (productId) => API.delete(`/products/${productId}`),
};

// Cart API calls
export const cartAPI = {
  getCart: (userId) => API.get(`/carts/${userId}`),
  createCart: (cartData) => API.post('/carts', cartData),
  updateCart: (cartId, cartData) => API.put(`/carts/${cartId}`, cartData),
  deleteCart: (cartId) => API.delete(`/carts/${cartId}`),
};

// Order API calls
export const orderAPI = {
  getAllOrders: () => API.get('/orders'),
  getUserOrders: (userId) => API.get(`/orders/${userId}`),
  createOrder: (orderData) => API.post('/orders', orderData),
  updateOrder: (orderId, orderData) => API.put(`/orders/${orderId}`, orderData),
  deleteOrder: (orderId) => API.delete(`/orders/${orderId}`),
  getOrderStats: () => API.get('/orders/stats'),
};

export default API;