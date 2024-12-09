import axios from 'axios';

// Set default headers for Axios globally
axios.defaults.headers.common['Content-Type'] = 'application/json';

export const commonAPI = async (httpMethod, url, reqBody = null, token = null) => {
  try {
    const headers = {
      ...axios.defaults.headers.common,
      ...(token ? { Authorization: `Bearer ${token}` } : {}), // Add token if provided
    };

    // Axios request configuration
    const response = await axios({
      method: httpMethod,
      url,
      data: ['post', 'put', 'patch', 'delete'].includes(httpMethod.toLowerCase()) ? reqBody : null,
      headers,
    });

    // Return a standardized success response
    return {
      success: true,
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error('API Error:', error.response || error.message || error);

    // Standardized error response
    const errorResponse = error.response
      ? {
          status: error.response.status,
          message: error.response.data?.message || 'An error occurred',
          data: error.response.data || {},
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
