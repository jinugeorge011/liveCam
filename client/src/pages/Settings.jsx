import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Settings = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    notifications: true,
    darkMode: false,
    themeColor: '#00b894',
    fontSize: 'medium',
    language: 'English',
    accessibility: {
      highContrast: false,
      textToSpeech: false
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log('Settings saved:', formData);
    // Integrate with API or backend for saving settings
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white text-black dark:bg-purple-950 dark:text-white">
        <h2 className="text-3xl text-center font-bold pt-10 mb-8">Settings</h2>
        <div className="max-w-3xl mx-auto space-y-10">
          {/* Account Information */}
          <section>
            <h3 className="text-xl font-semibold mb-4">Account Information</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label htmlFor="name" className="block font-medium mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-black rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block font-medium mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-black rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block font-medium mb-2">New Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-black rounded-md"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block font-medium mb-2">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-black rounded-md"
                />
              </div>
            </form>
          </section>

          {/* Privacy Settings */}
          <section>
            <h3 className="text-xl font-semibold mb-4">Privacy Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showProfile"
                  name="showProfile"
                  checked={formData.showProfile}
                  onChange={handleChange}
                  className="mr-3"
                />
                <label htmlFor="showProfile" className="font-medium">Show Profile to Public</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="twoFactorAuth"
                  name="twoFactorAuth"
                  checked={formData.twoFactorAuth}
                  onChange={handleChange}
                  className="mr-3"
                />
                <label htmlFor="twoFactorAuth" className="font-medium">Enable Two-Factor Authentication</label>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section>
            <h3 className="text-xl font-semibold mb-4">Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notifications"
                  name="notifications"
                  checked={formData.notifications}
                  onChange={handleChange}
                  className="mr-3"
                />
                <label htmlFor="notifications" className="font-medium">Enable Notifications</label>
              </div>
            </div>
          </section>

          {/* Appearance Settings */}
          <section>
            <h3 className="text-xl font-semibold mb-4">Appearance</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="darkMode"
                  name="darkMode"
                  checked={formData.darkMode}
                  onChange={handleChange}
                  className="mr-3"
                />
                <label htmlFor="darkMode" className="font-medium">Enable Dark Mode</label>
              </div>
              <div className="mb-4">
                <label htmlFor="themeColor" className="block font-medium mb-2">Theme Color</label>
                <input
                  type="color"
                  id="themeColor"
                  name="themeColor"
                  value={formData.themeColor}
                  onChange={handleChange}
                  className="w-12 h-12 p-0 border-none"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="fontSize" className="block font-medium mb-2">Font Size</label>
                <select
                  id="fontSize"
                  name="fontSize"
                  value={formData.fontSize}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-black rounded-md"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>
          </section>

          {/* Accessibility Settings */}
          <section>
            <h3 className="text-xl font-semibold mb-4">Accessibility</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="highContrast"
                  name="highContrast"
                  checked={formData.accessibility.highContrast}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      accessibility: {
                        ...prevData.accessibility,
                        highContrast: e.target.checked
                      }
                    }))
                  }
                  className="mr-3"
                />
                <label htmlFor="highContrast" className="font-medium">Enable High Contrast</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="textToSpeech"
                  name="textToSpeech"
                  checked={formData.accessibility.textToSpeech}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      accessibility: {
                        ...prevData.accessibility,
                        textToSpeech: e.target.checked
                      }
                    }))
                  }
                  className="mr-3"
                />
                <label htmlFor="textToSpeech" className="font-medium">Enable Text-to-Speech</label>
              </div>
            </div>
          </section>

          {/* Language */}
          <section>
            <h3 className="text-xl font-semibold mb-4">Language</h3>
            <div className="mb-4">
              <label htmlFor="language" className="block font-medium mb-2">Select Language</label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full px-4 py-2 text-black rounded-md"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                {/* Additional languages */}
              </select>
            </div>
          </section>

          {/* Save Button */}
          <div className="text-center">
            <button
              onClick={handleSave}
              className="px-6 py-2 mb-5 bg-teal-500 text-white font-bold rounded-md hover:bg-teal-400 transition duration-200"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Settings;
