import { useState } from 'react';
import UserView from './components/UserView';
import AdminView from './components/AdminView';
import { Settings, LogOut, Package } from 'lucide-react';
import logoDepotKayu from './assets/Depotkayu.jpg';

function App() {
  const [authStatus, setAuthStatus] = useState('pending'); // 'pending' | 'visitor' | 'admin'
  const [view, setView] = useState('user'); // 'user' | 'admin'
  const [cart, setCart] = useState([]);
  
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (loginForm.username === 'Kembangjaya' && loginForm.password === 'depotkayukembangjaya') {
      setAuthStatus('admin');
      setView('admin');
    } else {
      setLoginError('Username atau Password salah!');
    }
  };

  if (authStatus === 'pending') {
    return (
      <div className="min-h-screen bg-[#8f1164] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-[#c61872] text-white">
            <h1 className="text-4xl font-extrabold mb-4">Depot Kayu<br/>Kembang Jaya</h1>
            <p className="text-lg opacity-90">Sistem informasi pemesanan kayu kualitas terbaik untuk segala kebutuhan konstruksi Anda.</p>
          </div>
          <div className="md:w-1/2 p-8 md:p-12 bg-[#ffffff]">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Masuk ke Sistem</h2>
            
            <div className="space-y-6">
              <button 
                onClick={() => { setAuthStatus('visitor'); setView('user'); }}
                className="w-full bg-[#c61872] hover:bg-[#8f1164] text-white font-bold py-3 px-4 rounded-xl transition duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Package size={20} />
                Masuk Sebagai Pengunjung
              </button>
              
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">atau login Admin</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                {loginError && <div className="text-red-500 text-sm font-medium">{loginError}</div>}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username Admin</label>
                  <input 
                    type="text" 
                    value={loginForm.username}
                    onChange={e => setLoginForm({...loginForm, username: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#c61872] focus:border-[#c61872] outline-none"
                    placeholder="Masukkan username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input 
                    type="password" 
                    value={loginForm.password}
                    onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#c61872] focus:border-[#c61872] outline-none"
                    placeholder="Masukkan password"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-4 rounded-xl transition duration-300"
                >
                  Login Admin
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-[#ffffff] shadow-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('user')}>
              {/* Logo Placeholder */}
              <img src={logoDepotKayu} alt="Logo Depot Kayu" className="w-12 h-12 rounded-full border border-gray-300 object-cover" />
              <span className="text-2xl font-black text-[#c61872]">Depot Kayu</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setView('user')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${view === 'user' ? 'text-[#c61872] bg-pink-50' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                Beranda
              </button>
              
              {authStatus === 'admin' && (
                <button 
                  onClick={() => setView('admin')}
                  className={`p-2 rounded-lg transition flex items-center gap-2 ${view === 'admin' ? 'text-[#c61872] bg-pink-50' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <Settings size={20} />
                  <span className="hidden sm:inline font-semibold">Admin Panel</span>
                </button>
              )}

              <button 
                onClick={() => { setAuthStatus('pending'); setView('user'); }}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition ml-2"
                title="Keluar"
              >
                <LogOut size={20} />
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
