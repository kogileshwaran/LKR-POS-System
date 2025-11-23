import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { DollarSign, ShoppingBag, Percent, TrendingUp } from 'lucide-react';
import { Order } from '../types';

interface DashboardProps {
    orders: Order[];
}

const COLORS = ['#ea580c', '#f97316', '#fb923c', '#fdba74', '#fed7aa'];

type TimeRange = 'daily' | 'monthly' | 'yearly';

const Dashboard: React.FC<DashboardProps> = ({ orders }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');

  // Filter Orders based on Time Range
  const { filteredOrders, rangeLabel } = useMemo(() => {
      const now = new Date();
      let label = '';
      const filtered = orders.filter(order => {
          const d = new Date(order.timestamp);
          if (timeRange === 'daily') {
              label = "Today's Report";
              return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          } else if (timeRange === 'monthly') {
              label = "This Month's Report";
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          } else {
              label = "This Year's Report";
              return d.getFullYear() === now.getFullYear();
          }
      });
      return { filteredOrders: filtered, rangeLabel: label };
  }, [orders, timeRange]);

  // Metrics
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  const totalTransactions = filteredOrders.length;
  const totalDiscounts = filteredOrders.reduce((sum, order) => sum + order.discount, 0);
  const averageOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  // Chart Data: Sales Trend
  const trendData = useMemo(() => {
      const data: Record<string, number> = {};
      
      if (timeRange === 'daily') {
          // Initialize hours 0-23
          for(let i=0; i<24; i++) data[`${i}:00`] = 0;
          filteredOrders.forEach(o => {
              const h = new Date(o.timestamp).getHours();
              data[`${h}:00`] = (data[`${h}:00`] || 0) + o.total;
          });
      } else if (timeRange === 'monthly') {
          // Initialize days
          const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
          for(let i=1; i<=daysInMonth; i++) data[i] = 0;
          filteredOrders.forEach(o => {
              const d = new Date(o.timestamp).getDate();
              data[d] = (data[d] || 0) + o.total;
          });
      } else {
           // Initialize months
           const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
           months.forEach(m => data[m] = 0);
           filteredOrders.forEach(o => {
               const m = new Date(o.timestamp).getMonth();
               data[months[m]] = (data[months[m]] || 0) + o.total;
           });
      }

      return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [filteredOrders, timeRange]);

  // Top Items Logic
  const topItemsData = useMemo(() => {
    const itemSales: Record<string, number> = {};
    filteredOrders.forEach(order => {
        order.items.forEach(item => {
            itemSales[item.name] = (itemSales[item.name] || 0) + item.quantity;
        });
    });

    return Object.entries(itemSales)
        .map(([name, sales]) => ({ name, sales }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);
  }, [filteredOrders]);

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto bg-gray-50 pb-24 md:pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 text-sm">{rangeLabel}</p>
          </div>
          
          <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 flex overflow-x-auto max-w-full">
              {(['daily', 'monthly', 'yearly'] as TimeRange[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeRange(t)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all whitespace-nowrap ${timeRange === t ? 'bg-orange-100 text-orange-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                      {t}
                  </button>
              ))}
          </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg"><DollarSign size={20} /></div>
            <span className="text-xs font-bold text-gray-400 uppercase">Revenue</span>
          </div>
          <h3 className="text-lg md:text-2xl font-black text-gray-900">LKR {totalRevenue.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><ShoppingBag size={20} /></div>
            <span className="text-xs font-bold text-gray-400 uppercase">Orders</span>
          </div>
          <h3 className="text-lg md:text-2xl font-black text-gray-900">{totalTransactions}</h3>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><TrendingUp size={20} /></div>
            <span className="text-xs font-bold text-gray-400 uppercase">Avg. Order</span>
          </div>
          <h3 className="text-lg md:text-2xl font-black text-gray-900">LKR {Math.round(averageOrderValue).toLocaleString()}</h3>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Percent size={20} /></div>
            <span className="text-xs font-bold text-gray-400 uppercase">Discounts</span>
          </div>
          <h3 className="text-lg md:text-2xl font-black text-gray-900">LKR {totalDiscounts.toLocaleString()}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Sales Trend Chart */}
        <div className="lg:col-span-2 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Sales Trend ({timeRange})</h2>
            <div className="h-64 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                        <CartesianGrid vertical={false} stroke="#f3f4f6" />
                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                        <Area type="monotone" dataKey="value" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Top Selling Items */}
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Top Items</h2>
          <div className="h-64 md:h-80 w-full">
            {topItemsData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topItemsData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11, fill: '#4b5563', fontWeight: 600 }} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }} />
                    <Bar dataKey="sales" radius={[0, 4, 4, 0]} barSize={20}>
                    {topItemsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    </Bar>
                </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex h-full items-center justify-center text-gray-400 text-sm">
                    No data for this period
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;