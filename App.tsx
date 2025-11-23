import React, { useState, useEffect } from 'react';
import { User, UserRole, Order, MenuItem } from './types';
import { INITIAL_MENU_ITEMS, SHOP_LOGO } from './constants';
import Login from './components/Login';
import POS from './components/POS';
import Dashboard from './components/Dashboard';
import MenuManagement from './components/MenuManagement';
import KitchenDisplay from './components/KitchenDisplay';
import { LayoutDashboard, ShoppingCart, List, LogOut, ChefHat } from 'lucide-react';

enum View {
  POS = 'POS',
  DASHBOARD = 'DASHBOARD',
  MENU = 'MENU',
  KITCHEN = 'KITCHEN'
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>(View.POS);
  
  // State initialization with LocalStorage check
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('pos_orders');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('pos_menu_items');
    return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
  });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('pos_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('pos_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  const handlePlaceOrder = (newOrder: Order) => {
    // Set initial status to PENDING for the kitchen
    const orderForKitchen = { ...newOrder, status: 'PENDING' } as Order;
    setOrders(prev => [...prev, orderForKitchen]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const handleLogin = (u: User) => {
      setUser(u);
      // Default view based on role
      if(u.role === UserRole.ADMIN || u.role === UserRole.MANAGER) {
          setCurrentView(View.DASHBOARD);
      } else if (u.role === UserRole.KITCHEN) {
          setCurrentView(View.KITCHEN);
      } else {
          setCurrentView(View.POS);
      }
  };

  const handleLogout = () => {
      setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const isAdminOrManager = user.role === UserRole.ADMIN || user.role === UserRole.MANAGER;
  const isKitchen = user.role === UserRole.KITCHEN;

  const NavItem = ({ view, icon: Icon, label }: { view: View, icon: any, label: string }) => (
    <button 
        onClick={() => setCurrentView(view)}
        className={`p-3 rounded-xl flex flex-col md:flex-row items-center justify-center transition-all duration-200 ${
            currentView === view 
            ? 'bg-orange-600 text-white shadow-lg scale-105 md:scale-105' 
            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
        }`}
        title={label}
    >
        <Icon size={24} className="mb-1 md:mb-0" />
    </button>
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
      
      {/* Desktop Sidebar Navigation - Hidden on Mobile */}
      <div className="hidden md:flex w-20 bg-gray-900 flex-col items-center py-6 space-y-8 z-50 shadow-xl">
          <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-lg shadow-orange-500/20 p-1">
             <img src={SHOP_LOGO} alt="Logo" className="w-full h-full object-contain" />
          </div>

          <nav className="flex-1 flex flex-col space-y-4 w-full px-2">
              {!isKitchen && <NavItem view={View.POS} icon={ShoppingCart} label="POS" />}
              {isKitchen && <NavItem view={View.KITCHEN} icon={ChefHat} label="Kitchen Display" />}
              
              {isAdminOrManager && (
                  <>
                    <NavItem view={View.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
                    <NavItem view={View.MENU} icon={List} label="Menu" />
                    <NavItem view={View.KITCHEN} icon={ChefHat} label="Kitchen Monitor" />
                  </>
              )}
          </nav>

          <button 
            onClick={handleLogout}
            className="p-3 text-red-400 hover:bg-gray-800 hover:text-red-300 rounded-xl transition-colors"
            title="Logout"
          >
              <LogOut size={24} />
          </button>
      </div>

      {/* Mobile Bottom Navigation - Hidden on Desktop */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 z-50 flex justify-around items-center px-2 py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)] pb-safe">
           {!isKitchen && <NavItem view={View.POS} icon={ShoppingCart} label="POS" />}
           {isKitchen && <NavItem view={View.KITCHEN} icon={ChefHat} label="Kitchen" />}
           
           {isAdminOrManager && (
                <>
                  <NavItem view={View.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
                  <NavItem view={View.MENU} icon={List} label="Menu" />
                  <NavItem view={View.KITCHEN} icon={ChefHat} label="Kitchen" />
                </>
           )}
           
           <button 
                onClick={handleLogout}
                className="p-3 text-red-400 rounded-xl"
            >
              <LogOut size={24} />
           </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 h-full relative overflow-hidden bg-gray-50 flex flex-col">
          {/* Content Wrapper with bottom padding for mobile nav */}
          <div className="flex-1 overflow-hidden relative pb-[80px] md:pb-0">
            {currentView === View.POS && (
                <POS 
                    user={user} 
                    items={menuItems} 
                    onPlaceOrder={handlePlaceOrder} 
                />
            )}
            {currentView === View.DASHBOARD && (
                <Dashboard orders={orders} />
            )}
            {currentView === View.MENU && (
                <MenuManagement 
                    items={menuItems} 
                    onUpdateItems={setMenuItems} 
                />
            )}
            {currentView === View.KITCHEN && (
                <KitchenDisplay 
                    orders={orders} 
                    onUpdateStatus={updateOrderStatus} 
                />
            )}
          </div>
      </div>
    </div>
  );
};

export default App;