import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function PaymentManagement() {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/transactions/user/${user.id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };
    fetchTransactions();
  }, [user]);

  return (
    <div id="payments" className="bg-white p-6 rounded-lg shadow-lg animate-slide-in">
      <h3 className="text-lg font-semibold mb-4">Payment History</h3>
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="p-2">Amount</th>
                <th className="p-2">Type</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id} className="border-t">
                  <td className="p-2">${transaction.amount}</td>
                  <td className="p-2">{transaction.type}</td>
                  <td className="p-2">{new Date(transaction.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PaymentManagement;
