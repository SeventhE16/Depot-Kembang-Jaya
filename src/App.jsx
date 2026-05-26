import React, { useState } from 'react';
import UserView from './components/UserView';
import AdminView from './components/AdminView';
import { ShoppingCart, Settings } from 'lucide-react';

function App() {
  const [view, setView] = useState('user'); // 'user' | 'admin'
  const [cart, setCart] = useState([]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center cursor-pointer" onClick={() => setView('user')}>
              <span className="text-2xl font-bold text-amber-600">Depot Kayu</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setView('user')}
                className={`p-2 rounded-md ${view === 'user' ? 'text-amber-600 bg-amber-50' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                Beranda
              </button>
              <button 
                onClick={() => setView('admin')}
                className={`p-2 rounded-md ${view === 'admin' ? 'text-amber-600 bg-amber-50' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'user' ? (
          <UserView cart={cart} setCart={setCart} />
        ) : (
          <AdminView />
        )}
      </main>
    </div>
  );
}

export default App;
