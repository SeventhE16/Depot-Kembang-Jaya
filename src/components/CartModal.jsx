import React, { useState, useEffect } from 'react';
import { X, MapPin, Phone, User, Loader2, Minus, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDistance, calculateShippingCost } from '../utils/geocoding';

export default function CartModal({ cart, setCart, onClose }) {
  const [formData, setFormData] = useState({ name: '', address: '', phone: '' });
  const [distanceInfo, setDistanceInfo] = useState({ distance: null, loading: false, error: null });
  const [debouncedAddress, setDebouncedAddress] = useState('');

  // Handle quantity changes
  const updateQuantity = (index, delta) => {
    const newCart = [...cart];
    newCart[index].quantity = Math.max(1, newCart[index].quantity + delta);
    if (newCart[index].type === 'Satuan' && newCart[index].quantity > 53) newCart[index].quantity = 53;
    setCart(newCart);
  };

  const removeItem = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  // Debounce address input for geocoding
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAddress(formData.address);
    }, 1500);
    return () => clearTimeout(timer);
  }, [formData.address]);

  // Trigger geocoding
  useEffect(() => {
    const fetchDistance = async () => {
      if (debouncedAddress.length < 5) {
        setDistanceInfo({ distance: null, loading: false, error: null });
        return;
      }
      setDistanceInfo(prev => ({ ...prev, loading: true, error: null }));
      const result = await getDistance(debouncedAddress);
      
      if (result.success) {
        setDistanceInfo({ distance: result.distance, loading: false, error: null });
      } else {
        setDistanceInfo({ distance: null, loading: false, error: result.error });
      }
    };
    fetchDistance();
  }, [debouncedAddress]);

  // Calculation
  const totalItemPrice = cart.reduce((acc, item) => {
    let multiplier = item.quantity;
    if (item.type === 'Setengah Kubik') multiplier = 0.5;
    return acc + (item.product.price * multiplier);
  }, 0);

  const shippingCost = distanceInfo.distance !== null 
    ? calculateShippingCost(totalItemPrice, distanceInfo.distance)
    : 0;

  const grandTotal = totalItemPrice + shippingCost;

  // Checkout Handler
  const handleCheckout = () => {
    if (!formData.name || !formData.address || !formData.phone) {
      alert("Mohon lengkapi data penerima");
      return;
    }
    
    let orderText = `Nama Penerima: ${formData.name}\n`;
    orderText += `Alamat: ${formData.address}\n`;
    orderText += `Nomor Telepon: ${formData.phone}\n`;
    if (distanceInfo.distance) {
      orderText += `Jarak Pengiriman: ${distanceInfo.distance.toFixed(1)} km\n`;
    }
    orderText += `\nPesanan:\n`;
    
    cart.forEach(item => {
      let qtyText = item.type === 'Setengah Kubik' ? 'Setengah Kubik' : `${item.quantity} ${item.type === 'Kubik' ? 'Kubik' : 'Pcs'}`;
      orderText += `- ${item.product.name} (${qtyText})\n`;
    });

    orderText += `\nTotal Harga Barang: Rp ${totalItemPrice.toLocaleString('id-ID')}\n`;
    orderText += `Ongkos Kirim: Rp ${shippingCost.toLocaleString('id-ID')}\n`;
    orderText += `Total Keseluruhan: Rp ${grandTotal.toLocaleString('id-ID')}`;

    const encoded = encodeURIComponent(orderText);
    window.open(`https://wa.me/6281237965000?text=${encoded}`, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
        >
          {/* Cart Items Section */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50 border-r border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Keranjang Belanja</h2>
              <button onClick={onClose} className="md:hidden p-2 text-slate-500 bg-slate-200 rounded-full">
                <X size={20} />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="text-center text-slate-500 py-12">
                Keranjang Anda kosong
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-4">
                    <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded-lg" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-slate-800">{item.product.name}</h4>
                        <p className="text-sm text-slate-500">Format: {item.type}</p>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-semibold text-amber-600">
                           Rp {(item.product.price * (item.type === 'Setengah Kubik' ? 0.5 : item.quantity)).toLocaleString('id-ID')}
                        </span>
                        
                        {item.type !== 'Setengah Kubik' && (
                          <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1 border border-slate-200">
                            <button onClick={() => updateQuantity(index, -1)} className="p-1 hover:bg-white rounded"><Minus size={14}/></button>
                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(index, 1)} className="p-1 hover:bg-white rounded"><Plus size={14}/></button>
                          </div>
                        )}
                      </div>
                    </div>
                    <button onClick={() => removeItem(index)} className="text-red-400 hover:text-red-600 self-start p-1">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkout Form Section */}
          <div className="flex-1 p-6 flex flex-col h-full bg-white relative">
            <button onClick={onClose} className="hidden md:block absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition">
              <X size={20} />
            </button>
            
            <h3 className="text-xl font-bold text-slate-800 mb-6">Informasi Pengiriman</h3>
            
            <div className="space-y-4 flex-1 overflow-y-auto pr-2">
              <div>
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-1"><User size={16}/> Nama Penerima</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-1"><Phone size={16}/> Nomor Telepon / WA</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="0812xxxxxx"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-1"><MapPin size={16}/> Alamat Lengkap</label>
                <textarea 
                  rows="3"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                  placeholder="Ketik alamat pengiriman lengkap... (Otomatis hitung jarak)"
                ></textarea>
                
                {/* Geocoding Status */}
                <div className="mt-2 text-sm">
                  {distanceInfo.loading && <span className="flex items-center gap-2 text-blue-600"><Loader2 size={14} className="animate-spin" /> Menghitung jarak...</span>}
                  {distanceInfo.error && <span className="text-amber-600">{distanceInfo.error}. Ongkir akan dihitung manual nanti.</span>}
                  {distanceInfo.distance !== null && !distanceInfo.loading && (
                    <span className="text-emerald-600 font-medium">Jarak ke lokasi: {distanceInfo.distance.toFixed(1)} km</span>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="mt-6 border-t border-slate-100 pt-6 space-y-3 bg-white">
              <div className="flex justify-between text-slate-600">
                <span>Total Harga Barang</span>
                <span className="font-semibold text-slate-800">Rp {totalItemPrice.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Ongkos Kirim</span>
                <span className="font-semibold text-slate-800">
                  {distanceInfo.distance === null ? 'Menunggu Alamat...' : `Rp ${shippingCost.toLocaleString('id-ID')}`}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-slate-100">
                <span>Total Pembayaran</span>
                <span className="text-amber-600">Rp {grandTotal.toLocaleString('id-ID')}</span>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-white py-3.5 rounded-xl font-bold text-lg transition shadow-lg shadow-emerald-500/30"
              >
                Checkout WhatsApp
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
