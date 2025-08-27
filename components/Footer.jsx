import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-accent py-8 mt-20">
      <div className="w-[80%] xl:w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          
          {/* About */}
          <div>
            <h3 className="text-lg font-bold text-secondary mb-2">Fitrah Foundation</h3>
            <p className="text-sm text-accent">
              Authentic Islamic education bridging traditional scholarship with modern understanding.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-secondary mb-2">Quick Links</h4>
            <div className="space-y-1">
              <a href="#" className="block text-sm text-accent hover:text-amber-300 transition-colors">Courses</a>
              <a href="#" className="block text-sm text-accent hover:text-amber-300 transition-colors">Instructors</a>
              <a href="#" className="block text-sm text-accent hover:text-amber-300 transition-colors">About</a>
              <a href="#" className="block text-sm text-accent hover:text-amber-300 transition-colors">Contact</a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-secondary mb-2">Contact Us</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-accent" />
                <span>info@fitrahfoundation.org</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-accent" />
                <span>+1 (234) 567-8900</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-accent" />
                <span>Toronto, ON</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-accent pt-4 text-center">
          <p className="text-accent text-sm">
            © 2024 Fitrah Foundation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;