"use client";
import { useState } from 'react';
import { useGlobalContext } from '../redux/store'; // Adjusted the path to import from redux/store.js
import Link from 'next/link';

function Header() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { state, dispatch } = useGlobalContext();
  const { user, isAuthenticated } = state;

  const handleLogout = async () => {
    try {
      // Call the logout API
      const response = await fetch('/api/users/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log(data);
      
      if (data.success) {
        // Clear localStorage to ensure the user is logged out
        console.log("Logging out");
        localStorage.removeItem("user");

        // Dispatch logout action to update global state
        dispatch({ type: 'LOGOUT' });

        // Close the menu and ensure instant re-render
        setMenuOpen(false);
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo and Title */}
        <div className="text-2xl font-semibold">
          <Link href="/" className="hover:text-indigo-200">Notes & To-Do</Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-indigo-200">Home</Link>
          <Link href="/notes" className="hover:text-indigo-200">Notes</Link>
          <Link href="/todo" className="hover:text-indigo-200">To-Dos</Link>
        </nav>

        {/* User Profile/Login */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 hover:text-indigo-200"
              >
                <img
                  src={user?.avatar || '/default-avatar.png'}
                  alt="User Avatar"
                  className="h-8 w-8 rounded-full border-2 border-white"
                />
                <span className="hidden md:inline">{user?.name}</span>
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-indigo-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/signup" className="hover:text-indigo-200">Login</Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!isMenuOpen)}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Links */}
      {isMenuOpen && (
        <div className="md:hidden bg-indigo-700 text-white">
          <Link href="/" className="block px-4 py-2 hover:bg-indigo-800">Home</Link>
          <Link href="/notes" className="block px-4 py-2 hover:bg-indigo-800">Notes</Link>
          <Link href="/todo" className="block px-4 py-2 hover:bg-indigo-800">To-Dos</Link>
        </div>
      )}
    </header>
  );
}

export default Header;
