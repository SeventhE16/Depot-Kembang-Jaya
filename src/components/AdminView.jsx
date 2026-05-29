import { useState, useEffect } from 'react';
import { getProducts, addProduct, deleteProduct } from '../utils/productManager';
import { Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminView() {
  const [products, setProducts] = useState(getProducts);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', halfCubicUnits: '', image: '' });
  const [isAdding, setIsAdding] = useState(false);



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
    if (!newProduct.name || !newProduct.price || !newProduct.halfCubicUnits || !newProduct.image) {
      alert("Mohon isi semua field termasuk gambar");
      return;
    }
    const added = addProduct({
      name: newProduct.name,
      price: parseInt(newProduct.price),
      halfCubicUnits: parseInt(newProduct.halfCubicUnits),
      image: newProduct.image
    });
    setProducts([...products, added]);
    setNewProduct({ name: '', price: '', halfCubicUnits: '', image: '' });
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
        <h2 className="text-3xl font-bold text-gray-800">Manajemen Produk</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-[#c61872] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[#8f1164] transition font-bold shadow-md"
        >
          <Plus size={20} /> Tambah Produk
        </button>
      </div>

      {isAdding && (
        <motion.form 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-8"
          onSubmit={handleAdd}
        >
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Produk</label>
              <input 
                type="text" 
                value={newProduct.name}
                onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#c61872] focus:border-[#c61872] outline-none"
                placeholder="Cth: Kayu Jati"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Harga Satuan (Rp)</label>
                <input 
                  type="number" 
                  value={newProduct.price}
                  onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#c61872] focus:border-[#c61872] outline-none"
                  placeholder="Cth: 25000"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Isi per 1/2 Kubik (Pcs)</label>
                <input 
                  type="number" 
                  value={newProduct.halfCubicUnits}
                  onChange={e => setNewProduct({...newProduct, halfCubicUnits: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#c61872] focus:border-[#c61872] outline-none"
                  placeholder="Cth: 54"
                />
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm text-blue-800">
              <p><strong>Info Perhitungan:</strong></p>
              <ul className="list-disc ml-5 mt-1">
                <li>Harga 1/2 Kubik = Harga Satuan × {newProduct.halfCubicUnits || 0}</li>
                <li>Harga 1 Kubik = Harga Satuan × {(newProduct.halfCubicUnits || 0) * 2}</li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Gambar Produk</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center h-48 relative overflow-hidden bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
              {newProduct.image ? (
                <img src={newProduct.image} alt="Preview" className="w-full h-full object-contain absolute inset-0 bg-white" />
              ) : (
                <>
                  <ImageIcon className="text-gray-400 mb-3" size={40} />
                  <span className="text-sm text-gray-500 font-medium">Klik untuk upload gambar</span>
                </>
              )}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                className="px-5 py-2.5 rounded-lg text-gray-600 font-medium hover:bg-gray-100 transition"
              >
                Batal
              </button>
              <button 
                type="submit" 
                className="px-5 py-2.5 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 shadow-md transition"
              >
                Simpan Produk
              </button>
            </div>
          </div>
        </motion.form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col group">
            <div className="h-48 overflow-hidden bg-gray-100 relative">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-xl text-gray-800">{product.name}</h3>
                <div className="mt-3 space-y-1">
                  <p className="text-[#c61872] font-bold text-lg border-b border-gray-100 pb-2 mb-2">
                    Rp {product.price.toLocaleString('id-ID')} <span className="text-sm font-normal text-gray-500">/ satuan</span>
                  </p>
                  <p className="text-sm text-gray-600 flex justify-between">
                    <span>Isi per 1/2 Kubik:</span> 
                    <span className="font-semibold">{product.halfCubicUnits} Pcs</span>
                  </p>
                  <p className="text-sm text-gray-600 flex justify-between">
                    <span>Estimasi Harga 1 Kubik:</span> 
                    <span className="font-semibold">Rp {(product.price * product.halfCubicUnits * 2).toLocaleString('id-ID')}</span>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(product.id)}
                className="mt-6 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 hover:border-red-200 px-4 py-2.5 rounded-xl transition w-full border border-gray-200 font-semibold"
              >
                <Trash2 size={18} /> Hapus Produk
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
