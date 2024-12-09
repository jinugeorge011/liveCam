import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RoleBasedRoute from "./context/RoleBasedRoute.jsx";
import "./index.css";

// Pages
import LandingPage from "./pages/LandingPage.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import Auth from "./pages/Auth.jsx";
import Contact from "./pages/Contact.jsx";
import UserDashboard from "./pages/Dashboard/UserDashboard.jsx";
import AdminDashboard from "./components/admin/adminDashboard/AdminDashboard.jsx";
import Settings from "./pages/Settings.jsx";
import Profile from "./pages/Profile.jsx";
import Payment from "./pages/Payment.jsx";
import Header from "./components/Header.jsx";
import ChatAndVideoSection from "./pages/ChatAndVideoSection.jsx";
import Users from "./components/admin/Users/Users.jsx";

const App = () => {
  const loggedInUser = { name: 'Jinu' };

  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Auth register={true} />} />
        <Route path="/users" element={<Users />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/contacts" element={<Contact />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat" element={<ChatAndVideoSection user={loggedInUser} />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/*" element={<ErrorPage />} />

        {/* User-Specific Routes */}
        <Route
          path="/profile"
          element={
            <RoleBasedRoute requiredRole="user">
              <Profile />
            </RoleBasedRoute>
          }
        />

        {/* Admin-Specific Routes */}
        <Route
          path="/admindashboard"
          element={
            <RoleBasedRoute requiredRole="admin">
              <AdminDashboard />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <RoleBasedRoute requiredRole="admin">
              <Settings />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/admindashboard/users"
          element={
            <RoleBasedRoute requiredRole="admin">
              <Users/>
            </RoleBasedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
};

export default App;
