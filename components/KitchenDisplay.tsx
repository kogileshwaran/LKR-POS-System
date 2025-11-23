import React, { useState, useEffect } from 'react';
import { Order, CartItem } from '../types';
import { Clock, CheckCircle, Flame, AlertCircle } from 'lucide-react';

interface KitchenDisplayProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
}

const KitchenDisplay: React.FC<KitchenDisplayProps> = ({ orders, onUpdateStatus }) => {
  // Filter out completed orders to keep the board clean, or keep them for a bit
  const activeOrders = orders.filter(o => o.status !== 'COMPLETED');

  return (
    <div className="h-full bg-gray-900 p-6 overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Flame className="text-orange-500" />
          Kitchen Display System
        </h1>
        <div className="flex gap-4 text-sm font-medium text-gray-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span> New
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span> Cooking
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span> Ready
          </div>
        </div>
      </div>

      {activeOrders.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-600">
          <CheckCircle size={64} className="mb-4 opacity-50" />
          <p className="text-xl">All caught up!</p>
          <p className="text-sm">Waiting for new orders...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto pb-10">
          {activeOrders.map(order => (
            <Ticket key={order.id} order={order} onUpdateStatus={onUpdateStatus} />
          ))}
        </div>
      )}
    </div>
  );
};

const Ticket: React.FC<{ order: Order, onUpdateStatus: (id: string, s: Order['status']) => void }> = ({ order, onUpdateStatus }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - order.timestamp) / 1000)); // seconds
    }, 1000);
    return () => clearInterval(timer);
  }, [order.timestamp]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Status Colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'border-green-500 bg-gray-800';
      case 'KITCHEN': return 'border-orange-500 bg-gray-800';
      case 'READY': return 'border-blue-500 bg-gray-800';
      default: return 'border-gray-600 bg-gray-800';
    }
  };

  const getHeaderColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-green-600';
      case 'KITCHEN': return 'bg-orange-600';
      case 'READY': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  };

  const isLate = elapsed > 60 * 15; // 15 mins

  return (
    <div className={`rounded-xl border-l-4 shadow-lg overflow-hidden flex flex-col ${getStatusColor(order.status)} animate-fade-in`}>
      {/* Header */}
      <div className={`${getHeaderColor(order.status)} p-3 text-white flex justify-between items-start`}>
        <div>
          <h3 className="font-bold text-lg">Table {order.tableId}</h3>
          <p className="text-xs opacity-90">Order #{order.id}</p>
        </div>
        <div className={`flex items-center gap-1 font-mono font-bold px-2 py-1 rounded ${isLate ? 'bg-red-600 animate-pulse' : 'bg-black/20'}`}>
          <Clock size={14} />
          {formatTime(elapsed)}
        </div>
      </div>

      {/* Items */}
      <div className="p-4 flex-1 text-gray-200 space-y-3">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex gap-3 items-start border-b border-gray-700 pb-2 last:border-0 last:pb-0">
            <span className="font-bold text-lg text-white w-6 text-center bg-gray-700 rounded h-8 flex items-center justify-center">
                {item.quantity}
            </span>
            <div className="flex-1">
              <p className="font-medium text-white leading-tight">{item.name}</p>
              {item.notes && <p className="text-sm text-yellow-400 italic mt-1">Note: {item.notes}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Actions */}
      <div className="p-3 bg-gray-900/50 border-t border-gray-700">
        {order.status === 'PENDING' && (
          <button 
            onClick={() => onUpdateStatus(order.id, 'KITCHEN')}
            className="w-full py-3 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold transition-colors"
          >
            Start Cooking
          </button>
        )}
        {order.status === 'KITCHEN' && (
          <button 
            onClick={() => onUpdateStatus(order.id, 'READY')}
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors"
          >
            Mark Ready
          </button>
        )}
        {order.status === 'READY' && (
          <button 
            onClick={() => onUpdateStatus(order.id, 'COMPLETED')}
            className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle size={18} /> Complete Order
          </button>
        )}
      </div>
    </div>
  );
};

export default KitchenDisplay;