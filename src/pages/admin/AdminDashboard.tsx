import React, { useEffect, useState } from 'react';
import { getOverview } from '../../services/AnalyticsService';

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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {loading && <div className="mb-4 text-gray-500">Loading...</div>}
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-lg">Total Customers</h3>
          <p className="text-2xl mt-2">{overview?.totalCustomers ?? 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-lg">Total Sales</h3>
          <p className="text-2xl mt-2">{overview?.totalSales ?? 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-lg">Active Products</h3>
          <p className="text-2xl mt-2">{overview?.totalProducts ?? 0}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
