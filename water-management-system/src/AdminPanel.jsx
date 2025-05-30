import { useState, useEffect } from 'react';
import axios from 'axios';

const baseURL = 'http://localhost:3000';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', role: 'resident' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [userUsage, setUserUsage] = useState([]);
  const [filter, setFilter] = useState('all');
  const [invoiceForm, setInvoiceForm] = useState({ month: '' });
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
    setInvoiceForm({ month: '' });
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
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <input
            className="border rounded px-4 py-2 w-full md:w-1/3 focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="border rounded px-4 py-2 w-full md:w-1/3 focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">Role</label>
            <div className="flex space-x-4 items-center">
              <label className="inline-flex items-center text-gray-700">
                <input
                  type="radio"
                  name="role"
                  value="resident"
                  checked={form.role === 'resident'}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2">Resident</span>
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
                <span className="ml-2">Admin</span>
              </label>
            </div>
          </div>
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
            onClick={createUser}
          >
            Create
          </button>
        </div>
      </div>

      {/* Select & View Usage + Invoices */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">View User Usage</h3>

        <div className="mb-4">
          <label className="mr-2 font-medium text-gray-700">Filter by:</label>
          <select
            className="border rounded px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
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

        <div className="flex flex-wrap gap-2">
          {users.map(u => (
            <button
              key={u.id}
              onClick={() => fetchUserUsage(u.id)}
              className={`px-4 py-2 rounded border ${
                selectedUser === u.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              } transition`}
            >
              {u.name}
            </button>
          ))}
        </div>
      </div>

      {/* Usage & Invoice Section */}
      {selectedUser && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-2 text-gray-700">Water Usage</h4>
          <ul className="list-disc list-inside text-gray-800 mb-6">
            {userUsage.map((entry, i) => (
              <li key={i}>
                {new Date(entry.timestamp).toLocaleString()} - {entry.usage}L
              </li>
            ))}
          </ul>

          <h4 className="text-lg font-semibold mb-2 text-gray-700">Create Invoice</h4>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              className="border rounded px-4 py-2 w-full md:w-1/3 focus:ring-2 focus:ring-purple-400 outline-none"
              type="month"
              value={invoiceForm.month}
              onChange={e => setInvoiceForm({ ...invoiceForm, month: e.target.value })}
            />
            <input
              className="border rounded px-4 py-2 w-full md:w-1/3 bg-gray-100 text-gray-600"
              type="number"
              placeholder="Rate / L"
              value="5"
              disabled
            />
            <button
              className="bg-purple-600 text-white px-5 py-2 rounded hover:bg-purple-700 transition"
              onClick={createInvoice}
            >
              Generate
            </button>
          </div>

          <h4 className="text-lg font-semibold mb-2 text-gray-700">Invoices</h4>
          <ul className="text-gray-800">
            {invoices.map((inv, i) => (
              <li key={i}>
                {inv.month}: {inv.totalUsage}L = ₹{inv.amount}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
