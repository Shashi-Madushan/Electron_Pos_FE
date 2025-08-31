import React, { useEffect, useState } from 'react';
import { getOverview } from '../../services/AnalyticsService';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard: React.FC = () => {
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverview = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getOverview();
        setOverview(response?.data ?? null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch overview');
        setOverview(null);
      }
      setLoading(false);
    };
    fetchOverview();
  }, []);

  // Mock data for charts
  const dailyRevenueData = [
    { hour: '00:00', revenue: 1200 },
    { hour: '04:00', revenue: 800 },
    { hour: '08:00', revenue: 2500 },
    { hour: '12:00', revenue: 3800 },
    { hour: '16:00', revenue: 2900 },
    { hour: '20:00', revenue: 1900 },
  ];

  const dailySalesData = [
    { hour: '00:00', sales: 12 },
    { hour: '04:00', sales: 8 },
    { hour: '08:00', sales: 25 },
    { hour: '12:00', sales: 38 },
    { hour: '16:00', sales: 29 },
    { hour: '20:00', sales: 19 },
  ];

  const categoryData = [
    { name: 'Electronics', sales: 450, stock: 120 },
    { name: 'Clothing', sales: 320, stock: 250 },
    { name: 'Accessories', sales: 280, stock: 180 },
    { name: 'Home & Living', sales: 150, stock: 90 },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {loading && <div className="mb-4 text-gray-500">Loading...</div>}
      {error && <div className="mb-4 text-red-500">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg">Total Customers</h3>
          <p className="text-2xl mt-2">{overview?.totalCustomers ?? 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg">Total Sales</h3>
          <p className="text-2xl mt-2">{overview?.totalSales ?? 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg">Active Products</h3>
          <p className="text-2xl mt-2">{overview?.totalProducts ?? 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg">Average Order</h3>
          <p className="text-2xl mt-2">{overview?.averageOrder ?? 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Daily Revenue</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#4F46E5" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Daily Sales Count</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailySalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#10B981" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Sales and Stock by Category</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#4F46E5" />
              <Bar dataKey="stock" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

