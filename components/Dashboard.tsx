import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DollarSign, ShoppingBag, Percent, TrendingUp } from 'lucide-react';

const MOCK_DATA = [
  { name: 'Chicken Biryani', sales: 45 },
  { name: 'Ghee Dosa', sales: 38 },
  { name: 'Fish Curry', sales: 25 },
  { name: 'Kottu', sales: 22 },
  { name: 'Rice & Curry', sales: 18 },
];

const COLORS = ['#ea580c', '#f97316', '#fb923c', '#fdba74', '#fed7aa'];

const Dashboard: React.FC = () => {
  return (
    <div className="p-8 h-full overflow-y-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-4 bg-green-100 text-green-600 rounded-full">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Revenue</p>
            <h3 className="text-2xl font-bold text-gray-900">LKR 45,200</h3>
            <div className="flex items-center text-xs text-green-500 mt-1">
              <TrendingUp size={12} className="mr-1" />
              <span>+12% from yesterday</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-full">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Transactions</p>
            <h3 className="text-2xl font-bold text-gray-900">84</h3>
            <div className="flex items-center text-xs text-blue-500 mt-1">
              <span>Today's Orders</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-4 bg-orange-100 text-orange-600 rounded-full">
            <Percent size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Discounts Given</p>
            <h3 className="text-2xl font-bold text-gray-900">LKR 3,450</h3>
            <div className="flex items-center text-xs text-gray-400 mt-1">
              <span>Applied on 12 orders</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Top Selling Items</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_DATA} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{fill: '#fff7ed'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="sales" radius={[0, 4, 4, 0]} barSize={30}>
                  {MOCK_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders List (Mock) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <h2 className="text-lg font-bold text-gray-800 mb-6">Recent Activity</h2>
           <div className="space-y-4">
              {[1,2,3,4,5].map((i) => (
                  <div key={i} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-50 last:border-0">
                      <div>
                          <p className="font-medium text-gray-800">Order #{1000 + i}</p>
                          <p className="text-xs text-gray-500">Table {Math.floor(Math.random() * 10) + 1} • Cashier John</p>
                      </div>
                      <div className="text-right">
                          <p className="font-bold text-gray-800">LKR {(Math.floor(Math.random() * 20) + 5) * 100}</p>
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-green-100 text-green-800">Completed</span>
                      </div>
                  </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;