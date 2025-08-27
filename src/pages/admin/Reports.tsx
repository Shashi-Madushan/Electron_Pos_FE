import React, { useState } from 'react';

const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState('sales');
  const [dateRange, setDateRange] = useState('week');

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Reports</h1>

      <div className="mb-6 flex space-x-4">
        <select
          value={selectedReport}
          onChange={(e) => setSelectedReport(e.target.value)}
          className="border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="sales">Sales Report</option>
          <option value="inventory">Inventory Report</option>
          <option value="users">User Activity Report</option>
        </select>

        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>

        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Generate Report
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {selectedReport === 'sales' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Sales Report</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="text-sm text-gray-500">Total Sales</h3>
                <p className="text-2xl font-bold">$0</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="text-sm text-gray-500">Total Orders</h3>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="text-sm text-gray-500">Average Order Value</h3>
                <p className="text-2xl font-bold">$0</p>
              </div>
            </div>
            <div className="border rounded">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Sample row - replace with actual data */}
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">2025-08-27</td>
                    <td className="px-6 py-4 whitespace-nowrap">#12345</td>
                    <td className="px-6 py-4 whitespace-nowrap">John Doe</td>
                    <td className="px-6 py-4 whitespace-nowrap">$100.00</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Completed
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedReport === 'inventory' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Inventory Report</h2>
            {/* Add inventory report content */}
          </div>
        )}

        {selectedReport === 'users' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">User Activity Report</h2>
            {/* Add user activity report content */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
