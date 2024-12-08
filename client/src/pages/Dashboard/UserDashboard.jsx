// src/pages/Dashboard.jsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const Dashboard = () => {
  const isLoggedIn = !!sessionStorage.getItem('token');
  return (
    <>
      <Header users={isLoggedIn ? true : false} />
      <div className="flex h-screen bg-gray-100 text-gray-900 dark:bg-purple-900 dark:text-white">
        
        {/* Sidebar */}
        <aside className="w-1/4 bg-gray-500 text-white bg-gradient-to-b dark:from-purple-900 dark:to-black p-5 ">
          <h2 className="text-2xl font-bold text-white mb-8">Dashboard</h2>
          <nav className="flex flex-col space-y-4">
            <Link to="/profile" className="text-lg hover:text-teal-400 transition">
              Profile
            </Link>
            <Link to="/chat" className="text-lg hover:text-teal-400 transition">
              Messages
            </Link>
            <Link to="/settings" className="text-lg hover:text-teal-400 transition">
              Settings
            </Link>

          </nav>
        </aside>
        

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet /> {/* This will render nested routes */}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
