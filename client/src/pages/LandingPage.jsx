import React from 'react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { ToastContainer } from 'react-toastify';
import vdo from '../assets/vdo.mp4'
import GradientButton from '../components/Button/GradientButton';

const LandingPage = () => {
  // Check if the user is logged in by checking the token in sessionStorage
  const isLoggedIn = !!sessionStorage.getItem('token');

  return (
    <>
      <Header users={isLoggedIn ? true : false} />
      <ToastContainer />
      
      {/* Background Video */}
      <div className="relative min-h-screen">
        <video 
          src={vdo} 
          autoPlay 
          loop 
          muted
          className="absolute top-0 left-0 w-full h-full bg-black object-cover z-[-1]" 
        />
        
        <div className="min-h-screen text-white flex flex-col items-center">
          {/* Hero Section */}
          <section className="text-center py-16 px-4 relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to ChatWave</h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Connect with anyone, anywhere, in real-time with high-quality video chat.
            </p>
            <Link to={isLoggedIn ? "/chat" : "/login"}>
              <GradientButton/>
            </Link>
          </section>

          {/* Features Section */}
          <section className="mt-6 grid grid-cols-1 md:grid-cols-3  gap-8 px-4 md:px-20 relative z-10">
            <FeatureCard
              icon="💬"
              title="Real-Time Messaging"
              description="Enjoy fast, secure messaging during live video chats to enhance your communication experience."
            />
            <FeatureCard
              icon="🔒"
              title="End-to-End Encryption"
              description="Your privacy matters. Every call and message is protected with advanced encryption technology."
            />
            <FeatureCard
              icon="📱"
              title="Multi-Device Support"
              description="Connect seamlessly from your phone, tablet, or desktop for an uninterrupted experience."
            />
          </section>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
};

// Feature Card Component
function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-gray-200 dark:bg-gray-800 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition duration-300">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-700 dark:text-gray-300">{description}</p>
    </div>
  );
}

export default LandingPage;
