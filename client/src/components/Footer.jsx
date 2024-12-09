// src/components/Footer.jsx

import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import pwd from '../assets/react.svg'
import logotr from '../Images/logotr.png'

const Footer = () => {
  return (
    <footer className="dark:bg-purple-950 dark:text-white border-2 border-dashed border-black dark:border-white bg-white text-gray-700 w-full py-10">
      <div className="container mx-auto px-6 md:px-10 lg:px-10">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
          {/* Company Info */}
          <div className="mb-6 md:mb-0 md:w-1/3">
            <h3 className="text-2xl font-semibold text-gray-700 dark:text-teal-400 mb-4">Our Company</h3>
            <p className="dark:text-gray-200 text-gray-500">Leading provider of innovative solutions. Reach out for collaborations, support, or to learn more about what we offer.</p>
          </div>

          {/* Quick Links */}
          <div className="mb-6 md:mb-0 md:w-1/3 text-center md:text-left">
            <h3 className="text-2xl font-semibold text-gray-700 dark:text-teal-400 mb-4">Quick Links</h3>
            <ul className="dark:text-gray-200 text-gray-500 space-y-2">
              <li><a href="/" className="hover:text-teal-400 transition duration-200">Home</a></li>
              <li><a href="/about" className="hover:text-teal-400 transition duration-200">About Us</a></li>
              <li><a href="/services" className="hover:text-teal-400 transition duration-200">Services</a></li>
              <li><a href="/contact" className="hover:text-teal-400 transition duration-200">Contact Us</a></li>
            </ul>
          </div>

        {/* powered By */}
        <div className="mb-6 md:mb-0 md:w-1/3 text">
        <img src={pwd} width={"90px"} alt="" />
        <h3>Powered By</h3>
        <h1 className='pwd'>Nidhin Vinod Pvt.</h1>
        </div>

          {/* Contact & Socials */}
          <div className="md:w-1/3 text-center md:text-right">
            <h3 className="text-2xl font-semibold text-gray-700 dark:text-teal-400 mb-4">Stay Connected</h3>
            <p className="dark:text-gray-200 text-gray-500 mb-4">contact@ourcompany.com</p>
            <div className="flex justify-center md:justify-end space-x-4">
              <a href="https://facebook.com" className="text-gray-200 hover:text-blue-500 transition duration-200">
                <FaFacebookF size={20} />
              </a>
              <a href="https://twitter.com" className="text-gray-200 hover:text-blue-500 transition duration-200">
                <FaTwitter size={20} />
              </a>
              <a href="https://instagram.com" className="text-gray-200 hover:text-purple-500 transition duration-200">
                <FaInstagram size={20} />
              </a>
              <a href="https://linkedin.com" className="text-gray-200 hover:text-blue-600 transition duration-200">
                <FaLinkedinIn size={20} />
              </a>
            </div>
            <img src={logotr} className='mt-3 w-24 h-16' alt="logo" />
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Our Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
