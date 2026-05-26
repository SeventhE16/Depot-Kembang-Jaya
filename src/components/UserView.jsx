import React, { useState, useEffect } from 'react';
import { getProducts } from '../utils/productManager';
import CartModal from './CartModal';
import { ShoppingCart, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UserView({ cart, setCart }) {
  const [products, setProducts] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const addToCart = (product, quantity, type) => {
    const existing = cart.find(item => item.product.id === product.id && item.type === type);
    if (existing) {
      setCart(cart.map(item => 
        item === existing ? { ...item, quantity: item.quantity + quantity } : item
      ));
    } else {
      setCart([...cart, { product, quantity, type }]);
    }
    setIsCartOpen(true);
  };

  const cartItemsCount = cart.reduce((acc, item) => acc + (item.type === 'Setengah Kubik' ? 1 : Number(item.quantity)), 0);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative rounded-3xl overflow-hidden bg-amber-900 text-white"
      >
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1572983574751-248cd90a3c42?q=80&w=1200&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="relative px-8 py-24 md:py-32 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Pusat Kayu Berkualitas untuk Proyek Anda
          </h1>
          <p className="text-lg md:text-xl text-amber-50 mb-8">
            Depot Kayu Kembang Jaya menyediakan Kayu Glugu, Sengon, Mahoni, dan lainnya dengan harga bersaing.
          </p>
          <button 
            onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
            className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-8 py-3 rounded-full font-bold transition transform hover:scale-105"
          >
            Lihat Produk
          </button>
        </div>
      </motion.section>

      {/* Floating Cart Button */}
      <button 
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-8 right-8 bg-slate-900 text-white p-4 rounded-full shadow-2xl hover:bg-slate-800 transition z-40 flex items-center gap-2"
      >
        <ShoppingCart size={24} />
        {cartItemsCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
            {cartItemsCount}
          </span>
        )}
      </button>

      {/* Products Section */}
      <section id="products" className="scroll-mt-24">
        <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Produk Kayu Kami</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={product.id} 
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition group"
            >
              <div className="h-56 overflow-hidden bg-slate-100 relative">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl text-slate-800 mb-1">{product.name}</h3>
                <p className="text-amber-600 font-bold text-lg mb-4">
                  Rp {product.price.toLocaleString('id-ID')}
                </p>
                <ProductOrderForm product={product} onAdd={addToCart} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Cart Modal */}
      {isCartOpen && (
        <CartModal 
          cart={cart} 
          setCart={setCart} 
          onClose={() => setIsCartOpen(false)} 
        />
      )}
    </div>
  );
}

function ProductOrderForm({ product, onAdd }) {
  const [type, setType] = useState('Satuan');
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    onAdd(product, quantity, type);
  };

  return (
    <div className="space-y-3 bg-slate-50 p-4 rounded-xl">
      <div className="flex gap-2 text-sm">
        <label className="flex items-center gap-1 cursor-pointer">
          <input type="radio" checked={type === 'Satuan'} onChange={() => {setType('Satuan'); setQuantity(1);}} />
          Satuan
        </label>
        <label className="flex items-center gap-1 cursor-pointer">
          <input type="radio" checked={type === 'Setengah Kubik'} onChange={() => {setType('Setengah Kubik'); setQuantity(1);}} />
          1/2 Kubik
        </label>
        <label className="flex items-center gap-1 cursor-pointer">
          <input type="radio" checked={type === 'Kubik'} onChange={() => {setType('Kubik'); setQuantity(1);}} />
          Kubik
        </label>
      </div>

      <div className="flex items-center gap-2">
        {type !== 'Setengah Kubik' && (
          <div className="flex-1 flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
            <button 
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >-</button>
            <input 
              type="number" 
              className="w-full text-center outline-none py-1"
              value={quantity}
              onChange={(e) => setQuantity(Math.min(type === 'Satuan' ? 53 : 999, Math.max(1, parseInt(e.target.value) || 1)))}
              max={type === 'Satuan' ? 53 : 999}
            />
            <button 
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200"
              onClick={() => setQuantity(Math.min(type === 'Satuan' ? 53 : 999, quantity + 1))}
            >+</button>
          </div>
        )}
        <button 
          onClick={handleAdd}
          className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition flex items-center justify-center flex-1 font-semibold gap-1"
        >
          <Plus size={18} /> Tambah
        </button>
      </div>
    </div>
  );
}
