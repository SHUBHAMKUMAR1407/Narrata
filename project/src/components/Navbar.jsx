// src/components/Navbar.jsx

import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Logo from '../assets/NARRATA__LOGO.png';

function Navbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    navigate('/login');
  };

  const handleProfileClick = () => {
    setProfileOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-teal-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <Link to="/" className="flex items-center">
              <img src={Logo} alt="Narrata Logo" className="h-10 w-auto" />
              <span className="hidden md:block ml-3 text-2xl font-serif font-bold text-premium-text tracking-widest">NARRATA</span>
            </Link>
          </div>

          {/* Centered Navigation Links for Desktop */}
          <div className="hidden sm:flex sm:space-x-12">
            <Link to="/stories" className="text-premium-text hover:text-premium-gold font-serif font-medium tracking-wide transition-colors uppercase text-sm">Stories</Link>
            <Link to="/leaderboard" className="text-premium-text hover:text-premium-gold font-serif font-medium tracking-wide transition-colors uppercase text-sm">Leaderboard</Link>
            <Link to="/write" className="text-premium-text hover:text-premium-gold font-serif font-medium tracking-wide transition-colors uppercase text-sm">Write</Link>
          </div>

          {/* Right Side Actions */}
          <div className="hidden sm:flex sm:items-center space-x-6">
            {user ? (
              // Profile Dropdown for logged-in users
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setProfileOpen(prev => !prev)}
                  className="flex items-center space-x-3 text-sm focus:outline-none group"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="w-10 h-10 bg-teal-50 text-premium-gold rounded-full flex items-center justify-center font-serif font-bold overflow-hidden border border-teal-200 ring-2 ring-transparent group-hover:ring-teal-200 transition-all">
                    {user.avatar ? (
                      <img src={user.avatar} alt="User Avatar" className="w-full h-full object-cover" />
                    ) : (
                      user.fullName?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <ChevronDownIcon
                    className={`h-4 w-4 text-premium-text group-hover:text-premium-gold transition-all duration-200 ${isProfileOpen ? 'rotate-180' : ''
                      }`}
                  />
                </button>
                {isProfileOpen && (
                  <div className="origin-top-right absolute right-0 mt-3 w-56 rounded-xl shadow-lg shadow-teal-500/10 py-1 bg-white ring-1 ring-black ring-opacity-5 z-50 border border-teal-100">
                    <div className="px-4 py-3 border-b border-teal-50 bg-teal-50/50">
                      <p className="text-sm font-bold text-premium-text font-serif truncate">{user.fullName}</p>
                      <p className="text-xs text-premium-slate truncate">@{user.username}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-premium-text font-serif"
                      onClick={handleProfileClick}
                    >
                      Your Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-premium-text font-serif"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Login/Signup buttons for logged-out users
              <div className="flex items-center space-x-6">
                <Link to="/login" className="text-premium-text hover:text-premium-gold font-serif font-medium tracking-wide uppercase text-sm">Login</Link>
                <Link to="/signup" className="btn-primary text-sm py-2 px-6">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center sm:hidden">
            <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-premium-text hover:bg-teal-50 hover:text-premium-gold transition-colors">
              {isMobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white border-t border-teal-100 shadow-inner">
          <div className="pt-2 pb-3 space-y-1">
            <Link to="/stories" className="block pl-6 pr-4 py-3 text-base font-serif font-medium text-premium-text hover:bg-teal-50 border-l-4 border-transparent hover:border-premium-gold">Stories</Link>
            <Link to="/leaderboard" className="block pl-6 pr-4 py-3 text-base font-serif font-medium text-premium-text hover:bg-teal-50 border-l-4 border-transparent hover:border-premium-gold">Leaderboard</Link>
            <Link to="/write" className="block pl-6 pr-4 py-3 text-base font-serif font-medium text-premium-text hover:bg-teal-50 border-l-4 border-transparent hover:border-premium-gold">Write</Link>
            <Link to="/about" className="block pl-6 pr-4 py-3 text-base font-serif font-medium text-premium-text hover:bg-teal-50 border-l-4 border-transparent hover:border-premium-gold">About</Link>
          </div>
          <div className="pt-4 pb-4 border-t border-teal-100 bg-teal-50/50">
            {user ? (
              <div className="px-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-teal-50 text-premium-gold rounded-full flex items-center justify-center font-bold overflow-hidden border border-teal-200">
                    {user.avatar ? <img src={user.avatar} alt="User Avatar" className="w-full h-full object-cover" /> : user.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-bold text-premium-text font-serif">{user.fullName}</div>
                    <div className="text-sm font-medium text-premium-slate">@{user.username}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link to="/profile" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:text-premium-text hover:bg-teal-50 rounded-md">Your Profile</Link>
                  <button onClick={handleLogout} className="w-full text-left block pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:text-premium-text hover:bg-teal-50 rounded-md">Sign out</button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 px-4">
                <Link to="/login" className="block w-full text-center py-2 text-base font-serif font-medium text-premium-text hover:bg-white border border-teal-200 rounded-full">Login</Link>
                <Link to="/signup" className="block w-full text-center py-2 text-base font-serif font-bold text-white bg-gold-gradient rounded-full shadow-md">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
