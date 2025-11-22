import React, { useState, useMemo } from 'react';
import { MenuItem, CartItem, User, PaymentMethod, Order } from '../types';
import { CATEGORIES, INITIAL_MENU_ITEMS } from '../constants';
import { Search, Plus, Minus, Trash2, ChefHat, CreditCard, RotateCw, Utensils } from 'lucide-react';
import PaymentModal from './PaymentModal';
import ReceiptModal from './ReceiptModal';

interface POSProps {
  user: User;
}

const POS: React.FC<POSProps> = ({ user }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Filter Items
  const filteredItems = useMemo(() => {
    return INITIAL_MENU_ITEMS.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Cart Operations
  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
      setCart([]);
      setDiscountPercent(0);
  }

  // Random Selection Feature
  const handleRandomSelect = () => {
      const randomItem = INITIAL_MENU_ITEMS[Math.floor(Math.random() * INITIAL_MENU_ITEMS.length)];
      addToCart(randomItem);
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const total = subtotal - discountAmount;

  const handlePaymentComplete = (method: PaymentMethod, amountTendered?: number) => {
    setIsPaymentModalOpen(false);
    
    const newOrder: Order = {
        id: Math.floor(100000 + Math.random() * 900000).toString(),
        tableId: '3', // Hardcoded for demo
        items: [...cart],
        subtotal: subtotal,
        discount: discountAmount,
        total: total,
        status: 'COMPLETED',
        timestamp: Date.now(),
        paymentMethod: method,
        cashierName: user.name,
        amountTendered: amountTendered,
        change: amountTendered ? amountTendered - total : 0
    };

    setCompletedOrder(newOrder);
    // We clear the active cart so the background is ready for next order, 
    // but the receipt modal will show the completed order details.
    setCart([]); 
    setDiscountPercent(0);
  };

  return (
    <div className="flex h-full bg-gray-100 overflow-hidden font-sans">
      
      {/* LEFT: Categories */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Utensils className="text-orange-500" />
                Category
            </h2>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
            
            <button 
                onClick={handleRandomSelect}
                className="w-full p-4 mb-4 bg-orange-100 text-orange-700 rounded-xl font-bold flex items-center justify-between hover:bg-orange-200 transition-colors"
            >
                <span>Favorite Items</span>
                <RotateCw size={18} />
            </button>

            {CATEGORIES.map(cat => (
                <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-6 py-4 rounded-xl transition-all duration-200 font-medium ${
                        selectedCategory === cat 
                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>
      </div>

      {/* MIDDLE: Menu Grid */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header/Search */}
        <div className="bg-white p-4 border-b flex justify-between items-center sticky top-0 z-10">
            <div className="relative w-full max-w-md">
                <input
                    type="text"
                    placeholder="Search items..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            </div>
            
            <div className="flex items-center space-x-4 ml-4">
                <div className="text-right hidden lg:block">
                    <p className="text-sm font-bold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
                <img src={user.avatarUrl} alt="User" className="w-10 h-10 rounded-full border-2 border-orange-500" />
            </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map(item => (
                    <div 
                        key={item.id} 
                        onClick={() => addToCart(item)}
                        className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl border border-transparent hover:border-orange-200 cursor-pointer transition-all duration-200 flex flex-col h-64"
                    >
                        <div className="relative h-32 mb-4 overflow-hidden rounded-xl bg-gray-100">
                             <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                             {item.isVegetarian && <span className="absolute top-2 right-2 bg-green-500 w-3 h-3 rounded-full border border-white" title="Vegetarian"></span>}
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-gray-800 line-clamp-1">{item.name}</h3>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.category}</p>
                            </div>
                            <div className="flex justify-between items-end mt-2">
                                <span className="text-lg font-extrabold text-orange-600">LKR {item.price}</span>
                                <button className="bg-gray-100 p-2 rounded-lg text-gray-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                    <Plus size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {filteredItems.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <ChefHat size={48} className="mb-4 opacity-50" />
                    <p>No items found</p>
                </div>
            )}
        </div>
      </div>

      {/* RIGHT: Cart Sidebar */}
      <div className="w-96 bg-white border-l shadow-xl flex flex-col z-20 absolute right-0 h-full md:relative transform transition-transform md:translate-x-0 translate-x-full md:block">
         <div className="p-6 border-b bg-gray-50">
             <div className="flex justify-between items-center mb-1">
                <h2 className="text-lg font-bold">Table: 3</h2>
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">Dine In</span>
             </div>
             <p className="text-xs text-gray-500">Order #7562</p>
         </div>

         {/* Cart Items */}
         <div className="flex-1 overflow-y-auto p-4 space-y-4">
             {cart.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-full text-gray-400">
                     <p>Cart is empty</p>
                     <p className="text-xs mt-2">Tap items to add</p>
                 </div>
             ) : (
                 cart.map(item => (
                     <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                         <div className="flex-1">
                             <h4 className="font-bold text-sm text-gray-800">{item.name}</h4>
                             <p className="text-xs text-gray-500">LKR {item.price}</p>
                         </div>
                         <div className="flex items-center space-x-3">
                             <div className="flex items-center bg-gray-100 rounded-lg">
                                 <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-gray-200 rounded-l-lg text-gray-600"><Minus size={14}/></button>
                                 <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                                 <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-gray-200 rounded-r-lg text-gray-600"><Plus size={14}/></button>
                             </div>
                             <div className="text-right min-w-[3rem]">
                                 <span className="font-bold text-sm block">{(item.price * item.quantity).toLocaleString()}</span>
                             </div>
                             <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                         </div>
                     </div>
                 ))
             )}
         </div>

         {/* Footer Totals */}
         <div className="p-6 bg-gray-50 border-t">
             <div className="space-y-2 mb-4">
                 <div className="flex justify-between text-gray-500 text-sm">
                     <span>Subtotal</span>
                     <span>LKR {subtotal.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between text-gray-500 text-sm items-center">
                     <span>Discount</span>
                     <div className="flex items-center space-x-2">
                        {[0, 5, 10].map(d => (
                            <button 
                                key={d} 
                                onClick={() => setDiscountPercent(d)}
                                className={`text-xs px-2 py-1 rounded border ${discountPercent === d ? 'bg-orange-500 text-white border-orange-500' : 'bg-white border-gray-300'}`}
                            >
                                {d}%
                            </button>
                        ))}
                        <span className="text-red-500">- {discountAmount}</span>
                     </div>
                 </div>
                 <div className="flex justify-between text-xl font-extrabold text-gray-900 pt-4 border-t border-gray-200 mt-2">
                     <span>Total</span>
                     <span>LKR {total.toLocaleString()}</span>
                 </div>
             </div>
             
             <div className="grid grid-cols-2 gap-3">
                 <button onClick={clearCart} className="py-3 rounded-xl border border-gray-300 font-bold text-gray-600 hover:bg-gray-100">Cancel</button>
                 <button 
                    onClick={() => setIsPaymentModalOpen(true)} 
                    disabled={cart.length === 0}
                    className="py-3 rounded-xl bg-gray-900 text-white font-bold shadow-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                 >
                     <span>Checkout</span>
                 </button>
             </div>
         </div>
      </div>

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        total={total}
        onClose={() => setIsPaymentModalOpen(false)}
        onComplete={handlePaymentComplete}
      />

      <ReceiptModal 
          order={completedOrder}
          onClose={() => setCompletedOrder(null)}
      />
    </div>
  );
};

export default POS;