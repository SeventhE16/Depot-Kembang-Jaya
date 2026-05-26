// Initial dummy products if local storage is empty
const defaultProducts = [
  {
    id: 1,
    name: "Kayu Glugu",
    price: 1500000,
    image: "https://images.unsplash.com/photo-1610486749176-0f73f5ffea82?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Kayu Mahoni",
    price: 2000000,
    image: "https://images.unsplash.com/photo-1598288277259-33bfa8618eb3?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Kayu Sengon",
    price: 1000000,
    image: "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?q=80&w=600&auto=format&fit=crop"
  }
];

export const getProducts = () => {
  const stored = localStorage.getItem("depot_products");
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem("depot_products", JSON.stringify(defaultProducts));
  return defaultProducts;
};

export const addProduct = (product) => {
  const products = getProducts();
  const newProduct = { ...product, id: Date.now() };
  products.push(newProduct);
  localStorage.setItem("depot_products", JSON.stringify(products));
  return newProduct;
};

export const deleteProduct = (id) => {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  localStorage.setItem("depot_products", JSON.stringify(filtered));
};
