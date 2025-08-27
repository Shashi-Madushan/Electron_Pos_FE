import React, { useState, useEffect } from 'react';

const Inventory: React.FC = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Stock
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex space-x-4">
        <select 
          className="border border-gray-300 rounded-md shadow-sm p-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Items</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>

        <input
          type="text"
          placeholder="Search inventory..."
          className="border border-gray-300 rounded-md shadow-sm p-2 flex-1"
        />
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">In Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Sample row */}
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">Sample Product</td>
              <td className="px-6 py-4 whitespace-nowrap">SKU-001</td>
              <td className="px-6 py-4 whitespace-nowrap">Electronics</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                  150
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">50</td>
              <td className="px-6 py-4 whitespace-nowrap space-x-2">
                <button className="text-blue-600 hover:text-blue-900">Adjust</button>
                <button className="text-green-600 hover:text-green-900">History</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
