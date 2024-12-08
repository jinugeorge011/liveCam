// src/components/Contact.jsx

import React, { useState } from 'react';
import imgc from '../Images/ContactUs.png';
import Header from '../components/Header';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const isLoggedIn = !!sessionStorage.getItem('token');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);

    setFormData({
      name: '',
      email: '',
      message: ''
    });
  };

  return (
    <>
      <Header users={isLoggedIn ? true : false} />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 text-white p-6 flex flex-col items-center">
        <h2 className="text-4xl font-bold text-center mt-5 mb-10 text-teal-400">Get in Touch with Us</h2>
        <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl w-full mt-5 gap-12">
          <form
            onSubmit={handleSubmit}
            className="w-full md:w-1/2 bg-opacity-60 p-8 rounded-lg  transform transition duration-300 hover:scale-105"
          >
            <div className="mb-6">
              <label className="block text-lg font-medium mb-2 text-teal-400" htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-lg font-medium mb-2 text-teal-400" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-lg font-medium mb-2 text-teal-400" htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                className="w-full px-4 py-3 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-950 ml-2 mr-2 text-blue-400 border border-blue-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
                  <span className="bg-blue-400 shadow-blue-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
              Submit
            </button>
          </form>
          <div className="hidden md:block">
            <img src={imgc} alt="Contact Us" className="w-[80vh] rounded-lg transition duration-300 transform hover:scale-105" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
