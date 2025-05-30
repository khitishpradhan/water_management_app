import { useEffect, useState } from 'react';
import axios from 'axios';

function ResidentPanel() {
  const [users, setUsers] = useState([]);
  const [usageForm, setUsageForm] = useState({ userId: '', usage: '' });

  useEffect(() => {
    axios.get('/users').then(res => setUsers(res.data));
  }, []);

  const logUsage = async () => {
    await axios.post('/usage', usageForm);
    setUsageForm({ ...usageForm, usage: '' });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Resident Panel</h2>

      {/* Log Usage */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Log Water Usage</h3>
        <div className="flex gap-2 mt-2">
          <select className="border p-2" value={usageForm.userId} onChange={e => setUsageForm({ ...usageForm, userId: e.target.value })}>
            <option value="">Select User</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
          <input className="border p-2" type="number" placeholder="Usage (liters)" value={usageForm.usage} onChange={e => setUsageForm({ ...usageForm, usage: e.target.value })} />
          <button className="bg-green-600 text-white px-4 py-2" onClick={logUsage}>Log</button>
        </div>
      </div>
    </div>
  );
}

export default ResidentPanel;
