const baseURL = "https://wdd330-backend.onrender.com";

// Function to fetch product data for a category from the API
async function fetchProductsByCategory(category = "tents") {
  const response = await fetch(`${baseURL}/products/search/${category}`);
  const data = await response.json();
  return data.Result;
}

// Function to find a specific product by id
export async function findProductById(id) {
  const response = await fetch(`${baseURL}/product/${id}`);
  const data = await response.json();
  return data.Result;
}

// Function to get a list of products in a category
export async function getProductsByCategory(category = "tents") {
  const products = await fetchProductsByCategory(category);
  return products;
}
