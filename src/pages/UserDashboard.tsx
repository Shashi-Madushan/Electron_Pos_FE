import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const UserDashboard = () => {
  const orderData = [
    { day: '1', orders: 25 },
    { day: '5', orders: 32 },
    { day: '10', orders: 28 },
    { day: '15', orders: 45 },
    { day: '20', orders: 38 },
    { day: '25', orders: 42 },
    { day: '30', orders: 35 },
  ];

  const monthlyStats = [
    { month: 'Current', orders: 320 },
    { month: 'Last', orders: 280 },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Orders Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm">Today's Orders</h3>
          <p className="text-2xl font-bold text-gray-800">32</p>
          <span className="text-green-500 text-sm">+5 from yesterday</span>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm">Monthly Orders</h3>
          <p className="text-2xl font-bold text-gray-800">320</p>
          <span className="text-green-500 text-sm">+40 from last month</span>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm">Average Daily Orders</h3>
          <p className="text-2xl font-bold text-gray-800">28</p>
          <span className="text-green-500 text-sm">+3 from last month</span>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm">Pending Orders</h3>
          <p className="text-2xl font-bold text-gray-800">5</p>
          <span className="text-yellow-500 text-sm">Need attention</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Monthly Order Trend</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={orderData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#4F46E5" 
                  fill="rgba(79, 70, 229, 0.1)" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Monthly Comparison</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="orders" 
                  fill="#4F46E5"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;