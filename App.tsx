import React, { useState } from 'react';
import { User, UserRole } from './types';
import Login from './components/Login';
import POS from './components/POS';
import Dashboard from './components/Dashboard';
import MenuManagement from './components/MenuManagement';
import { LayoutDashboard, ShoppingCart, List, LogOut } from 'lucide-react';

enum View {
  POS = 'POS',
  DASHBOARD = 'DASHBOARD',
  MENU = 'MENU'
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>(View.POS);

  if (!user) {
    return <Login onLogin={(u) => {
        setUser(u);
        // Default view based on role
        if(u.role === UserRole.ADMIN || u.role === UserRole.MANAGER) {
            setCurrentView(View.DASHBOARD);
        } else {
            setCurrentView(View.POS);
        }
    }} />;
  }

  const handleLogout = () => {
      setUser(null);
  };

  const isAdminOrManager = user.role === UserRole.ADMIN || user.role === UserRole.MANAGER;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
      {/* Sidebar Navigation */}
      <div className="w-20 bg-gray-900 flex flex-col items-center py-6 space-y-8 z-50">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-500/50">
              L
          </div>

          <nav className="flex-1 flex flex-col space-y-4 w-full px-2">
              <button 
                onClick={() => setCurrentView(View.POS)}
                className={`p-3 rounded-xl flex justify-center transition-all duration-200 ${currentView === View.POS ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                title="POS"
              >
                  <ShoppingCart size={24} />
              </button>

              {isAdminOrManager && (
                  <>
                    <button 
                        onClick={() => setCurrentView(View.DASHBOARD)}
                        className={`p-3 rounded-xl flex justify-center transition-all duration-200 ${currentView === View.DASHBOARD ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                        title="Dashboard"
                    >
                        <LayoutDashboard size={24} />
                    </button>
                    <button 
                        onClick={() => setCurrentView(View.MENU)}
                        className={`p-3 rounded-xl flex justify-center transition-all duration-200 ${currentView === View.MENU ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                        title="Menu Management"
                    >
                        <List size={24} />
                    </button>
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

      {/* Main Content Area */}
      <div className="flex-1 h-full relative overflow-hidden">
          {currentView === View.POS && <POS user={user} />}
          {currentView === View.DASHBOARD && <Dashboard />}
          {currentView === View.MENU && <MenuManagement />}
      </div>
    </div>
  );
};

export default App;