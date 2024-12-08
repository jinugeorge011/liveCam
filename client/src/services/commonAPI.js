import axios from 'axios';

// Set global defaults for Axios
axios.defaults.headers.common['Content-Type'] = 'application/json';

/**
 * CommonAPI function for making HTTP requests
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param {string} url - API endpoint
 * @param {Object|null} body - Request body (optional)
 * @param {string|null} token - Bearer token for authorization (optional)
 * @returns {Promise<Object>} - Standardized response object
 */
const commonAPI = async (method, url, body = null, token = null) => {
  try {
    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}), // Add token if provided
    };

    // Prepare request options
    const options = {
      method: method.toUpperCase(), // Ensure method is uppercase
      url, // API endpoint
      headers, // Request headers
      ...(body && !['GET', 'DELETE'].includes(method.toUpperCase()) ? { data: body } : {}), // Include body for non-GET/DELETE methods
    };

    // Execute the API call
    const response = await axios(options);

    // Return a standardized response
    return {
      success: true,
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error('API Error:', error.response || error.message || error);

    // Prepare error response
    const errorResponse = error.response
      ? {
          status: error.response.status,
          message: error.response.data?.message || 'An error occurred',
          data: error.response.data,
        }
      : {
          status: 500,
          message: 'Network or server error',
        };

    return {
      success: false,
      ...errorResponse,
    };
  }
};

export default commonAPI;
