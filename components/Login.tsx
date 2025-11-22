import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { ChefHat, UserCircle } from 'lucide-react';

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
      
      const user: User = {
        id: 'u1',
        name: username,
        role: role,
        avatarUrl: 'https://picsum.photos/seed/user/100/100'
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
            <div className="mx-auto bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <ChefHat className="text-white w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">LKR POS System</h1>
            <p className="text-gray-300">Enter your credentials to access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-500 outline-none transition-all"
                  placeholder="admin, manager, or cashier"
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
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-500 outline-none transition-all"
                placeholder="Any password (e.g. 123)"
              />
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Sign In
            </button>
          </form>
          
          <div className="mt-6 text-center text-xs text-gray-500">
             Tip: Use <strong>admin</strong> for full access. Any password works.
          </div>
        </div>
    </div>
  );
};

export default Login;