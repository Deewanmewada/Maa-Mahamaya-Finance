import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config';

function EmployeeTasks() {
  const { user } = useContext(AuthContext);
  const [pendingLoans, setPendingLoans] = useState([]);

  useEffect(() => {
    const fetchPendingLoans = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/loans/pending`, {
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
      }
    };
    fetchPendingLoans();
  }, [user]);

  const handleLoanDecision = async (loanId, decision) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/loans/${loanId}/decision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ status: decision }),
      });
      if (response.ok) {
        setPendingLoans(pendingLoans.filter(loan => loan._id !== loanId));
      } else {
        const errorData = await response.json();
        console.error('Error updating loan status:', errorData);
        alert('Error updating loan status: ' + (errorData.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error during loan status update:', error);
      alert('Error during loan status update');
    }
  };

  return (
    <div className="w-full mx-4 p-6 bg-white rounded-md shadow-md border border-gray-200 animate-slide-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-1">Pending Loan Approvals</h1>
      <p className="mb-4 font-semibold">Logged in as: {user?.name || 'Employee'}</p>
      {pendingLoans.length === 0 ? (
        <p>No pending loans to approve.</p>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="p-2">Customer</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Purpose</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingLoans.map((loan) => (
              <tr key={loan._id} className="border-t">
                <td className="p-2">{loan.userId.name}</td>
                <td className="p-2">${loan.amount}</td>
                <td className="p-2">{loan.purpose}</td>
                <td className="p-2">
                  <button
                    className="mr-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={() => handleLoanDecision(loan._id, 'approved')}
                  >
                    Approve
                  </button>
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => handleLoanDecision(loan._id, 'rejected')}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default EmployeeTasks;
