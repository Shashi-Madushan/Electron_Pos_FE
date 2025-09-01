import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  getAdminDashboardStats,
  getMonthlyDailyRevenueStats,
  getYearlyMonthlyRevenueStats,
  getAdminMonthlySalesChart,
  type AdminDashboardStatsResponse,
  type MonthlyDailyRevenueStatsResponse,
  type YearlyMonthlyRevenueStatsResponse,
  type AdminMonthlySalesChartResponse,
} from '../../services/DashboardService';

const AdminDashboard: React.FC = () => {
  const [dashboardStats, setDashboardStats] = useState<AdminDashboardStatsResponse['data']>();
  const [dailyStats, setDailyStats] = useState<MonthlyDailyRevenueStatsResponse['data']>();
  const [yearlyStats, setYearlyStats] = useState<YearlyMonthlyRevenueStatsResponse['data']>();
  const [monthlySalesChart, setMonthlySalesChart] = useState<AdminMonthlySalesChartResponse['data']>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [statsRes, dailyRes, yearlyRes, monthlySalesRes] = await Promise.all([
          getAdminDashboardStats(),
          getMonthlyDailyRevenueStats(),
          getYearlyMonthlyRevenueStats(),
          getAdminMonthlySalesChart()
        ]);

        if (statsRes.statusCode === 200) setDashboardStats(statsRes.data);
        if (dailyRes.statusCode === 200) setDailyStats(dailyRes.data);
        if (yearlyRes.statusCode === 200) setYearlyStats(yearlyRes.data);
        if (monthlySalesRes.statusCode === 200) setMonthlySalesChart(monthlySalesRes.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch dashboard data');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {loading && <div className="mb-4 text-gray-500">Loading...</div>}
      {error && <div className="mb-4 text-red-500">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg">Today Sales</h3>
          <p className="text-2xl mt-2">{dashboardStats?.todaySalesCount ?? 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg">Monthly Sales</h3>
          <p className="text-2xl mt-2">{dashboardStats?.monthlySalesCount ?? 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg">Total Products</h3>
          <p className="text-2xl mt-2">{dashboardStats?.totalProducts ?? 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg">Active Products</h3>
          <p className="text-2xl mt-2">{dashboardStats?.activeProducts ?? 0}</p>
        </div>
      </div>

      <div className="flex flex-col gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow w-full">
          <h2 className="text-lg font-semibold mb-4">Daily Revenue</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyStats?.dailyStats ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#4F46E5" 
                  strokeWidth={2}
                  name="Revenue"
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Profit"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow w-full">
          <h2 className="text-lg font-semibold mb-4">Monthly Revenue</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyStats?.monthlyStats ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#4F46E5" name="Revenue" />
                <Bar dataKey="profit" fill="#10B981" name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow w-full">
          <h2 className="text-lg font-semibold mb-4">Monthly Sales Count</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySalesChart ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="salesCount" 
                  fill="#8884d8" 
                  name="Sales Count"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
