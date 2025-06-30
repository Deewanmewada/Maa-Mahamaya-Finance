import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // <-- Add this line


function Sidebar({ role, activeSection, setActiveSection }) {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useContext(AuthContext); // <-- Use logout from context

  const customerItems = [
    { id: 'overview', label: 'Overview', icon: 'fas fa-tachometer-alt' },
    { id: 'accounts', label: 'Accounts', icon: 'fas fa-university' },
    { id: 'payments', label: 'Payments', icon: 'fas fa-credit-card' },
    { id: 'loans', label: 'Loans', icon: 'fas fa-hand-holding-usd' },
    { id: 'investments', label: 'Investments', icon: 'fas fa-chart-pie' },
    { id: 'profile', label: 'Profile', icon: 'fas fa-user-cog' },
  ];

  const businessItems = [
    { id: 'overview', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { id: 'accounts', label: 'Accounts', icon: 'fas fa-university' },
    { id: 'transactions', label: 'Transactions', icon: 'fas fa-exchange-alt' },
    { id: 'payroll', label: 'Payroll', icon: 'fas fa-users' },
    { id: 'reports', label: 'Reports', icon: 'fas fa-chart-bar' },
    { id: 'loans', label: 'Loan Status', icon: 'fas fa-hand-holding-usd' },
    { id: 'settings', label: 'Settings', icon: 'fas fa-cog' },
  ];

  const employeeItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { id: 'tasks', label: 'Tasks', icon: 'fas fa-tasks' },
    { id: 'clients', label: 'Clients', icon: 'fas fa-users' },
    { id: 'performance', label: 'Performance', icon: 'fas fa-chart-line' },
  ];

  const adminItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { id: 'users', label: 'User Management', icon: 'fas fa-users' },
    { id: 'reports', label: 'System Reports', icon: 'fas fa-chart-bar' },
    { id: 'settings', label: 'System Settings', icon: 'fas fa-cogs' },
  ];

  const goHome = () => {
    window.location.href = '/';
  };

  const homeItem = (
    <div
      className="sidebar-item px-6 py-3 cursor-pointer flex items-center mb-4"
      onClick={goHome}
    >
      <i className="fas fa-home mr-3"></i>Home
    </div>
  );

  let items = [];
  switch (role) {
    case 'customer':
      items = customerItems;
      break;
    case 'business':
      items = businessItems;
      break;
    case 'employee':
      items = employeeItems;
      break;
    case 'admin':
      items = adminItems;
      break;
    default:
      items = [];
  }

  // Use this logout handler to clear session and redirect
  const handleLogout = () => {
    logout(); // Clear user session/token from context
    window.location.href = '/login'; // Redirect to login
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden flex items-center bg-white shadow p-4 z-50 fixed top-0 left-0 right-0">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        <div className="ml-3 font-semibold text-gray-900 capitalize">{role} Account</div>
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          ></div>
        )}
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-white shadow-lg md:w-64 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:block fixed md:static inset-y-0 left-0 z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out`}
      >
        <div className="p-6 border-b hidden md:flex items-center">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <i className="fas fa-user text-white"></i>
          </div>
          <div className="ml-3">
            <p className="font-semibold text-gray-900 capitalize">{role} Account</p>
          </div>
        </div>
        <nav className="mt-6">
          {homeItem}
          {items.map((item) => (
            <div
              key={item.id}
              className={`sidebar-item px-6 py-3 cursor-pointer flex items-center ${
                activeSection === item.id ? 'active' : ''
              }`}
              onClick={() => {
                setActiveSection(item.id);
                if (isOpen) setIsOpen(false);
              }}
            >
              <i className={`${item.icon} mr-3`}></i>
              {item.label}
            </div>
          ))}
          <div
            className="sidebar-item px-6 py-3 cursor-pointer text-red-600 flex items-center mt-4"
            onClick={handleLogout} // <-- Use the new logout handler
          >
            <i className="fas fa-sign-out-alt mr-3"></i>Logout
          </div>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
