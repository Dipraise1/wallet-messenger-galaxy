
import React from 'react';
import { Navbar } from './Navbar';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-darkBg text-white">
      {!isHomePage && <Navbar />}
      <main className={`flex-1 ${!isHomePage ? 'pt-16' : ''}`}>
        <div className={`${isHomePage ? '' : 'page-container'} overflow-hidden`}>
          {children}
        </div>
      </main>
    </div>
  );
};
