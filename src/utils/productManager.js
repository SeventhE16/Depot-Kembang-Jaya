// Initial dummy products if local storage is empty
const defaultProducts = [
  {
    id: 1,
    name: "Kayu Glugu",
    price: 27700, // Harga satuan
    halfCubicUnits: 54, // 54 pcs per 1/2 kubik
    image: "https://images.unsplash.com/photo-1610486749176-0f73f5ffea82?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Kayu Mahoni",
    price: 31250, 
    halfCubicUnits: 64, 
    image: "https://images.unsplash.com/photo-1598288277259-33bfa8618eb3?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Kayu Sengon",
    price: 20000, 
    halfCubicUnits: 50, 
    image: "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?q=80&w=600&auto=format&fit=crop"
  }
];

export const getProducts = () => {
  const stored = localStorage.getItem("depot_products_v2");
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem("depot_products_v2", JSON.stringify(defaultProducts));
  return defaultProducts;
};

export const addProduct = (product) => {
  const products = getProducts();
  const newProduct = { ...product, id: Date.now() };
  products.push(newProduct);
  localStorage.setItem("depot_products_v2", JSON.stringify(products));
  return newProduct;
};

export const deleteProduct = (id) => {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  localStorage.setItem("depot_products_v2", JSON.stringify(filtered));
};
