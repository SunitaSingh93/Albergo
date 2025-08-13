// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function Navbar() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/");
//   };

//   return (
//     <nav className="w-full flex items-center justify-between p-4 border-b">
//       <div className="flex items-center space-x-2">
//         <img src="/src/assets/albergo-logo.svg" alt="Albergo Logo" className="w-8 h-8" />
//         <span className="text-xl font-bold">Albergo</span>
//       </div>
//       <div className="space-x-4 flex items-center">
//         <Link to="/">Home</Link>
//         <Link to="/about">About</Link>
//         <Link to="/contact">Contact Us</Link>
//         {user ? (
//           <>
//             {user.role === "ADMIN" && <Link to="/admin">Admin</Link>}
//             {user.role === "CUSTOMER" && <Link to="/customer">Customer</Link>}
//             {user.role === "MANAGER" && <Link to="/manager">Manager</Link>}
//             {user.role === "RECEPTIONIST" && <Link to="/receptionist">Receptionist</Link>}
//             <span className="mx-2 text-gray-600">{user.name || user.email} ({user.role})</span>
//             <button onClick={handleLogout} className="ml-2 px-2 py-1 bg-gray-200 rounded">Logout</button>
//           </>
//         ) : (
//           <>
//             <Link to="/login">Login</Link>
//             <Link to="/signup">Signup</Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }



import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsProfileDropdownOpen(false);
  };

  // Generate user initials for profile image
  const getUserInitials = (user) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    if (user?.name) {
      const names = user.name.split(' ');
      if (names.length >= 2) {
        return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
      }
      return user.name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Get role-based color for profile
  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-500';
      case 'MANAGER': return 'bg-blue-500';
      case 'RECEPTIONIST': return 'bg-green-500';
      case 'CUSTOMER': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  // Navigation items
  const navigationItems = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact Us" }
  ];

  // Role-based dashboard links
  const getDashboardLink = (role) => {
    switch (role) {
      case 'ADMIN': return { to: '/admin', label: 'Admin Dashboard' };
      case 'MANAGER': return { to: '/manager', label: 'Manager Dashboard' };
      case 'RECEPTIONIST': return { to: '/receptionist', label: 'Receptionist Dashboard' };
      case 'CUSTOMER': return { to: '/customer', label: 'My Account' };
      default: return null;
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 w-full bg-white shadow-xl border-b border-gray-200 z-50 backdrop-blur-sm bg-white/95">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-300">
                <span className="text-white font-bold text-xl">A</span>
              </div>
            </div>
            <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
              Albergo
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            {/* Navigation Links */}
            <div className="flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-gray-700 hover:text-blue-600 font-semibold text-lg transition-all duration-300 relative group px-3 py-2 rounded-lg hover:bg-blue-50"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300 group-hover:w-3/4"></span>
                </Link>
              ))}
            </div>

            {/* User Section */}
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Dashboard Link */}
                {getDashboardLink(user.role) && (
                  <Link
                    to={getDashboardLink(user.role).to}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <span>📊</span>
                    <span>{getDashboardLink(user.role).label}</span>
                  </Link>
                )}

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 rounded-xl px-4 py-3 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 border border-gray-200 hover:border-blue-300"
                  >
                    {/* Profile Image */}
                    <div className={`w-10 h-10 ${getRoleColor(user.role)} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-white`}>
                      {getUserInitials(user)}
                    </div>
                    
                    {/* User Info */}
                    <div className="text-left">
                      <div className="text-sm font-semibold text-gray-900">
                        {user.firstName && user.lastName 
                          ? `${user.firstName} ${user.lastName}`
                          : user.name || user.email
                        }
                      </div>
                      <div className="text-xs font-medium text-gray-600 bg-gray-200 px-2 py-1 rounded-full">{user.role}</div>
                    </div>
                    
                    {/* Dropdown Arrow */}
                    <svg className={`w-5 h-5 text-gray-500 transition-all duration-300 ${isProfileDropdownOpen ? 'rotate-180 text-blue-600' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 py-3 z-50 backdrop-blur-sm bg-white/95">
                      {/* User Info Header */}
                      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
                        <div className="flex items-center space-x-4">
                          <div className={`w-14 h-14 ${getRoleColor(user.role)} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ring-4 ring-white`}>
                            {getUserInitials(user)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 text-lg">
                              {user.firstName && user.lastName 
                                ? `${user.firstName} ${user.lastName}`
                                : user.name || 'User'
                              }
                            </div>
                            <div className="text-sm text-gray-600">{user.email}</div>
                            <div className="text-xs font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1 rounded-full inline-block mt-2 shadow-md">
                              {user.role}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <span className="mr-3">👤</span>
                          View Profile
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <span className="mr-3">⚙️</span>
                          Settings
                        </Link>
                        <hr className="my-2" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <span className="mr-3">🚪</span>
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-4">
            {/* Navigation Links */}
            {navigationItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {user ? (
              <div className="pt-4 border-t border-gray-200">
                {/* User Info */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-10 h-10 ${getRoleColor(user.role)} rounded-full flex items-center justify-center text-white font-semibold`}>
                    {getUserInitials(user)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {user.firstName && user.lastName 
                        ? `${user.firstName} ${user.lastName}`
                        : user.name || user.email
                      }
                    </div>
                    <div className="text-sm text-gray-500">{user.role}</div>
                  </div>
                </div>

                {/* Dashboard Link */}
                {getDashboardLink(user.role) && (
                  <Link
                    to={getDashboardLink(user.role).to}
                    className="block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors mb-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    📊 {getDashboardLink(user.role).label}
                  </Link>
                )}

                {/* Profile Links */}
                <Link
                  to="/profile"
                  className="block text-gray-700 hover:text-blue-600 font-medium transition-colors mb-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  👤 Profile
                </Link>
                <Link
                  to="/settings"
                  className="block text-gray-700 hover:text-blue-600 font-medium transition-colors mb-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ⚙️ Settings
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  🚪 Logout
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link
                  to="/login"
                  className="block text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}