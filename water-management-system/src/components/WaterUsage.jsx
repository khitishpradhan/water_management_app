import React from 'react'

const WaterUsage = ({ waterUsage, invoiceForm, setInvoiceForm, filter, setFilter, createInvoice }) => {

	const showInvoiceSection = invoiceForm && setInvoiceForm && createInvoice;


  return (
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
					{waterUsage.length > 0 ? (
						waterUsage.map((entry) => (
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
		{showInvoiceSection && (
			<>
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
			</>	
		)}
		
	</div>
  )
}

export default WaterUsage