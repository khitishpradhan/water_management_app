import { useState, useEffect } from 'react';
import axios from 'axios';

const baseURL = 'http://localhost:3000';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', role: 'resident' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [userUsage, setUserUsage] = useState([]);
  const [filter, setFilter] = useState('all');
  const [invoiceForm, setInvoiceForm] = useState({ month: new Date().toISOString().slice(0, 7) });
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios.get(`${baseURL}/users`).then(res => setUsers(res.data));
  }, []);

  const createUser = async () => {
    await axios.post(`${baseURL}/users`, form);
    const res = await axios.get('/users');
    setUsers(res.data);
    setForm({ name: '', email: '', role: 'resident' });
  };

  const fetchUserUsage = async (id, period = filter) => {
    setSelectedUser(id);
    let usageURL = `${baseURL}/users/${id}/usage`;

    if (period !== 'all') {
      usageURL = `${baseURL}/users/${id}/usage/filter?period=${period}`;
    }

    const usageRes = await axios.get(usageURL);
    setUserUsage(usageRes.data);

    const invoiceRes = await axios.get(`${baseURL}/users/${id}/invoices`);
    setInvoices(invoiceRes.data);
  };

  const createInvoice = async () => {
    await axios.post(`${baseURL}/users/${selectedUser}/invoice`, { month: invoiceForm.month });
    fetchUserUsage(selectedUser);
    setInvoiceForm({ month: new Date().toISOString().slice(0, 7) });
  };

  useEffect(() => {
    if (selectedUser) {
      fetchUserUsage(selectedUser, filter);
    }
  }, [filter]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Admin Panel</h2>

      {/* Create User */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Add User</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              className="border border-gray-200 rounded-lg px-4 py-2 w-full text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white"
              placeholder="Enter name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              className="border border-gray-200 rounded-lg px-4 py-2 w-full text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white"
              placeholder="Enter email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <div className="flex space-x-4 items-center pt-2">
              <label className="inline-flex items-center text-gray-700">
                <input
                  type="radio"
                  name="role"
                  value="resident"
                  checked={form.role === 'resident'}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2 text-sm">Resident</span>
              </label>

              <label className="inline-flex items-center text-gray-700">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={form.role === 'admin'}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2 text-sm">Admin</span>
              </label>
            </div>
          </div>
          
          <div className="flex flex-col justify-end">
            <button
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition text-sm font-medium"
              onClick={createUser}
            >
              Create User
            </button>
          </div>
        </div>
      </div>
      
      {/* Select & View Usage + Invoices */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        {/* User List */}
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Users</h3>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Role
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(u => (
                <tr
                  key={u.id}
                  onClick={() => fetchUserUsage(u.id)}
                  className={`cursor-pointer transition ${
                    selectedUser === u.id
                      ? 'bg-blue-50 hover:bg-blue-100'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    selectedUser === u.id
                      ? 'text-blue-700'
                      : 'text-gray-900'
                  }`}>
                    {u.name}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    selectedUser === u.id
                      ? 'text-blue-700'
                      : 'text-gray-900'
                  }`}>
                    {u.email}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    selectedUser === u.id
                      ? 'text-blue-700'
                      : 'text-gray-900'
                  }`}>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      u.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Usage & Invoice Section */}
      {selectedUser && (
        <>
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
                  userUsage.map((entry) => (
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

          {/* Create Invoice Section */}
          <h4 className="text-lg font-semibold mt-6 mb-6 text-gray-700">Create Invoice</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Month
              </label>
              <input
                className="border border-gray-200 rounded-lg px-4 py-2 w-full text-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none bg-white"
                type="month"
                value={invoiceForm.month}
                onChange={e => setInvoiceForm({ ...invoiceForm, month: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rate per Liter
              </label>
              <input
                className="border border-gray-200 rounded-lg px-4 py-2 w-full text-sm bg-gray-50 text-gray-600"
                type="number"
                value="5"
                disabled
              />
            </div>
            
            <div className="flex flex-col justify-end">
              <button
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition text-sm font-medium"
                onClick={createInvoice}
              >
                Generate Invoice
              </button>
            </div>
          </div>

        </div>
        
        {/* All Invoices Section */}
        <div className='bg-white shadow-md rounded-lg p-6 mt-8'>
          <h4 className="text-lg font-semibold mb-4 text-gray-700">All Invoices</h4>
          
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.length > 0 ? (
                  invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {inv.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {inv.totalUsage}L
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{inv.amount}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-sm text-gray-500 bg-gray-50">
                      No Invoices Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        </>
      )}
    </div>
  );
}

export default AdminPanel;
