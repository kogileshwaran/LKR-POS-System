import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DollarSign, ShoppingBag, Percent, TrendingUp } from 'lucide-react';
import { Order } from '../types';

interface DashboardProps {
    orders: Order[];
}

const COLORS = ['#ea580c', '#f97316', '#fb923c', '#fdba74', '#fed7aa'];

const Dashboard: React.FC<DashboardProps> = ({ orders }) => {
  // Calculate Real Metrics
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalTransactions = orders.length;
  const totalDiscounts = orders.reduce((sum, order) => sum + order.discount, 0);

  // Calculate Top Selling Items (Basic Aggregation)
  const itemSales: Record<string, number> = {};
  orders.forEach(order => {
      order.items.forEach(item => {
          itemSales[item.name] = (itemSales[item.name] || 0) + item.quantity;
      });
  });

  const chartData = Object.entries(itemSales)
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5); // Top 5

  const recentOrders = [...orders].reverse().slice(0, 7);

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto bg-gray-50">
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-6 md:mb-8">Saapttu kada Dashboard</h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center space-x-4">
          <div className="p-4 bg-green-100 text-green-600 rounded-full shadow-sm shrink-0">
            <DollarSign size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">LKR {totalRevenue.toLocaleString()}</h3>
            <div className="flex items-center text-xs text-green-600 font-bold mt-1">
              <TrendingUp size={12} className="mr-1" />
              <span>Real-time</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center space-x-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-full shadow-sm shrink-0">
            <ShoppingBag size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Transactions</p>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{totalTransactions}</h3>
            <div className="flex items-center text-xs text-blue-500 font-bold mt-1">
              <span>Orders Placed</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center space-x-4">
          <div className="p-4 bg-orange-100 text-orange-600 rounded-full shadow-sm shrink-0">
            <Percent size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Discounts Given</p>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">LKR {totalDiscounts.toLocaleString()}</h3>
            <div className="flex items-center text-xs text-gray-400 font-medium mt-1">
              <span>Customer Savings</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Chart */}
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-6">Top Selling Items</h2>
          <div className="h-64 md:h-80 w-full">
            {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11, fill: '#4b5563' }} />
                    <Tooltip 
                        cursor={{fill: '#fff7ed'}} 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                    />
                    <Bar dataKey="sales" radius={[0, 6, 6, 0]} barSize={20}>
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    </Bar>
                </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                    No sales data yet
                </div>
            )}
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-200">
           <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-6">Recent Activity</h2>
           <div className="space-y-3 md:space-y-4">
              {recentOrders.length === 0 ? (
                  <div className="text-center text-gray-400 py-10">No recent orders</div>
              ) : (
                  recentOrders.map((order) => (
                      <div key={order.id} className="flex justify-between items-center p-3 md:p-4 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100 shadow-sm">
                          <div className="flex items-center gap-3 md:gap-4">
                              <div className="bg-orange-100 p-2 rounded-lg text-orange-600 font-bold text-xs md:text-sm">#{order.id.slice(-4)}</div>
                              <div>
                                  <p className="font-bold text-gray-800 text-sm md:text-base">Table {order.tableId} • {order.items.length} Items</p>
                                  <p className="text-[10px] md:text-xs text-gray-500 font-medium">By {order.cashierName} • {new Date(order.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                              </div>
                          </div>
                          <div className="text-right">
                              <p className="font-bold text-gray-900 text-sm md:text-base">LKR {order.total.toLocaleString()}</p>
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide
                                ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
                                  order.status === 'READY' ? 'bg-blue-100 text-blue-700' :
                                  'bg-yellow-100 text-yellow-700'}`}>
                                  {order.status}
                              </span>
                          </div>
                      </div>
                  ))
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;