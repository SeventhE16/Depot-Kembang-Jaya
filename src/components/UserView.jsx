import { useState, useEffect } from 'react';
import { getProducts } from '../utils/productManager';
import CartModal from './CartModal';
import { ShoppingCart, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UserView({ cart, setCart }) {
  const [products, setProducts] = useState(getProducts);
  const [isCartOpen, setIsCartOpen] = useState(false);



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

  const cartItemsCount = cart.reduce((acc, item) => acc + Number(item.quantity), 0);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative rounded-3xl overflow-hidden bg-[#8f1164] text-white shadow-xl"
      >
        <div className="absolute inset-0">
          <img 
            src="/assets/gambardepan.jpg" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
        </div>
        <div className="relative px-8 py-24 md:py-32 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight text-white drop-shadow-md">
            Pusat Kayu Berkualitas untuk Proyek Anda
          </h1>
          <p className="text-lg md:text-xl text-pink-50 mb-8 drop-shadow">
            Depot Kayu Kembang Jaya menyediakan Kayu Glugu, Sengon, Mahoni, dan lainnya dengan harga bersaing.
          </p>
          <button 
            onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
            className="bg-[#c61872] hover:bg-pink-600 text-white px-8 py-3.5 rounded-full font-bold transition transform hover:scale-105 shadow-lg"
          >
            Lihat Produk
          </button>
        </div>
      </motion.section>

      {/* Floating Cart Button */}
      <button 
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-8 right-8 bg-[#c61872] text-white p-4 rounded-full shadow-2xl hover:bg-[#8f1164] transition z-30 flex items-center gap-2"
      >
        <ShoppingCart size={24} />
        {cartItemsCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-gray-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white">
            {cartItemsCount}
          </span>
        )}
      </button>

      {/* Products Section */}
      <section id="products" className="scroll-mt-24">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Produk Kayu Kami</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={product.id} 
              className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition group flex flex-col"
            >
              <div className="h-56 overflow-hidden bg-gray-100 relative">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-bold text-xl text-gray-800 mb-1">{product.name}</h3>
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

  // Kalkulasi harga berdasarkan pilihan
  let calculatedPrice = product.price;
  let labelQty = '';
  
  if (type === 'Satuan') {
    calculatedPrice = product.price;
    labelQty = '/ Pcs';
  } else if (type === 'Setengah Kubik') {
    calculatedPrice = product.price * product.halfCubicUnits;
    labelQty = '/ 1/2 Kubik';
  } else if (type === 'Kubik') {
    calculatedPrice = product.price * product.halfCubicUnits * 2;
    labelQty = '/ Kubik';
  }

  return (
    <div className="mt-2 flex flex-col flex-1 justify-between">
      <div className="mb-4">
        <p className="text-[#c61872] font-black text-2xl flex items-baseline gap-1">
          Rp {calculatedPrice.toLocaleString('id-ID')}
          <span className="text-sm font-normal text-gray-500">{labelQty}</span>
        </p>
      </div>

      <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
        <div className="flex gap-3 text-sm font-medium">
          <label className={`flex-1 flex items-center justify-center p-2 rounded-lg cursor-pointer transition border ${type === 'Satuan' ? 'bg-pink-50 border-[#c61872] text-[#c61872]' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            <input type="radio" className="hidden" checked={type === 'Satuan'} onChange={() => {setType('Satuan'); setQuantity(1);}} />
            Satuan
          </label>
          <label className={`flex-1 flex items-center justify-center p-2 rounded-lg cursor-pointer transition border ${type === 'Setengah Kubik' ? 'bg-pink-50 border-[#c61872] text-[#c61872]' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            <input type="radio" className="hidden" checked={type === 'Setengah Kubik'} onChange={() => {setType('Setengah Kubik'); setQuantity(1);}} />
            1/2 Kubik
          </label>
          <label className={`flex-1 flex items-center justify-center p-2 rounded-lg cursor-pointer transition border ${type === 'Kubik' ? 'bg-pink-50 border-[#c61872] text-[#c61872]' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            <input type="radio" className="hidden" checked={type === 'Kubik'} onChange={() => {setType('Kubik'); setQuantity(1);}} />
            Kubik
          </label>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-1/3 flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden shadow-sm">
            <button 
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >-</button>
            <input 
              type="number" 
              className="w-full text-center outline-none font-semibold text-gray-800"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            />
            <button 
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
              onClick={() => setQuantity(quantity + 1)}
            >+</button>
          </div>
          <button 
            onClick={handleAdd}
            className="flex-1 bg-gray-900 text-white px-4 py-2.5 rounded-lg hover:bg-gray-800 transition flex items-center justify-center font-bold gap-2 shadow-md"
          >
            <Plus size={18} /> Tambah
          </button>
        </div>
      </div>
    </div>
  );
}
