import React from 'react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-lg">Total Users</h3>
          <p className="text-2xl mt-2">0</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-lg">Total Sales</h3>
          <p className="text-2xl mt-2">$0</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-lg">Active Products</h3>
          <p className="text-2xl mt-2">0</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-lg">Total Orders</h3>
          <p className="text-2xl mt-2">0</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
