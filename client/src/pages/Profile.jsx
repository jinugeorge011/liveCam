import React, { useEffect, useState } from 'react';
import { getUserDetailsAPI, updateUserDetailsAPI } from '../services/allAPIs';
import { useAuth } from '../context/AuthContext'; // Assuming you have an Auth Context for JWT token

const Profile = () => {
  const { token, user, setUser } = useAuth();  // Example using Context for token and user
  const [formData, setFormData] = useState({ username: '', email: '', bio: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch user details when the component mounts
  useEffect(() => {
    if (token) {
      const fetchUserDetails = async () => {
        try {
          const userDetails = await getUserDetailsAPI(token);
          setFormData({ 
            username: userDetails.username, 
            email: userDetails.email,
            bio: userDetails.bio || 'No bio provided.'
          });
        } catch (error) {
          setMessage('Error fetching user details');
        }
      };
      fetchUserDetails();
    }
  }, [token]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const updatedUser = await updateUserDetailsAPI(formData, token);
      setUser(updatedUser);  // Update the user state after successful update
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-2xl font-semibold text-gray-800">My Profile</h2>
        </div>

        {/* Error or Success message */}
        {message && (
          <p className={`text-center ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
            {message}
          </p>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
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
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
