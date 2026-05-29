// Mock store coordinates (Desa Tangkil Tengah, Kedungwuni, Pekalongan)
const STORE_LAT = -6.915509; // Approximation for Kedungwuni, Pekalongan
const STORE_LON = 109.638541;

// Haversine formula to calculate straight-line distance in km
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c;
}

export async function getDistance(address) {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`, {
      headers: {
        'User-Agent': 'DepotKayuKembangJayaApp/1.0'
      }
    });
    const data = await response.json();
    
    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      const distance = calculateDistance(STORE_LAT, STORE_LON, parseFloat(lat), parseFloat(lon));
      return { success: true, distance, lat, lon };
    }
    return { success: false, error: "Alamat tidak ditemukan" };
  } catch (error) {
    return { success: false, error: "Terjadi kesalahan saat mencari alamat" };
  }
}

export function calculateShippingCost(totalPrice, distanceKm) {
  if (totalPrice >= 1500000) {
    return 0;
  }
  if (totalPrice >= 1000000 && totalPrice < 1500000) {
    if (distanceKm < 5) return 0;
    return 20000;
  }
  if (totalPrice < 1000000) {
    if (distanceKm < 5) return 20000;
    return 50000;
  }
  return 0;
}
