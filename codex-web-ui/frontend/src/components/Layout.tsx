import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const Layout: React.FC = () => {
  const location = useLocation();
  
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Codex Web UI</h1>
            <nav className="hidden md:flex space-x-4">
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-md ${location.pathname === '/' ? 'bg-gray-900' : 'hover:bg-gray-700'}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/files" 
                className={`px-3 py-2 rounded-md ${location.pathname === '/files' ? 'bg-gray-900' : 'hover:bg-gray-700'}`}
              >
                Files
              </Link>
              <Link 
                to="/tasks" 
                className={`px-3 py-2 rounded-md ${location.pathname === '/tasks' ? 'bg-gray-900' : 'hover:bg-gray-700'}`}
              >
                Tasks
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md">
              New Task
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow overflow-hidden">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white p-2 text-center text-sm">
        <p>Codex Web UI &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Layout;