import { useEffect, useState } from 'react';
import axios from 'axios';

const baseURL = 'http://localhost:3000';

function ResidentPanel({ user }) {
  const [userId, setUserId] = useState(user.id || null);
  const [userUsage, setUserUsage] = useState([]);
  const [filter, setFilter] = useState('all');
  const [invoices, setInvoices] = useState([]); 

  const fetchUserUsage = async (period = filter) => {
    let usageURL = `${baseURL}/users/${userId}/usage`;

    if (period !== 'all') {
      usageURL = `${baseURL}/users/${userId}/usage/filter?period=${period}`;
    }

    const usageRes = await axios.get(usageURL);
    setUserUsage(usageRes.data);

    const invoiceRes = await axios.get(`${baseURL}/users/${userId}/invoices`);
    setInvoices(invoiceRes.data);
  };

  useEffect(() => {
    if (userId) {
      fetchUserUsage(filter);
    }
  }, [filter]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Resident Panel</h2>

      {/* Usage & Invoice Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Water Usage Section */}
        <h4 className="text-lg font-semibold mb-4 text-gray-700">Water Usage</h4>
        
        {/* Filter Section */}
        <div className="mb-4 flex items-center gap-3">
          <label className="font-medium text-gray-700">Filter by:</label>
          <select
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="hour">Last Hour</option>
            <option value="day">Today</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Usage
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userUsage.length > 0 ? (
                userUsage.map((entry, i) => (
                  <tr key={entry.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(entry.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {entry.usage}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="px-6 py-8 text-center text-sm text-gray-500 bg-gray-50">
                    No Records Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ResidentPanel;
