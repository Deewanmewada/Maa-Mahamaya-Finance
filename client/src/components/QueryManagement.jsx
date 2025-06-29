import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config';

function QueryManagement() {
  const { user } = useContext(AuthContext);
  const [queries, setQueries] = useState([]);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/queries`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await response.json();
        // Defensive check: ensure data is an array
        if (Array.isArray(data)) {
          setQueries(data);
        } else if (data.queries && Array.isArray(data.queries)) {
          setQueries(data.queries);
        } else {
          setQueries([]);
          console.error('Unexpected queries data format:', data);
        }
      } catch (error) {
        console.error('Error fetching queries:', error);
      }
    };
    fetchQueries();
  }, [user]);

  const handleRespond = async (queryId, responseText) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/queries/respond/${queryId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ response: responseText }),
      });
      if (response.ok) {
        alert('Response sent!');
        setQueries(queries.map((q) => (q._id === queryId ? { ...q, response: responseText } : q)));
        setResponses({ ...responses, [queryId]: '' });
      } else {
        alert('Error sending response');
      }
    } catch (error) {
      alert('Error during response submission');
    }
  };

  return (
    <div id="queries" className="bg-white p-6 rounded-lg shadow-lg animate-slide-in">
      <h3 className="text-lg font-semibold mb-4">Customer Queries</h3>
      {queries.length === 0 ? (
        <p>No queries found.</p>
      ) : (
        <div className="space-y-4">
          {queries.map((query) => (
            <div key={query._id} className="border p-4 rounded-lg">
              <p><strong>User:</strong> {query.userId.name}</p>
              <p><strong>Query:</strong> {query.query}</p>
              <p><strong>Response:</strong> {query.response || 'Pending'}</p>
              {!query.response && (
                <div className="mt-2">
                  <textarea
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter response"
                    value={responses[query._id] || ''}
                    onChange={(e) =>
                      setResponses({ ...responses, [query._id]: e.target.value })
                    }
                  />
                  <button
                    className="mt-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                    onClick={() => handleRespond(query._id, responses[query._id] || '')}
                  >
                    Respond
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default QueryManagement;
