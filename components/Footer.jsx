import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card text-muted-foreground py-8 mt-20">
      <div className="w-[80%] xl:w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          
          {/* About */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-2">Fitrah Foundation</h3>
            <p className="text-sm">
              Authentic Islamic education bridging traditional scholarship with modern understanding.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-2">Quick Links</h4>
            <div className="space-y-1">
              <a href="/courses" className="block text-sm hover:text-primary transition-colors">Courses</a>
              <a href="/" className="block text-sm hover:text-primary transition-colors">Instructors</a>
              <a href="/about" className="block text-sm hover:text-primary transition-colors">About</a>
              <a href="/contact" className="block text-sm hover:text-primary transition-colors">Contact</a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-2">Contact Us</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>info@fitrahfoundation.org</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Toronto, ON</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border pt-4 text-center">
          <p className="text-sm">
            © 2024 Fitrah Foundation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
