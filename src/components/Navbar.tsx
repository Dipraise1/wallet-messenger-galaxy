
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageSquare, BarChart3, Settings, Briefcase } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { name: 'Messages', path: '/messages', icon: <MessageSquare className="w-5 h-5 mr-2" /> },
    { name: 'Transactions', path: '/transactions', icon: <BarChart3 className="w-5 h-5 mr-2" /> },
    { name: 'Services', path: '/services', icon: <Briefcase className="w-5 h-5 mr-2" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5 mr-2" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-darkBg/80 backdrop-blur-md border-b border-white/10">
      <nav className="page-container flex items-center justify-between h-16">
        <Link 
          to="/" 
          className="font-bold text-xl tracking-tight text-glow flex items-center"
        >
          <span className="text-neonBlue">Chain</span>
          <span className="text-white">Chat</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center text-sm font-medium transition-all duration-200 ${
                isActive(item.path)
                  ? 'text-neonBlue text-glow'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <div className="flex items-center">
                {item.icon}
                {item.name}
              </div>
              {isActive(item.path) && (
                <div className="absolute bottom-0 w-full h-0.5 bg-neonBlue"></div>
              )}
            </Link>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-white"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-darkBg2/95 backdrop-blur-lg border-b border-white/10 animate-fade-in">
          <div className="flex flex-col space-y-4 p-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center p-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-darkBg3 text-neonBlue text-glow'
                    : 'text-gray-300 hover:bg-darkBg3/50 hover:text-white'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
