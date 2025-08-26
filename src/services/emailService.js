// Email Service Configuration
// This file contains the configuration for sending emails
// In production, replace with actual API endpoints

const EMAIL_CONFIG = {
  // Replace with your actual backend API endpoint
  API_ENDPOINT: import.meta.env.VITE_API_URL || 'https://your-backend-api.com/api',
  
  // Email recipients
  RECIPIENTS: {
    SALES: 'export@indianharvest.com',
    SUPPORT: 'support@indianharvest.com',
    ADMIN: 'admin@indianharvest.com'
  },

  // Email templates
  TEMPLATES: {
    PRODUCT_INQUIRY: 'product-inquiry',
    GENERAL_INQUIRY: 'general-inquiry',
    CUSTOM_PRODUCT_REQUEST: 'custom-product-request'
  }
};

/**
 * Send product inquiry email
 * @param {Object} data - Inquiry data
 * @returns {Promise} - API response
 */
export const sendProductInquiry = async (data) => {
  try {
    // In production, this would be an actual API call
    const response = await fetch(`${EMAIL_CONFIG.API_ENDPOINT}/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        template: EMAIL_CONFIG.TEMPLATES.PRODUCT_INQUIRY,
        to: EMAIL_CONFIG.RECIPIENTS.SALES,
        data: {
          ...data,
          timestamp: new Date().toISOString(),
          source: 'Website Inquiry Form'
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send inquiry');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending inquiry:', error);
    
    // For development, log the data that would be sent
    console.log('Development Mode - Email Data:', {
      to: EMAIL_CONFIG.RECIPIENTS.SALES,
      subject: `Product Inquiry: ${data.productName || 'General'}`,
      data: data
    });

    // In development, return success
    if (import.meta.env.DEV) {
      return { success: true, message: 'Inquiry logged (development mode)' };
    }
    
    throw error;
  }
};

/**
 * Send general inquiry email
 * @param {Object} data - Inquiry data
 * @returns {Promise} - API response
 */
export const sendGeneralInquiry = async (data) => {
  try {
    const response = await fetch(`${EMAIL_CONFIG.API_ENDPOINT}/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        template: EMAIL_CONFIG.TEMPLATES.GENERAL_INQUIRY,
        to: EMAIL_CONFIG.RECIPIENTS.SUPPORT,
        data: {
          ...data,
          timestamp: new Date().toISOString(),
          source: 'Website Contact Form'
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send inquiry');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending inquiry:', error);
    
    // For development, log the data
    console.log('Development Mode - Email Data:', {
      to: EMAIL_CONFIG.RECIPIENTS.SUPPORT,
      subject: 'General Inquiry',
      data: data
    });

    // In development, return success
    if (import.meta.env.DEV) {
      return { success: true, message: 'Inquiry logged (development mode)' };
    }
    
    throw error;
  }
};

/**
 * Save inquiry to database (for Hostinger or any other database)
 * @param {Object} data - Inquiry data
 * @returns {Promise} - Database response
 */
export const saveInquiryToDatabase = async (data) => {
  try {
    // This would connect to your Hostinger MySQL database or any other database
    const response = await fetch(`${EMAIL_CONFIG.API_ENDPOINT}/inquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        createdAt: new Date().toISOString(),
        status: 'pending',
        source: 'website'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save inquiry');
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving to database:', error);
    
    // For development, log the data
    console.log('Development Mode - Database Save:', data);

    // In development, return success
    if (process.env.NODE_ENV === 'development') {
      return { success: true, id: Date.now(), message: 'Inquiry saved (development mode)' };
    }
    
    throw error;
  }
};

/**
 * Upload product image
 * @param {File} file - Image file
 * @param {string} productId - Product ID
 * @returns {Promise} - Upload response with image URL
 */
export const uploadProductImage = async (file, productId) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('productId', productId);

    const response = await fetch(`${EMAIL_CONFIG.API_ENDPOINT}/upload-image`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading image:', error);
    
    // For development, return mock URL
    if (import.meta.env.DEV) {
      return { 
        success: true, 
        imageUrl: URL.createObjectURL(file),
        message: 'Image uploaded (development mode)' 
      };
    }
    
    throw error;
  }
};

// Backend API Setup Instructions (for Hostinger or other hosting)
/*
To set up the backend API:

1. Create a Node.js/Express backend or PHP backend
2. Set up MySQL database on Hostinger with tables:
   - inquiries (id, name, email, phone, company, product, message, created_at, status)
   - products (id, name, category, description, images, specifications, etc.)
   
3. Create API endpoints:
   POST /api/send-email - Send email using SMTP
   POST /api/inquiries - Save inquiry to database
   POST /api/upload-image - Upload product images
   GET /api/inquiries - Retrieve inquiries (admin panel)

4. Configure SMTP for sending emails:
   - Use Hostinger's SMTP settings or third-party service (SendGrid, Mailgun)
   
5. Set environment variables:
   - REACT_APP_API_URL=https://your-api-domain.com/api
   - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
   - DB_HOST, DB_NAME, DB_USER, DB_PASS

6. Deploy backend to Hostinger or preferred hosting service
*/

export default {
  sendProductInquiry,
  sendGeneralInquiry,
  saveInquiryToDatabase,
  uploadProductImage,
  EMAIL_CONFIG
};