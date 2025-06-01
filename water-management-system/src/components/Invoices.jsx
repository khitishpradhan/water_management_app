import { useState, useEffect } from 'react'
import { getInvoices } from '../services/api'

const Invoices = ({ headingText, selectedUser }) => {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchInvoices = async () => {
    setLoading(true)
    const res = await getInvoices(selectedUser)
    setInvoices(res)
    setLoading(false)
  }

  useEffect(() => {
    fetchInvoices()
  }, [selectedUser])

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-8">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-700">{headingText}</h4>
        <button
          onClick={fetchInvoices}
          disabled={loading}
          className="text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b">
                Month
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b">
                Usage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b">
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
  )
}

export default Invoices