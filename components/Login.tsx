import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { ChefHat, UserCircle } from 'lucide-react';
import { SHOP_NAME } from '../constants';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      // Mock Login Logic
      let role = UserRole.CASHIER;
      if (username.toLowerCase().includes('admin')) role = UserRole.ADMIN;
      if (username.toLowerCase().includes('manager')) role = UserRole.MANAGER;
      if (username.toLowerCase().includes('kitchen')) role = UserRole.KITCHEN;
      
      const user: User = {
        id: 'u1',
        name: username,
        role: role,
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
      };
      onLogin(user);
    } else {
      setError('Please enter valid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20"></div>
        
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20 relative z-10">
          <div className="text-center mb-8">
            <div className="mx-auto bg-orange-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-orange-900/50">
              <ChefHat className="text-white w-12 h-12" />
            </div>
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight">{SHOP_NAME}</h1>
            <p className="text-orange-200 font-bold tracking-widest text-sm uppercase">சாப்பாட்டுக் கடை</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-500 outline-none transition-all"
                  placeholder="admin, kitchen, or cashier"
                />
                <UserCircle className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-500 outline-none transition-all"
                placeholder="Any password (e.g. 123)"
              />
            </div>

            {error && <p className="text-red-400 text-sm text-center bg-red-900/30 py-2 rounded-lg border border-red-500/30">{error}</p>}

            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-900/50 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Sign In
            </button>
          </form>
          
          <div className="mt-6 text-center text-xs text-gray-500">
             Try <strong>admin</strong> for full access or <strong>kitchen</strong> for KDS.
          </div>
        </div>
    </div>
  );
};

export default Login;