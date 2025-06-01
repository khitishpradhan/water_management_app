import { useState, useEffect } from 'react';

import { createUser, getUsers } from './services/api';

import Invoices from './components/Invoices';
import WaterUsage from './components/WaterUsage';

// Use localhost:3000 for development/testing
const baseURL = import.meta.env.VITE_BASE_URL;

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', role: 'resident' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await getUsers();
      console.log(res)
      setUsers(res);
    };

    fetchUsers();
  }, []);

  const registerUser = async (e) => {
    e.preventDefault()

    const res = await createUser(form)
    setUsers([...users, res])

  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Admin Panel</h2>

      {/* Create User */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Add User</h3>
        
        <form onSubmit={(e) => registerUser(e)}>
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
                type="submit"
              >
                Create User
              </button>
            </div>
          </div>
        </form>

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
              {users.length > 0 && users?.map(u => (
                <tr
                  key={u.id}
                  onClick={() => setSelectedUser(u.id)}
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
        <WaterUsage selectedUser={selectedUser} />      
        {/* All Invoices Section */}
        <Invoices headingText={"All Invoices"} selectedUser={selectedUser}/>

        </>
      )}
    </div>
  );
}

export default AdminPanel;
