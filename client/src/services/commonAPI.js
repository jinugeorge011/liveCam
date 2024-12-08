import axios from 'axios';

// Set default headers for Axios globally
axios.defaults.headers.common['Content-Type'] = 'application/json';

export const commonAPI = async (httpMethod, url, reqBody = null, token = null) => {
  try {
    const headers = {
      ...axios.defaults.headers.common,
      ...(token ? { Authorization: `Bearer ${token}` } : {}), // Add token if provided
    };

    const response = await axios({
      method: httpMethod,
      url,
      data: httpMethod !== 'get' ? reqBody : null, // Include body only for non-GET requests
      headers,
    });

    return {
      success: true,
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    // Log detailed error information
    console.error('API Error:', error.response || error.message || error);

    const errorResponse = error.response
      ? {
          status: error.response.status,
          message: error.response.data.message || 'An error occurred',
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
