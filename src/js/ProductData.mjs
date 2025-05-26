// const baseURL = "/json"; // Base URL for the JSON files
// API endpoint to fetch product data
const baseURL = import.meta.env.VITE_SERVER_URL;

// Function to fetch product data from the server
export default class ProductData {
  async getDAta(category) {
    // Fetch product data based on the category
    const response = await fetch(`${baseURL}products/search/${category} `); // Fetch the product data from the server
    const data = await convertToJson(response); // Convert the response to JSON
    return data.Result; // Return the Result array from the JSON data
  }
}

// Function to find a specific product by id
export async function findProductById(id) {
  const products = await fetchProductData();
  return products.find((item) => item.Id === id);
}

// Function to get a list of products in a category
export async function getProductsByCategory(category = "tents") {
  const products = await fetchProductData(category);
  return products;
}
