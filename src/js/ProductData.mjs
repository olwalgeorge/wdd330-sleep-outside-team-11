// API base URL from environment variable
const baseURL = import.meta.env.VITE_SERVER_URL;

// Helper function to convert response to JSON safely
async function convertToJson(response) {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// Fetch product data by category from API
async function fetchProductData(category) {
  const response = await fetch(`${baseURL}products/search/${category}`);
  const data = await convertToJson(response);
  return data.Result;
}

export default class ProductData {
  // Fetch product data by category
  async getData(category) {
    return await fetchProductData(category);
  }
}

// Fetch product by id from API
export async function findProductById(id) {
  const response = await fetch(`${baseURL}product/${id}`);
  const data = await convertToJson(response);
  return data.Result;
}

// Fetch products by category from API
export async function getProductsByCategory(category = "tents") {
  return await fetchProductData(category);
}
