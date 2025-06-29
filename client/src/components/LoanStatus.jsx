import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function LoanStatus() {
  const { user } = useContext(AuthContext);
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/loans/user/${user.id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await response.json();
        setLoans(data);
      } catch (error) {
        console.error('Error fetching loans:', error);
      }
    };
    fetchLoans();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto">
      <div id="loan-status" className="w-full p-6 bg-white rounded-lg shadow-lg border border-gray-200 overflow-auto px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-1">Loan Status Dashboard</h1>
        {loans.length === 0 ? (
          <p>No loans found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="p-3 border-b font-medium">Amount</th>
                  <th className="p-3 border-b font-medium">Purpose</th>
                  <th className="p-3 border-b font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan._id} className="border-t">
                    <td className="p-3">${loan.amount}</td>
                    <td className="p-3">{loan.purpose}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          loan.status === 'approved' ? 'bg-green-200 text-green-800' : loan.status === 'rejected' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'
                        }`}
                      >
                        {loan.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoanStatus;
