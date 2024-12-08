import axios from 'axios';

// Set global defaults for Axios
axios.defaults.headers.common['Content-Type'] = 'application/json';

// CommonAPI function
const commonAPI = async (method, url, body = null, token = null) => {
  try {
    // Prepare headers
    const headers = {
      ...axios.defaults.headers.common,
      ...(token ? { Authorization: `Bearer ${token}` } : {}), // Add token if provided
    };

    // Prepare request options
    const options = {
      method,       // HTTP method (GET, POST, PUT, DELETE, etc.)
      url,          // API endpoint
      headers,      // Request headers
      ...(body ? { data: body } : {}), // Include body for non-GET methods
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
