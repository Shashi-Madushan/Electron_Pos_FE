import React, { useState } from 'react';

const Brands: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Brand Management</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Brand
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search brands..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/3 border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Sample Brand Card */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="h-12 w-12 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                Logo
              </div>
              <h3 className="text-lg font-semibold">Samsung</h3>
              <p className="text-sm text-gray-500">Electronics</p>
            </div>
            <div className="space-x-2">
              <button className="text-blue-600 hover:text-blue-900">Edit</button>
              <button className="text-red-600 hover:text-red-900">Delete</button>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Products:</span>
                <span className="ml-1">45</span>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <span className="ml-1 px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sample Brand Card */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="h-12 w-12 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                Logo
              </div>
              <h3 className="text-lg font-semibold">Apple</h3>
              <p className="text-sm text-gray-500">Electronics</p>
            </div>
            <div className="space-x-2">
              <button className="text-blue-600 hover:text-blue-900">Edit</button>
              <button className="text-red-600 hover:text-red-900">Delete</button>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Products:</span>
                <span className="ml-1">32</span>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <span className="ml-1 px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Brands;
