import React, { useEffect, useState } from 'react';
import { getUserDetailsAPI, updateUserDetailsAPI } from '../services/allAPIs';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Profile = () => {
  const { token, user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || 'No bio provided.',
    profileImage: user?.profileImage || '',
  });
  const [previewImage, setPreviewImage] = useState(user?.profileImage || null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch user details when the component mounts

  useEffect(() => {
    if (token && !user) {
      const fetchUserDetails = async () => {
        try {
          const userDetails = await getUserDetailsAPI(token);
          setUser(userDetails); // Save user to context
          setFormData({
            username: userDetails.username,
            email: userDetails.email,
            bio: userDetails.bio || 'No bio provided.',
            profileImage: userDetails.profileImage || '',
          });
          setPreviewImage(userDetails.profileImage || null);
        } catch (error) {
          setMessage('Error fetching user details');
        }
      };
      fetchUserDetails();
    }
  }, [token, user]);
  

  const isLoggedIn = !!sessionStorage.getItem('token');

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profileImage: file }));
      setPreviewImage(URL.createObjectURL(file)); // Show preview
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
  
    try {
      // Prepare form data for submission
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('bio', formData.bio);
      if (formData.profileImage instanceof File) {
        formDataToSend.append('profileImage', formData.profileImage);
      }
  
      const updatedUser = await updateUserDetailsAPI(formDataToSend, token);
      setUser(updatedUser); // Update the user state after successful update
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Error updating profile');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
    <Header users={isLoggedIn ? true : false} />
    <div className="min-h-screen dark:bg-purple-900 flex flex-col items-center py-10">
      {/* Profile Card */}
      <div className="bg-white border-dashed border-black dark:border-white rounded-lg shadow-lg w-full max-w-3xl p-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-2xl font-semibold text-purple-800">My Profile</h2>
        </div>

        {/* Error or Success message */}
        {message && (
          <p className={`text-center ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
            {message}
          </p>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile Preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-purple-300"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-purple-600">
                  No Image
                </div>
              )}
              <label
                htmlFor="profileImage"
                className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full cursor-pointer"
              >
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                Upload
              </label>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="w-full pr-2">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>
            <div className="w-full pl-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              rows="4"
              placeholder="Tell us something about you..."
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Profile;
