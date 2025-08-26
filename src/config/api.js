// API Configuration
// For development, use localhost. For production (Hostinger), update to your domain

const isDevelopment = import.meta.env.DEV;

// Update this for production deployment
export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:8081/api'  // Local Python/PHP server
  : '/api';  // Production - same domain

export const API_ENDPOINTS = {
  // Public endpoints
  inquiries: `${API_BASE_URL}/inquiries.php`,
  
  // Admin endpoints
  adminLogin: `${API_BASE_URL}/admin/login.php`,
  adminInquiries: `${API_BASE_URL}/admin/inquiries`,
  
  // Product endpoints (if needed)
  products: `${API_BASE_URL}/products`,
  productsFeatured: `${API_BASE_URL}/products/featured`,
  productDetail: (id) => `${API_BASE_URL}/products/${id}`,
  
  // Service endpoints (if needed)
  services: `${API_BASE_URL}/services`,
  
  // Upload endpoint
  uploadImage: `${API_BASE_URL}/upload.php`
};

// Helper function to get headers with auth token
export const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};