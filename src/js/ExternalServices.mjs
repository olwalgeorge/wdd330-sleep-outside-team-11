const baseURL = "https://wdd330-backend.onrender.com";

export default class ExternalServices {
  constructor() {
    // Initialize any properties if needed
  }

  // Method to fetch product data for a category from the API
  async getProductsByCategory(category = "tents") {
    const response = await fetch(`${baseURL}/products/search/${category}`);
    const data = await response.json();
    return data.Result;
  }

  // Method to find a specific product by id
  async findProductById(id) {
    const response = await fetch(`${baseURL}/product/${id}`);
    const data = await response.json();
    return data.Result;
  }

  // Method to submit checkout order
  async checkout(order) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    };
    
    const response = await fetch(`${baseURL}/checkout`, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  }
}

// Export functions for backward compatibility and convenience
const externalServices = new ExternalServices();

export async function findProductById(id) {
  return await externalServices.findProductById(id);
}

export async function getProductsByCategory(category = "tents") {
  return await externalServices.getProductsByCategory(category);
}
