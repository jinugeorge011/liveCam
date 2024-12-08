// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserDetailsAPI } from "../services/allAPIs";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetchUserDetails();
    }
  }, [token]);

  const fetchUserDetails = async () => {
    try {
      const response = await getUserDetailsAPI(token);
      setUser({
        username: response.data.username,
        role: response.data.role, // Adjust this to match your API response
      });
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      logout(); // Clear invalid token and user
    }
  };

  const login = (authToken) => {
    setToken(authToken);
    localStorage.setItem("token", authToken);
    fetchUserDetails(); // Fetch user details after login
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    navigate("/login", { replace: true }); // Avoid back-navigation
  };

  const isAuthenticated = () => {
    return !!token && !!user; // Ensure both token and user are valid
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
