import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Shield, Settings } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-lg sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-r from-blue-600 to-sky-500 p-2 rounded-lg group-hover:scale-105 transition-transform duration-200">
              <Phone className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900 font-heading">TelecomAudit</h1>
              <p className="text-xs text-gray-600">Économies garanties</p>
            </div>
          </Link>

          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span className="text-xs text-gray-600 hidden sm:block">RGPD Conforme</span>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;