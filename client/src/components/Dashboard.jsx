import React, { useState, useEffect, useContext } from 'react';
import Sidebar from './Sidebar';
import { AuthContext } from '../context/AuthContext';
import LoanApplication from './LoanApplication';
import LoanStatus from './LoanStatus';
import PaymentManagement from './PaymentManagement';
import FinancialReports from './FinancialReports';
import QueryManagement from './QueryManagement';
import AdminPanel from './AdminPanel';
import EmployeeTasks from './EmployeeTasks';

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState('overview');
  const [loans, setLoans] = useState([]);
  const [pendingLoans, setPendingLoans] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (user?.role === 'employee') {
      const fetchPendingLoans = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/loans/pending', {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          const data = await response.json();
          if (Array.isArray(data)) {
            setPendingLoans(data);
          } else if (data.loans && Array.isArray(data.loans)) {
            setPendingLoans(data.loans);
          } else {
            setPendingLoans([]);
            console.error('Unexpected pending loans data format:', data);
          }
        } catch (error) {
          console.error('Error fetching pending loans:', error);
          setPendingLoans([]);
        }
      };
      fetchPendingLoans();
    }
  }, [user]);
  
  

  useEffect(() => {
    setActiveSection('overview');
  }, [user?.role]);

  useEffect(() => {
    const fetchLoans = async () => {
      if (!user) return;
      try {
        console.log('Fetching loans for user:', user._id);
        const userId = user._id || user.id;
        const response = await fetch(`http://localhost:5000/api/loans/user/${userId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Fetched loans data:', data);
        setLoans(data);
      } catch (error) {
        console.error('Error fetching loans:', error);
      }
    };
    fetchLoans();
  }, [user]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user || user.role !== 'admin') return;
      try {
        const response = await fetch('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      }
    };
    fetchUsers();
  }, [user]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user || user.role !== 'admin') return;
      try {
        const response = await fetch('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      }
    };
    fetchUsers();
  }, [user]);

  const totalLoans = Array.isArray(loans) ? loans.length : 0;
  const activeLoans = Array.isArray(loans) ? loans.filter(loan => loan.status === 'approved').length : 0;
  const pendingPayments = Array.isArray(loans) ? loans.reduce((sum, loan) => {
    if (loan.status === 'approved' && loan.pendingAmount) {
      return sum + loan.pendingAmount;
    }
    return sum;
  }, 0) : 0;

  const renderCustomerSections = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome back, {user?.name || 'Customer'}!</h1>
            <p>Here's your financial overview.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">Total Loans</h2>
                <p className="text-3xl font-bold text-blue-600">{totalLoans}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">Active Loans</h2>
                <p className="text-3xl font-bold text-green-600">{activeLoans}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">Pending Payments</h2>
                <p className="text-3xl font-bold text-red-600">${pendingPayments.toFixed(2)}</p>
              </div>
            </div>
          </div>
        );
      case 'accounts':
        return <div><h2>My Accounts</h2></div>;
      case 'payments':
        return <PaymentManagement userId={user?._id} />;
      case 'loans':
        return <LoanApplication userId={user?._id} />;
      case 'investments':
        return <LoanStatus userId={user?._id} />;
      case 'profile':
        return <div><h2>Profile Settings</h2></div>;
      default:
        return null;
    }
  };

  const renderBusinessSections = () => {
    switch (activeSection) {
case 'overview':
  return (
    <div className="w-full mx-4 p-6 bg-white rounded-md shadow-md border border-gray-200">
      <h1 className="text-3xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-1">Business Dashboard</h1>
      <p className="text-base text-gray-700 mb-3">Manage your business finances efficiently.</p>
      <p className="text-sm font-semibold text-gray-800 mb-4">User: {user?.name}</p>
      {/* Add more business overview content here */}
      <button
        className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors font-semibold text-base"
        onClick={() => setActiveSection('apply-loan')}
      >
        Apply for a Loan
      </button>
    </div>
  );
      case 'accounts':
        return <div><h2>Business Accounts</h2></div>;
      case 'transactions':
        return <PaymentManagement />;
      case 'payroll':
        return <QueryManagement />;
      case 'reports':
        return <FinancialReports userId={user?._id} />;
      case 'settings':
        return <div><h2>Settings</h2></div>;
      case 'loans':
        return <LoanStatus />;
      case 'apply-loan':
        return <LoanApplication />;
      default:
        return null;
    }
  };

  const renderEmployeeSections = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="w-full mx-4 p-6 bg-white rounded-md shadow-md border border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-1">Welcome back, {user?.name || 'Employee'}!</h1>
            <p className="mb-6">Here is your employee dashboard overview.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-100 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">Pending Tasks</h2>
                <p className="text-3xl font-bold text-blue-700">{pendingLoans.length}</p>
              </div>
              <div className="bg-green-100 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">Clients Managed</h2>
                <p className="text-3xl font-bold text-green-700">15</p>
              </div>
              <div className="bg-yellow-100 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">Performance Score</h2>
                <p className="text-3xl font-bold text-yellow-700">92%</p>
              </div>
            </div>
          </div>
        );
      case 'tasks':
        return <EmployeeTasks />;
      case 'clients':
        return <QueryManagement userId={user?._id} />;
      case 'performance':
        return <div><h2>Performance</h2></div>;
      default:
        return null;
    }
  };

  const renderAdminSections = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="w-full mx-4 p-6 bg-white rounded-md shadow-md border border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-1">Welcome back, {user?.name || 'Admin'}!</h1>
            <p className="mb-6">Here is your admin dashboard overview.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-purple-100 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">Total Users</h2>
                <p className="text-3xl font-bold text-purple-700">{(users || []).length}</p>
              </div>
              <div className="bg-indigo-100 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">Active Reports</h2>
                <p className="text-3xl font-bold text-indigo-700">7</p>
              </div>
              <div className="bg-pink-100 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">System Alerts</h2>
                <p className="text-3xl font-bold text-pink-700">3</p>
              </div>
            </div>
          </div>
        );
      case 'users':
        return <AdminPanel currentUser={user} />;
      case 'reports':
        return <div><h2>System Reports</h2></div>;
      case 'settings':
        return <div><h2>System Settings</h2></div>; 
      default: 
        return null;
    }
  };

  const renderContent = () => {
    switch (user?.role) {
      case 'customer':
        return renderCustomerSections();
      case 'business':
        return renderBusinessSections();
      case 'employee':
        return renderEmployeeSections();
      case 'admin':
        return renderAdminSections();
      default:
        return <p>Invalid role</p>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 pt-0">
      <Sidebar role={user?.role} activeSection={activeSection} setActiveSection={setActiveSection} className="pt-16" />
      <main className="flex-1 p-10 md:ml-64 w-full min-h-screen">
        {renderContent()}
      </main>
    </div>
  );
}

export default Dashboard;
