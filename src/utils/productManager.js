// Initial dummy products if local storage is empty
const defaultProducts = [
  {
    id: 1,
    name: "Kayu Glugu",
    price: 27700, // Harga satuan
    halfCubicUnits: 54, // 54 pcs per 1/2 kubik
    image: "/assets/kayumahoni.jpg"
  },
  {
    id: 2,
    name: "Kayu Mahoni",
    price: 31250, 
    halfCubicUnits: 64, 
    image: "/assets/kayuglugu.jpg"
  },
  {
    id: 3,
    name: "Kayu Sengon",
    price: 20000, 
    halfCubicUnits: 50, 
    image: "/assets/kayusengon.jpg"
  }
];

export const getProducts = () => {
  const stored = localStorage.getItem("depot_products_v3");
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem("depot_products_v3", JSON.stringify(defaultProducts));
  return defaultProducts;
};

export const addProduct = (product) => {
  const products = getProducts();
  const newProduct = { ...product, id: Date.now() };
  products.push(newProduct);
  localStorage.setItem("depot_products_v3", JSON.stringify(products));
  return newProduct;
};

export const deleteProduct = (id) => {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  localStorage.setItem("depot_products_v3", JSON.stringify(filtered));
};
