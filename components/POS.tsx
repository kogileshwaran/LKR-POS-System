import React, { useState, useMemo } from 'react';
import { MenuItem, CartItem, User, PaymentMethod, Order } from '../types';
import { CATEGORIES, SHOP_LOGO } from '../constants';
import { Search, Plus, Minus, Trash2, ChefHat, RotateCw, Utensils, ShoppingBag, Edit3, Ban, ArrowLeft } from 'lucide-react';
import PaymentModal from './PaymentModal';
import ReceiptModal from './ReceiptModal';

interface POSProps {
  user: User;
  items: MenuItem[];
  onPlaceOrder: (order: Order) => void;
}

const POS: React.FC<POSProps> = ({ user, items, onPlaceOrder }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false); // State for mobile cart

  // Filter Items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, items]);

  // Cart Operations
  const addToCart = (item: MenuItem) => {
    if (!item.available) return; 

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

  const addNoteToItem = (id: string) => {
      const item = cart.find(i => i.id === id);
      if (!item) return;
      
      const note = window.prompt("Add special instruction for kitchen:", item.notes || "");
      if (note !== null) {
          setCart(prev => prev.map(i => i.id === id ? { ...i, notes: note } : i));
      }
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
      const availableItems = items.filter(i => i.available);
      if (availableItems.length === 0) return;
      const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
      addToCart(randomItem);
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const total = subtotal - discountAmount;

  const handlePaymentComplete = (method: PaymentMethod, amountTendered?: number) => {
    setIsPaymentModalOpen(false);
    setIsCartOpen(false);
    
    const newOrder: Order = {
        id: Math.floor(100000 + Math.random() * 900000).toString(),
        tableId: '3', // Hardcoded for demo
        items: [...cart],
        subtotal: subtotal,
        discount: discountAmount,
        total: total,
        status: 'PENDING', // Initial status for Kitchen
        timestamp: Date.now(),
        paymentMethod: method,
        cashierName: user.name,
        amountTendered: amountTendered,
        change: amountTendered ? amountTendered - total : 0
    };

    // Send to global App state
    onPlaceOrder(newOrder);

    // Show receipt
    setCompletedOrder(newOrder);
    
    // Clear active cart
    setCart([]); 
    setDiscountPercent(0);
  };

  return (
    <div className="flex h-full bg-gray-100 overflow-hidden font-sans relative">
      
      {/* LEFT: Desktop Categories Sidebar - Hidden on Tablet/Mobile */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col hidden lg:flex z-10 shadow-sm shrink-0">
        <div className="p-6">
            <h2 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
                <Utensils className="text-orange-600" />
                Category
            </h2>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
            <button 
                onClick={handleRandomSelect}
                className="w-full p-4 mb-4 bg-orange-50 text-orange-700 rounded-xl font-bold flex items-center justify-between hover:bg-orange-100 transition-colors border border-orange-100"
            >
                <span>Surprise Me</span>
                <RotateCw size={18} />
            </button>

            {CATEGORIES.map(cat => (
                <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-5 py-4 rounded-xl transition-all duration-200 font-semibold text-sm ${
                        selectedCategory === cat 
                        ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>
      </div>

      {/* MIDDLE: Menu Grid */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50 h-full">
        {/* Header/Search */}
        <div className="bg-white px-3 md:px-6 py-2 md:py-4 border-b border-gray-200 flex gap-3 md:gap-4 items-center sticky top-0 z-20 shadow-sm">
            {/* Logo Area */}
            <div className="flex items-center gap-4 shrink-0">
                <div className="lg:hidden w-8 h-8 rounded-lg overflow-hidden border border-gray-200">
                    <img src={SHOP_LOGO} alt="Logo" className="w-full h-full object-cover" />
                </div>
                <div className="hidden lg:block">
                    <img src={SHOP_LOGO} alt="Logo" className="h-10 w-auto object-contain" />
                </div>
                <div className="h-8 w-px bg-gray-200 hidden xl:block"></div>
            </div>

            {/* Search Bar */}
            <div className="relative flex-1">
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-9 md:pl-10 pr-4 py-2 bg-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all outline-none text-gray-800 text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            </div>
            
            {/* User Profile - Compact on mobile */}
            <div className="flex items-center space-x-3 pl-2 border-l lg:border-0 border-gray-100 shrink-0">
                <div className="text-right hidden xl:block">
                    <p className="text-sm font-bold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
                <div className="p-1 rounded-full border-2 border-orange-100">
                    <img src={user.avatarUrl} alt="User" className="w-8 h-8 md:w-10 md:h-10 rounded-full" />
                </div>
            </div>
        </div>

        {/* Mobile/Tablet Categories (Horizontal Scroll) - Visible on Tablet now */}
        <div className="lg:hidden bg-white border-b border-gray-200 py-2 px-3 overflow-x-auto flex gap-2 scrollbar-hide sticky top-[57px] z-10 shadow-sm">
             <button 
                onClick={handleRandomSelect}
                className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg font-bold text-xs whitespace-nowrap border border-orange-100 flex items-center gap-1 flex-shrink-0"
            >
                <RotateCw size={12} /> Surprise
            </button>
            {CATEGORIES.map(cat => (
                <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex-shrink-0 ${
                        selectedCategory === cat 
                        ? 'bg-orange-600 text-white shadow-sm' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-3 md:p-6 scrollbar-thin pb-32 md:pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-6">
                {filteredItems.map(item => (
                    <div 
                        key={item.id} 
                        onClick={() => addToCart(item)}
                        className={`group bg-white rounded-xl p-2.5 md:p-3 shadow-sm border border-gray-100 transition-all duration-200 flex flex-col h-auto relative active:scale-[0.98] ${
                            item.available 
                            ? 'hover:shadow-xl hover:border-orange-200 cursor-pointer' 
                            : 'opacity-70 cursor-not-allowed grayscale-[0.8]'
                        }`}
                    >
                        {!item.available && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/50 backdrop-blur-[1px] rounded-xl">
                                <div className="bg-red-500 text-white px-3 py-1.5 rounded-lg font-bold shadow-lg transform -rotate-12 flex items-center gap-1.5 text-sm">
                                    <Ban size={14} /> SOLD OUT
                                </div>
                            </div>
                        )}
                        <div className="relative aspect-video sm:h-36 mb-2.5 overflow-hidden rounded-lg bg-gray-100">
                             <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                             {item.isVegetarian && <span className="absolute top-2 right-2 bg-green-500 w-2.5 h-2.5 rounded-full border border-white shadow-sm" title="Vegetarian"></span>}
                        </div>
                        <div className="flex-1 flex flex-col justify-between px-1">
                            <div className="mb-2">
                                <h3 className="font-bold text-gray-800 text-sm md:text-lg leading-tight line-clamp-2">{item.name}</h3>
                                <p className="text-[10px] md:text-xs text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                            </div>
                            <div className="flex justify-between items-center mt-auto pt-1">
                                <span className="text-sm md:text-lg font-black text-gray-900">LKR {item.price}</span>
                                <button 
                                    disabled={!item.available}
                                    className={`p-1.5 md:p-2 rounded-lg transition-all duration-200 shadow-sm ${
                                        item.available 
                                        ? 'bg-orange-50 text-orange-600 group-hover:bg-orange-500 group-hover:text-white' 
                                        : 'bg-gray-200 text-gray-400'
                                    }`}
                                >
                                    <Plus size={16} className="md:w-5 md:h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {filteredItems.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12">
                    <ChefHat size={48} className="mb-4 opacity-20" />
                    <p className="text-lg font-medium">No items found</p>
                </div>
            )}
        </div>
      </div>

      {/* Floating Cart Button - Visible on Mobile and Tablet */}
      {!isCartOpen && cart.length > 0 && (
          <button 
            onClick={() => setIsCartOpen(true)} 
            className="lg:hidden fixed bottom-[90px] right-4 bg-orange-600 text-white p-3.5 rounded-full shadow-xl shadow-orange-600/30 z-40 flex items-center gap-2 animate-bounce-subtle active:scale-90 transition-transform"
          >
              <ShoppingBag size={24} />
              <span className="absolute -top-1 -right-1 bg-white text-orange-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-orange-600">
                  {cart.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
          </button>
      )}

      {/* Overlay Backdrop - Visible on Mobile and Tablet */}
      {isCartOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/60 z-30 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />
      )}

      {/* RIGHT: Cart Sidebar (Responsive Drawer on Mobile/Tablet) */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl flex flex-col z-40 transform transition-transform duration-300 ease-out lg:relative lg:translate-x-0 lg:z-0 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
         
         {/* Mobile/Tablet Header for Cart */}
         <div className="lg:hidden p-4 border-b bg-orange-600 text-white flex items-center justify-between shadow-md">
             <h2 className="font-bold text-lg flex items-center gap-2">
                 <ShoppingBag size={20} /> Current Order
             </h2>
             <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-orange-700 rounded-lg transition-colors">
                 <ArrowLeft size={24} />
             </button>
         </div>

         {/* Desktop Header */}
         <div className="hidden lg:block p-5 border-b bg-white">
             <div className="flex justify-between items-center mb-1">
                <h2 className="text-xl font-extrabold text-gray-800">Current Order</h2>
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Dine In</span>
             </div>
             <p className="text-xs text-gray-400 font-medium">Table #3 • Order #New</p>
         </div>

         {/* Cart Items */}
         <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 bg-gray-50">
             {cart.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                     <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                        <ShoppingBag size={32} className="opacity-50" />
                     </div>
                     <div className="text-center">
                        <p className="font-medium">Cart is empty</p>
                        <p className="text-xs mt-1">Select items from the menu</p>
                     </div>
                 </div>
             ) : (
                 cart.map(item => (
                     <div key={item.id} className="flex flex-col gap-2 p-3 bg-white rounded-xl border border-gray-100 shadow-sm group">
                         <div className="flex items-center gap-3">
                             <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                 <img src={item.image} className="w-full h-full object-cover" />
                             </div>
                             <div className="flex-1 min-w-0">
                                 <h4 className="font-bold text-sm text-gray-800 truncate">{item.name}</h4>
                                 <p className="text-xs text-gray-500 font-mono">LKR {item.price}</p>
                             </div>
                             <div className="flex items-center space-x-2">
                                 <div className="flex items-center bg-gray-100 rounded-lg h-8">
                                     <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-full flex items-center justify-center hover:bg-gray-200 rounded-l-lg text-gray-600 transition"><Minus size={12}/></button>
                                     <span className="w-6 text-center font-bold text-xs">{item.quantity}</span>
                                     <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-full flex items-center justify-center hover:bg-gray-200 rounded-r-lg text-gray-600 transition"><Plus size={12}/></button>
                                 </div>
                                 <div className="text-right w-16">
                                     <span className="font-bold text-sm block">{(item.price * item.quantity).toLocaleString()}</span>
                                 </div>
                                 <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1"><Trash2 size={16} /></button>
                             </div>
                         </div>
                         
                         {/* Notes Section */}
                         <div className="flex justify-between items-center pt-1 border-t border-dashed border-gray-100 mt-1">
                             <div className="text-[10px] text-gray-500 italic max-w-[200px] truncate">
                                 {item.notes ? `Note: ${item.notes}` : 'No notes'}
                             </div>
                             <button 
                                onClick={() => addNoteToItem(item.id)}
                                className="text-[10px] flex items-center gap-1 text-blue-500 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                             >
                                 <Edit3 size={10} /> {item.notes ? 'Edit' : 'Add Note'}
                             </button>
                         </div>
                     </div>
                 ))
             )}
         </div>

         {/* Footer Totals */}
         <div className="p-4 md:p-6 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe">
             <div className="space-y-3 mb-4 md:mb-6">
                 <div className="flex justify-between text-gray-500 text-sm">
                     <span className="font-medium">Subtotal</span>
                     <span className="font-mono">LKR {subtotal.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between text-gray-500 text-sm items-center">
                     <span className="font-medium">Discount</span>
                     <div className="flex items-center space-x-1">
                        {[0, 5, 10].map(d => (
                            <button 
                                key={d} 
                                onClick={() => setDiscountPercent(d)}
                                className={`text-[10px] w-8 h-6 flex items-center justify-center rounded transition-all ${discountPercent === d ? 'bg-orange-500 text-white font-bold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                {d}%
                            </button>
                        ))}
                     </div>
                 </div>
                 {discountAmount > 0 && (
                    <div className="flex justify-between text-red-500 text-sm">
                        <span>Discount Amount</span>
                        <span>- LKR {discountAmount.toLocaleString()}</span>
                    </div>
                 )}
                 <div className="flex justify-between text-xl md:text-2xl font-black text-gray-900 pt-4 border-t border-dashed border-gray-200 mt-2">
                     <span>Total</span>
                     <span>LKR {total.toLocaleString()}</span>
                 </div>
             </div>
             
             <div className="grid grid-cols-2 gap-3">
                 <button onClick={clearCart} className="py-3 md:py-4 rounded-xl border-2 border-gray-100 font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition">Cancel</button>
                 <button 
                    onClick={() => setIsPaymentModalOpen(true)} 
                    disabled={cart.length === 0}
                    className="py-3 md:py-4 rounded-xl bg-orange-600 text-white font-bold shadow-lg shadow-orange-200 hover:bg-orange-700 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all transform active:scale-95"
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