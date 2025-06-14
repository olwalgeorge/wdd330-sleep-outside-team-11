const baseURL = "https://wdd330-backend.onrender.com";

// Helper function to convert response to JSON with detailed error handling
async function convertToJson(res) {
  const jsonResponse = await res.json();
  if (res.ok) {
    return jsonResponse;
  } else {
    throw { name: "servicesError", message: jsonResponse };
  }
}

export default class ExternalServices {
  constructor() {
    // Initialize any properties if needed
  }  // Method to fetch product data for a category from the API
  async getProductsByCategory(category = "tents") {
    const response = await fetch(`${baseURL}/products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  // Method to search products by query string - fetches from all categories and filters locally
  async searchProducts(query) {
    if (!query || !query.trim()) {
      return [];
    }

    const searchTerm = query.toLowerCase().trim();
    const categories = ["tents", "backpacks", "sleeping-bags", "hammocks"];
    let allProducts = [];

    // Fetch products from all categories
    try {      const categoryPromises = categories.map(async (category) => {
        try {
          const response = await fetch(`${baseURL}/products/search/${category}`);
          if (response.ok) {
            const data = await convertToJson(response);
            return data.Result || [];
          }
          return [];
        } catch (error) {
          return [];
        }
      });

      const categoryResults = await Promise.all(categoryPromises);
      allProducts = categoryResults.flat();

      // Filter products based on search query
      const filteredProducts = allProducts.filter(product => {
        const name = (product.Name || "").toLowerCase();
        const nameWithoutBrand = (product.NameWithoutBrand || "").toLowerCase();
        const brand = (product.Brand?.Name || "").toLowerCase();
        const description = (product.DescriptionHtmlSimple || "").toLowerCase();
          return name.includes(searchTerm) || 
               nameWithoutBrand.includes(searchTerm) || 
               brand.includes(searchTerm) ||
               description.includes(searchTerm);
      });      return filteredProducts;
    } catch (error) {
      return [];
    }
  }
  // Method to find a specific product by id
  async findProductById(id) {
    const response = await fetch(`${baseURL}/product/${id}`);
    const data = await convertToJson(response);
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
    return await convertToJson(response);
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

export async function searchProducts(query) {
  return await externalServices.searchProducts(query);
}
