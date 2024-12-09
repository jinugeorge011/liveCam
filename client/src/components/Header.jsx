import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import DarkModeSwitcher from './DarkModeSwitcher';
import logomain from '../Images/Logo-Main.png'


function Header({ users }) {
  // Check if the user is logged in by checking the token in sessionStorage
  const isLoggedIn = !!sessionStorage.getItem('token');
  const role = sessionStorage.getItem('role'); // Get the role from sessionStorage

  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async()=>{
    try { if(isLoggedIn){
      sessionStorage.clear()
      window.location.reload()
     navigate('/')
    } }catch (error) {
      console.log("error"+error);
    }
      
  }

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center p-4 border-2 border-dashed border-black dark:border-white bg-white shadow-lg text-black dark:bg-purple-950 dark:text-white">
      <div className="text-2xl font-bold">
        <img src={logomain} className='w-36 ms-5' alt="Logo" />
        {/* <h2 className='ms-5'>KILI</h2> */}
      </div>
      
      {/* Nav Links */}
      <ul className={`flex space-x-6 md:flex ${isMenuOpen ? 'block' : 'hidden'} absolute md:static top-14 right-4 bg-gray-800 p-4 rounded-lg md:p-0 md:bg-transparent`}>
        <NavLink
          to="/"
          className={({ isActive }) => `text-black font-medium dark:text-white hover:text-teal-400 ${isActive ? 'border-b-2 border-teal-400' : ''}`}
        >
          Home
        </NavLink>
        <NavLink
          to={isLoggedIn ? "/chat" : "/login"}
          className={({ isActive }) => `text-black font-medium dark:text-white hover:text-teal-400 ${isActive ? 'border-b-2 border-teal-400' : ''}`}
        >
          Chat
        </NavLink>
        <NavLink
          to={isLoggedIn ? "/contacts" : "/login"}
          className={({ isActive }) => `text-black font-medium dark:text-white hover:text-teal-400 ${isActive ? 'border-b-2 border-teal-400' : ''}`}
        >
          Contacts
        </NavLink>
       {users?( <NavLink
          to={role === 'admin' ? '/admindashboard' : '/dashboard'}
          className={({ isActive }) => `text-black font-medium dark:text-white hover:text-teal-400 ${isActive ? 'border-b-2 border-teal-400' : ''}`}
        >
          Dashboard
        </NavLink>):""}

        {/* User Profile Dropdown */}
{users ? (
  <div className="relative">
    <img
      src={isLoggedIn ? users.profileImage :'😊'}
      alt="User Profile"
      className="w-9 h-9 rounded-full cursor-pointer"
      onClick={() => setIsMenuOpen(!isMenuOpen)}
    />
    {isMenuOpen && (
      <div className="absolute right-0 mt-2 w-32 rounded-lg shadow-lg z-10">
        <Link to="/profile">
        <button
        className="bg-purple-800 ml-2 mr-2 text-white border border-blue-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
        >
          Profile
        </button>
        </Link>
         <button
         className="bg-red-700 ml-2 mr-2 text-white border border-blue-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
           onClick={handleLogout}> Logout</button>
      </div>
    )}
  </div>
) : (
  <NavLink
    to="/login"
    className={({ isActive }) => `text-black font-medium dark:text-white hover:text-teal-400 ${isActive ? 'border-b-2 border-teal-400' : ''}`}
  >
    Login
  </NavLink>
)}


        {/* Dark Mode Switcher */}
        <div className="mt-1">
          <DarkModeSwitcher />
        </div>
      </ul>

      {/* Mobile Menu Toggle */}
      <button
        className="text-2xl md:hidden focus:outline-none"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        ☰
      </button>
    </nav>
  );
}

export default Header;
