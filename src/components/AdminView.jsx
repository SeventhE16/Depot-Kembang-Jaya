import React, { useState, useEffect } from 'react';
import { getProducts, addProduct, deleteProduct } from '../utils/productManager';
import { Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminView() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', image: '' });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      alert("Mohon isi semua field termasuk gambar");
      return;
    }
    const added = addProduct({
      name: newProduct.name,
      price: parseInt(newProduct.price),
      image: newProduct.image
    });
    setProducts([...products, added]);
    setNewProduct({ name: '', price: '', image: '' });
    setIsAdding(false);
  };

  const handleDelete = (id) => {
    if(confirm("Yakin ingin menghapus produk ini?")) {
      deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Manajemen Produk</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-amber-700 transition"
        >
          <Plus size={20} /> Tambah Produk
        </button>
      </div>

      {isAdding && (
        <motion.form 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6"
          onSubmit={handleAdd}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Produk</label>
              <input 
                type="text" 
                value={newProduct.name}
                onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                placeholder="Cth: Kayu Jati"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Harga per Item/Kubik (Rp)</label>
              <input 
                type="number" 
                value={newProduct.price}
                onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                placeholder="Cth: 1500000"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Gambar Produk</label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center h-32 relative overflow-hidden bg-slate-50">
              {newProduct.image ? (
                <img src={newProduct.image} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
              ) : (
                <>
                  <ImageIcon className="text-slate-400 mb-2" size={32} />
                  <span className="text-sm text-slate-500">Klik untuk upload gambar</span>
                </>
              )}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
              >
                Batal
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
              >
                Simpan Produk
              </button>
            </div>
          </div>
        </motion.form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            <div className="h-48 overflow-hidden bg-slate-100 relative">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-800">{product.name}</h3>
                <p className="text-amber-600 font-semibold mt-1">
                  Rp {product.price.toLocaleString('id-ID')}
                </p>
              </div>
              <button 
                onClick={() => handleDelete(product.id)}
                className="mt-4 flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition w-full border border-red-100"
              >
                <Trash2 size={16} /> Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
