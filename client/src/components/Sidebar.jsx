// src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ role }) => {
  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <nav>
        {role === 'admin' && (
          <>
            <Link to="/admin-dashboard" className="block py-2 px-4 rounded hover:bg-gray-700">Dashboard</Link>
            <Link to="/admin/users" className="block py-2 px-4 rounded hover:bg-gray-700">Users</Link>
            <Link to="/admin/reports" className="block py-2 px-4 rounded hover:bg-gray-700">Reports</Link>
          </>
        )}
        {role === 'user' && (
          <Link to="/user-dashboard" className="block py-2 px-4 rounded hover:bg-gray-700">Dashboard</Link>
        )}
        <Link to="/settings" className="block py-2 px-4 rounded hover:bg-gray-700">Settings</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
