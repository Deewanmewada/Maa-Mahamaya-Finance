import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import AdminLoanApprovals from './AdminLoanApprovals';
import { API_BASE_URL } from '../config'; // <-- Add this import

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AdminPanel({ currentUser }) {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showLoanApprovals, setShowLoanApprovals] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = user?.token;
        // Clear users state before fetching new data to avoid accumulation
        setUsers([]);
        setLoans([]);
        setTransactions([]);
        const [usersRes, loansRes, transactionsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/users`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/api/loans`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/api/transactions`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        {
          const usersData = await usersRes.json();
          console.log('Fetched users data:', usersData);
          // Deduplicate users by _id
          const uniqueUsersMap = new Map();
          (Array.isArray(usersData) ? usersData : usersData.users || []).forEach(user => {
            if (user && user._id && !uniqueUsersMap.has(user._id)) {
              uniqueUsersMap.set(user._id, user);
            }
          });
          const uniqueUsers = Array.from(uniqueUsersMap.values());
          console.log('Unique users count after deduplication:', uniqueUsers.length);
          setUsers(uniqueUsers);
        }
        {
          const loansData = await loansRes.json();
          setLoans(Array.isArray(loansData) ? loansData : loansData.loans || []);
        }
        {
          const transactionsData = await transactionsRes.json();
          setTransactions(Array.isArray(transactionsData) ? transactionsData : transactionsData.transactions || []);
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };
    fetchData();
  }, [user]);

  const chartData = {
    labels: ['Customers', 'Businesses', 'Employees', 'Admins'],
    datasets: [
      {
        label: 'User Roles',
        data: [
          users.filter((u) => u.role === 'customer').length,
          users.filter((u) => u.role === 'business').length,
          users.filter((u) => u.role === 'employee').length,
          users.filter((u) => u.role === 'admin').length,
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-1">Admin Panel</h1>
      <p className="text-md font-semibold mb-4">Logged in as: {user?.name || currentUser?.name || 'Admin'}</p>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => setShowLoanApprovals(!showLoanApprovals)}
      >
        {showLoanApprovals ? 'Hide' : 'Show'} Loan Approvals
      </button>
      {showLoanApprovals ? (
        <AdminLoanApprovals />
      ) : (
        <div>
          <div id="customers" className="bg-white p-6 rounded-md shadow-md border border-gray-200 mb-6">
            <h4 className="text-md font-semibold mb-4">Customers</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="p-2">Name</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Phone</th>
                    <th className="p-2">Address</th>
                    <th className="p-2">Loan Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.filter(user => user.role === 'customer').length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-2 text-center text-gray-500">No customers found.</td>
                    </tr>
                  ) : (
                    users.filter(user => user.role === 'customer').map((user) => {
                      const userLoan = loans.find((loan) => loan.userId && loan.userId._id === user._id);
                      return (
                        <tr key={user._id} className="border-t">
                          <td className="p-2">{user?.name ?? 'N/A'}</td>
                          <td className="p-2">{user?.email ?? 'N/A'}</td>
                          <td className="p-2">{user?.phone ?? 'N/A'}</td>
                          <td className="p-2">{user?.address ?? 'N/A'}</td>
                          <td className="p-2">{userLoan ? (userLoan.status ?? 'Unknown') : 'No loan'}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div id="businesses" className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h4 className="text-md font-semibold mb-4">Businesses</h4>
            <p className="mb-4 font-semibold">Welcome, {user?.name || 'Business User'}</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="p-2">Business Name</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Phone</th>
                    <th className="p-2">Address</th>
                    <th className="p-2">Loan Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.filter(user => user.role === 'business').map((user) => {
                    const userLoan = loans.find((loan) => loan.userId && loan.userId._id === user._id);
                    return (
                      <tr key={user._id} className="border-t">
                        <td className="p-2">{user?.name ?? 'N/A'}</td>
                        <td className="p-2">{user?.email ?? 'N/A'}</td>
                        <td className="p-2">{user?.phone ?? 'N/A'}</td>
                        <td className="p-2">{user?.address ?? 'N/A'}</td>
                        <td className="p-2">{userLoan ? userLoan.status : 'No loan'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div id="employees" className="bg-white p-6 rounded-lg shadow-lg mt-6">
            <h4 className="text-md font-semibold mb-4">Employees</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="p-2">Name</th>
                    <th className="p-2">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {users.filter(user => user.role === 'employee').map((employee) => (
                    <tr key={employee._id} className="border-t">
                      <td className="p-2">{employee.name}</td>
                      <td className="p-2">{employee.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div id="loans" className="bg-white p-6 rounded-lg shadow-lg">
            <h4 className="text-md font-semibold mb-4">Loans</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="p-2">User</th>
                    <th className="p-2">Amount</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map((loan) => (
                    <tr key={loan._id} className="border-t">
                      <td className="p-2">{loan.userId?.name ?? 'N/A'}</td>
                      <td className="p-2">${loan.amount}</td>
                      <td className="p-2">{loan.status ?? 'Unknown'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div id="transactions" className="bg-white p-6 rounded-lg shadow-lg">
            <h4 className="text-md font-semibold mb-4">Transactions</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="p-2">User</th>
                    <th className="p-2">Amount</th>
                    <th className="p-2">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction._id} className="border-t">
                      <td className="p-2">{transaction.userId.name}</td>
                      <td className="p-2">${transaction.amount}</td>
                      <td className="p-2">{transaction.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h4 className="text-md font-semibold mb-4">Analytics</h4>
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: { legend: { position: 'top' }, title: { display: true, text: 'User Role Distribution' } },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
