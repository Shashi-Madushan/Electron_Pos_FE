import React, { useState } from 'react';
import {
  getDailySalesSummary,
  getWeeklySalesSummary,
  getMonthlySalesSummary,
  getCustomSalesSummary
} from '../../services/SalesAnalyticsService';
import {
  getDailyProfitSummary,
  getWeeklyProfitSummary,
  getMonthlyProfitSummary,
  getCustomProfitSummary
} from '../../services/ProfitCalService';

const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState('sales');
  const [dateRange, setDateRange] = useState('week');
  const [salesData, setSalesData] = useState<any>(null);
  const [profitData, setProfitData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const fetchSalesReport = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (dateRange === 'today') {
        response = await getDailySalesSummary();
      } else if (dateRange === 'week') {
        response = await getWeeklySalesSummary();
      } else if (dateRange === 'month') {
        response = await getMonthlySalesSummary();
      } else if (dateRange === 'year') {
        response = await getMonthlySalesSummary();
      } else if (dateRange === 'custom') {
        response = await getCustomSalesSummary(customStart, customEnd);
      }
      setSalesData(response?.data ?? null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch report');
      setSalesData(null);
    }
    setLoading(false);
  };

  const fetchProfitReport = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (dateRange === 'today') {
        response = await getDailyProfitSummary();
      } else if (dateRange === 'week') {
        response = await getWeeklyProfitSummary();
      } else if (dateRange === 'month') {
        response = await getMonthlyProfitSummary();
      } else if (dateRange === 'year') {
        response = await getMonthlyProfitSummary();
      } else if (dateRange === 'custom') {
        response = await getCustomProfitSummary(customStart, customEnd);
      }
      setProfitData(response?.data ?? null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch profit report');
      setProfitData(null);
    }
    setLoading(false);
  };

  const handleGenerateReport = () => {
    if (selectedReport === 'sales') {
      fetchSalesReport();
    } else if (selectedReport === 'profit') {
      fetchProfitReport();
    }
  };

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
          <option value="profit">Profit Report</option>
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
          <option value="custom">Custom Range</option>
        </select>

        {dateRange === 'custom' && (
          <>
            <input
              type="date"
              value={customStart}
              onChange={e => setCustomStart(e.target.value)}
              className="border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Start Date"
            />
            <input
              type="date"
              value={customEnd}
              onChange={e => setCustomEnd(e.target.value)}
              className="border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="End Date"
            />
          </>
        )}

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleGenerateReport}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Generate Report'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {selectedReport === 'sales' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Sales Report</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {!salesData && !loading && (
              <div className="text-gray-500 mb-4">No data. Click "Generate Report".</div>
            )}
            {salesData && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded">
                    <h3 className="text-sm text-gray-500">Total Transactions</h3>
                    <p className="text-2xl font-bold">
                      {salesData.totalTransactions ?? 0}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded">
                    <h3 className="text-sm text-gray-500">Average Transaction Value</h3>
                    <p className="text-2xl font-bold">
                      {salesData.averageTransactionValue ? `$${salesData.averageTransactionValue}` : '$0'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded">
                    <h3 className="text-sm text-gray-500">Total Revenue</h3>
                    <p className="text-2xl font-bold">
                      {salesData.totalRevenue ? `$${salesData.totalRevenue}` : '$0'}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {selectedReport === 'profit' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Profit Report</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {!profitData && !loading && (
              <div className="text-gray-500 mb-4">No data. Click "Generate Report".</div>
            )}
            {profitData && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded">
                    <h3 className="text-sm text-gray-500">Net Profit</h3>
                    <p className="text-2xl font-bold">
                      {profitData.netProfit ? `$${profitData.netProfit}` : '$0'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded">
                    <h3 className="text-sm text-gray-500">Total Revenue</h3>
                    <p className="text-2xl font-bold">
                      {profitData.totalRevenue ? `$${profitData.totalRevenue}` : '$0'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded">
                    <h3 className="text-sm text-gray-500">Total Cost</h3>
                    <p className="text-2xl font-bold">
                      {profitData.totalCost ? `$${profitData.totalCost}` : '$0'}
                    </p>
                  </div>
                </div>
              </>
            )}
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