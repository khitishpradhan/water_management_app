import { useState, useEffect } from 'react';
import axios from 'axios';

const baseURL = 'http://localhost:3000';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [userUsage, setUserUsage] = useState([]);
  const [invoiceForm, setInvoiceForm] = useState({ month: ''});
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios.get(`${baseURL}/users`).then(res => setUsers(res.data));
  }, []);

  const createUser = async () => {
    await axios.post(`${baseURL}/users`, form);
    const res = await axios.get('/users');
    setUsers(res.data);
    setForm({ name: '', email: '' });
  };

  const fetchUserUsage = async (id) => {
    setSelectedUser(id);
    const usageRes = await axios.get(`${baseURL}/users/${id}/usage`);
    setUserUsage(usageRes.data);
    console.log(usageRes.data);
    const invoiceRes = await axios.get(`${baseURL}/users/${id}/invoices`);
    setInvoices(invoiceRes.data);
    console.log(invoiceRes.data);
  };

  const createInvoice = async () => {
    await axios.post(`${baseURL}/users/${selectedUser}/invoice`, { month: invoiceForm.month });
    fetchUserUsage(selectedUser);
    setInvoiceForm({ month: ''});
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>

      {/* Create User */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Add User</h3>
        <div className="flex gap-2 mt-2">
          <input className="border p-2" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input className="border p-2" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <button className="bg-blue-600 text-white px-4 py-2" onClick={createUser}>Create</button>
        </div>
      </div>

      {/* Select & View Usage + Invoices */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold">View User Usage</h3>
        <div className="flex gap-2 mt-2">
          {users.map(u => (
            <button
              key={u.id}
              onClick={() => fetchUserUsage(u.id)}
              className={`px-3 py-1 border ${selectedUser === u.id ? 'bg-blue-300' : ''}`}
            >
              {u.name}
            </button>
          ))}
        </div>
      </div>

      {selectedUser && (
        <div>
          <h4 className="font-semibold">Water Usage</h4>
          <ul className="mb-4">
            {userUsage.map((entry, i) => (
              <li key={i}>{new Date(entry.timestamp).toLocaleString()} - {entry.usage}L</li>
            ))}
          </ul>

          <h4 className="font-semibold">Create Invoice</h4>
          <div className="flex gap-2 mt-2">
            <input className="border p-2" placeholder="Month (YYYY-MM)" type='month' value={invoiceForm.month} onChange={e => setInvoiceForm({ ...invoiceForm, month: e.target.value })} />
            <input className="border p-2" type="number" placeholder="Rate / L" value="5" disabled={true} onChange={e => setInvoiceForm({ ...invoiceForm, ratePerLiter: e.target.value })} />
            <button className="bg-purple-600 text-white px-4 py-2" onClick={createInvoice}>Generate</button>
          </div>

          <h4 className="font-semibold mt-4">Invoices</h4>
          <ul>
            {invoices.map((inv, i) => (
              <li key={i}>{inv.month}: {inv.totalUsage}L = ₹{inv.amount}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
