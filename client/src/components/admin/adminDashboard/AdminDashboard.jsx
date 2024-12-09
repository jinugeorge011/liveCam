import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import axios from 'axios';
import Header from '../../Header';
import Footer from '../../Footer';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('/api/admin/analytics');
      setAnalytics(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error.message);
    }
  };

  return (
    <>
      <Header />
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        
        {/* Sidebar */}
        <aside className="w-1/4 bg-gray-500 text-white dark:bg-gray-700 p-5">
          <h2 className="text-2xl font-bold text-white mb-8">Admin Dashboard</h2>
          <nav className="flex flex-col space-y-4">
            <Link to="/overview" className="text-lg hover:text-teal-400 transition">
              Overview
            </Link>
            <Link to="/users" className="text-lg hover:text-teal-400 transition">
              Users
            </Link>
            <Link to="/meetings" className="text-lg hover:text-teal-400 transition">
              Meetings
            </Link>
            <Link to="/settings" className="text-lg hover:text-teal-400 transition">
              Settings
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-4">Welcome to the Admin Dashboard</h1>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold">Quick Stats</h2>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
                <h3 className="text-lg font-medium">Total Users</h3>
                <p className="text-2xl font-bold">{analytics.totalUsers || 0}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
                <h3 className="text-lg font-medium">Total Meetings</h3>
                <p className="text-2xl font-bold">{analytics.totalMeetings || 0}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
                <h3 className="text-lg font-medium">Active Users</h3>
                <p className="text-2xl font-bold">{analytics.activeUsers || 0}</p>
              </div>
            </div>
          </div>
          <Outlet /> {/* Nested routes content will render here */}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboard;
