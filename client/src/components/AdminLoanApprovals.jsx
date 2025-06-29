import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function AdminLoanApprovals() {
  const { user } = useContext(AuthContext);
  const [loans, setLoans] = useState([]);

  // Use a constant for the API base URL
  const API_BASE_URL = 'https://maa-mahamaya-finance-1npm-install.onrender.com';

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/loans`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setLoans(data);
        } else if (data.loans && Array.isArray(data.loans)) {
          setLoans(data.loans);
        } else {
          setLoans([]);
          console.error('Unexpected loans data format:', data);
        }
      } catch (error) {
        console.error('Error fetching loans:', error);
      }
    };
    fetchLoans();
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
        setLoans(loans.filter(loan => loan._id !== loanId));
      } else {
        alert('Error updating loan status');
      }
    } catch (error) {
      alert('Error during loan status update');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg animate-slide-in">
      <h3 className="text-lg font-semibold mb-4">All Loan Approvals</h3>
      {loans.length === 0 ? (
        <p>No loans to approve.</p>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="p-2">User</th>
              <th className="p-2">Role</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Purpose</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan._id} className="border-t">
                <td className="p-2">{loan.userId ? loan.userId.name : 'N/A'}</td>
                <td className="p-2">{loan.userId ? loan.userId.role : 'N/A'}</td>
                <td className="p-2">${loan.amount}</td>
                <td className="p-2">{loan.purpose}</td>
                <td className="p-2">{loan.status}</td>
                <td className="p-2">
                  {loan.status === 'pending' && (
                    <>
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
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminLoanApprovals;
