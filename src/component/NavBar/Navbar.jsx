import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function ResponsiveAppBar() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Ref for closing user menu on outside click
  const userMenuRef = useRef(null);

  // Retrieve user role from localStorage
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    setUserRole(localStorage.getItem('iap-final-role'));
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const pages =
    userRole === 'EMPLOYER'
      ? ['Home', 'Manage Vacancies', 'Manage Companies', 'Manage Applications']
      : userRole === 'JOB_SEEKER'
      ? ['Home', 'Jobs', 'Training Programs', 'My Applications', 'My Trainings']
      : userRole === 'TRAINER'
      ? ['Home', 'Manage Courses', 'Registered Students']
      : [];

  const settings = ['Profile', 'Logout'];

  const handleLogout = () => {
    logout();
    localStorage.removeItem('iap-final-role');
    navigate('/login');
    window.location.reload();
  };

  const handleUserMenuClick = (setting) => {
    setIsUserMenuOpen(false);
    if (setting === 'Profile') {
      navigate('/profile');
    } else if (setting === 'Logout') {
      handleLogout();
    }
  };

  // Get first character of userRole or fallback to '?'
  const userInitial = userRole ? userRole.charAt(0).toUpperCase() : '?';

  return (
    <nav className="bg-green-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left section: Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-white font-mono font-bold text-xl tracking-wider select-none"
            >
              Career Builder
            </Link>
          </div>

          {/* Center section: Desktop Navigation */}
          <div className="hidden md:flex space-x-4 mx-auto">
            {pages.map((page) => (
              <Link
                key={page}
                to={`/${page.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-white hover:bg-green-800 px-3 py-2 rounded-md text-sm font-medium transition"
              >
                {page}
              </Link>
            ))}
          </div>

          {/* Right section: User Menu */}
          <div className="flex items-center space-x-4">
            {/* User Avatar & Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex text-sm rounded-full focus:outline-none"
                aria-haspopup="true"
                aria-expanded={isUserMenuOpen}
                aria-label="User menu"
                type="button"
              >
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 text-white font-bold select-none">
                  {userInitial}
                </div>
              </button>
              {isUserMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                  <div className="py-1">
                    {settings.map((setting) => (
                      <button
                        key={setting}
                        onClick={() => handleUserMenuClick(setting)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {setting}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsNavOpen(!isNavOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded={isNavOpen}
                aria-label="Toggle menu"
                type="button"
              >
                {isNavOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isNavOpen && (
        <div className="md:hidden bg-green-700" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {pages.map((page) => (
              <Link
                key={page}
                to={`/${page.toLowerCase().replace(/\s+/g, '-')}`}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-green-800"
                onClick={() => setIsNavOpen(false)} // close menu on link click
              >
                {page}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default ResponsiveAppBar;

