import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config'; // <-- Add this line

function LoanApplication() {
  const { user } = useContext(AuthContext);
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/loans/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ userId: user.id, amount, purpose }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Loan application submitted!');
        setAmount('');
        setPurpose('');
      } else {
        alert('Error submitting application');
      }
    } catch (error) {
      alert('Error during submission');
    }
  };

  return (
    <div id="apply-loan" className="w-full max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg animate-slide-in">
      <h3 className="text-lg font-semibold mb-6">Apply for a Loan</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Loan Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Purpose</label>
          <input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
}

export default LoanApplication;
