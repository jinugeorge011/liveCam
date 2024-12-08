import { commonAPI } from './commonAPI';
import { serverURL } from './serverUrl';

// Register API
export const registerAPI = async (reqBody) => {
  try {
    const response = await commonAPI('post', `${serverURL}/api/register`, reqBody);

    if (!response.success) {
      throw new Error(response.message || 'Registration failed.');
    }

    return response;
  } catch (error) {
    console.error('Registration Error:', error.response?.data || error.message || error);
    throw error; // Rethrow for frontend to handle
  }
};


// Login API
export const loginAPI = async (details) => {
  try {
    return await commonAPI('post', `${serverURL}/api/login`, details, '');
  } catch (error) {
    console.error('Login API Error:', error);
    throw error;
  }
};

// getUserDetailsAPI
export const getUserDetailsAPI = async (token) => {
  try {
    // Making a GET request to the '/api/user' endpoint with the provided token
    const response = await commonAPI('get', `${serverURL}/api/user`, null,token);
    return response; // Return the response so the calling function can handle it
  } catch (error) {
    // Handle any errors that occur during the request
    console.error('Error getting user details:', error);
    throw error; // Rethrow the error to allow the calling function to handle it
  }
};


//updateUserDetailsAPI
export const updateUserDetailsAPI = async (token, reqBody) => {
  try {
    // Making a PUT request to the '/api/user' endpoint with the provided token and request body
    const response = await commonAPI('put', `${serverURL}/api/user`, reqBody,
      'Bearer');
      return response; // Return the response so the calling function can handle it
      } catch (error) {
        // Handle any errors that occur during the request
        console.error('Error updating user details:', error);
        throw error; // Rethrow the error to allow the calling function to handle it
        }
        };

// Upload File API
export const uploadFileAPI = async (file) => {
  try {
    // Create a FormData object and append the file
    const formData = new FormData();
    formData.append('file', file);

    // Make the fetch request to upload the file
    const response = await fetch(`${serverURL}/upload`, {
      method: 'POST',
      body: formData,
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`File upload failed: ${response.statusText}`);
    }

    // Parse and return the JSON response
    const result = await response.json();
    console.log('File uploaded successfully:', result);
    return result; // Return the result for further use
  } catch (error) {
    console.error('File upload error:', error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};


