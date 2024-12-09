import React, { useState } from "react";
import styled from "styled-components";
import { registerAPI, loginAPI } from "../services/allAPIs";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Auth({ register }) {
  const [details, setDetails] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false); // For loading state
  const [showPassword, setShowPassword] = useState(false); // For toggling password visibility

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const { username, email, password } = details;

    if (!username || !email || !password) {
      toast.error("Please fill in all details.");
      return;
    }

    try {
      setLoading(true);
      const result = await registerAPI(details);
      if (result.success) {
        toast.success("User registered successfully!", {
          position: "top-right",
          autoClose: 2000,
          theme: "dark",
        });
        setDetails({ username: "", email: "", password: "" }); // Reset form
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (response) {
      toast.error(
        response.message || "An error occurred during registration.",
        {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
  
    const { email, password } = details;
  
    // Validate input
    if (!email || !password) {
      toast.error("Please fill in all details.");
      return;
    }
  
    try {
      setLoading(true); // Indicate loading state
  
      // Call the login API
      const result = await loginAPI(details);
  
      // Check if the response is successful
      if (result.status >= 200 && result.status < 300) {
        const { token, user } = result.data;
        const userRole = user?.role; // Extract user role from API response
  
        // Show success toast notification
        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 2000,
          theme: "dark",
        });
  
        // Save user details to sessionStorage
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("username", user?.username);
        sessionStorage.setItem("role", userRole);
  
        // Navigate based on user role
        navigate(userRole === "admin" ? "/admindashboard" : "/");
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (error) {
      // Extract error message or use a default
      const errorMessage =
        error.response?.data?.message || "An error occurred during login.";
  
      // Show error toast notification
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
    } finally {
      setLoading(false); // Reset loading state
    }
  };  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  return (
    <>

      <ToastContainer />
      <div className="bg-blue-950 h-screen flex items-center justify-center">
        <StyledWrapper>
          <div className="form-container">
            <p className="title">{register ? "Sign Up" : "Login"}</p>
            {register && (
              <div className="input-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Enter your username"
                  onChange={handleInputChange}
                  value={details.username}
                  required
                />
              </div>
            )}
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                onChange={handleInputChange}
                value={details.email}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  onChange={handleInputChange}
                  value={details.password}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="toggle-password"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            {register ? (
              <div>
                <button
                  onClick={handleRegister}
                  className="sign"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Sign Up"}
                </button>
                <p>
                  Already registered?{" "}
                  <Link className="p1" to="/login">
                    Click to Login
                  </Link>
                </p>
              </div>
            ) : (
              <div>
                <button
                  onClick={handleLogin}
                  className="sign"
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
                <p>
                  New here?{" "}
                  <Link className="p1" to="/register">
                    Click to Register
                  </Link>
                </p>
              </div>
            )}
          </div>
        </StyledWrapper>
      </div>
    </>
  );
}

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;

  .form-container {
    width: 350px;
    border-radius: 0.75rem;
    background-color: #111827;
    padding: 2rem;
    color: #f3f4f6;
  }
  p {
    margin-top: 10px;
  }
  .p1:hover {
    color: #4cc9fe;
  }
  .title {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }

  .input-group {
    margin-bottom: 1.25rem;
  }

  .input-group label {
    display: block;
    color: #9ca3af;
    margin-bottom: 4px;
  }

  .input-group input {
    width: 100%;
    border-radius: 0.375rem;
    border: 1px solid #374151;
    background-color: #1f2937;
    padding: 0.75rem 1rem;
    color: #f3f4f6;
  }

  .input-group input:focus {
    border-color: #a78bfa;
    outline: none;
  }

  .password-wrapper {
    display: flex;
    align-items: center;
  }

  .toggle-password {
    margin-left: 8px;
    color: #9ca3af;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .sign {
    width: 100%;
    background-color: #a78bfa;
    padding: 0.75rem;
    text-align: center;
    color: #111827;
    border: none;
    border-radius: 0.375rem;
    font-weight: 600;
    cursor: pointer;
  }

  .sign:hover {
    background-color: #6d28d9;
  }
`;

export default Auth;
