import { useEffect, useState } from 'react';
import axios from 'axios';
import Invoices from './components/Invoices';
import WaterUsage from './components/WaterUsage';

const baseURL = import.meta.env.VITE_BASE_URL;

function ResidentPanel({ user }) {
  const userId = user.id;
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
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Resident Panel</h2>

      {/* Usage & Invoice Section */}
      <WaterUsage userUsage={userUsage} filter={filter} setFilter={setFilter}/>

      {/* Invoices Section */}
      <Invoices headingText ={"Invoices"} invoices={invoices}/>

    </div>
  );
}

export default ResidentPanel;
