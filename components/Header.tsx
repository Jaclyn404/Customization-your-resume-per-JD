
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Elevate<span className="text-blue-600">CV</span></span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">How it works</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Resources</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Enterprise</a>
          </nav>
          <div className="flex items-center">
             <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 uppercase">AI Powered</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
