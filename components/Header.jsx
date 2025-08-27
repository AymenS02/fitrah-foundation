import React from 'react';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="bg-background px-6 py-4">
      <div className="max-w-[90%] mx-auto flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center">
          <div className="w-20 h-20 mr-3">
            <Image src="/images/logo.png" alt="Fitrah Foundation Logo" className="w-full h-full object-contain" width={80} height={80} />
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex items-center space-x-8">
          <a href="#home" className="text-primary hover:scale-105 transition-transform font-medium ">
            Home
          </a>
          <a href="#about" className="text-primary hover:scale-105 transition-transform font-medium ">
            About Us
          </a>
          <a href="#articles" className="text-primary hover:scale-105 transition-transform font-medium ">
            Articles
          </a>
          <a href="#courses" className="text-primary hover:scale-105 transition-transform font-medium ">
            Courses
          </a>
          <a href="#contact" className="text-primary hover:scale-105 transition-transform font-medium ">
            Contact Us
          </a>
          <button className="bg-accent text-secondary px-4 py-2 rounded-4xl font-medium border-2 border-secondary hover:scale-105 transition-transform cursor-pointer">
            Sign Up
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;