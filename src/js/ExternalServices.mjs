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
  // Method to search products by query string - fetches from all categories and filters locally
  async searchProducts(query) {
    if (!query || !query.trim()) {
      return [];
    }

    const searchTerm = query.toLowerCase().trim();
    const categories = ['tents', 'backpacks', 'sleeping-bags', 'hammocks'];
    let allProducts = [];

    // Fetch products from all categories
    try {
      const categoryPromises = categories.map(async (category) => {
        try {
          const response = await fetch(`${baseURL}/products/search/${category}`);
          if (response.ok) {
            const data = await response.json();
            return data.Result || [];
          }
          return [];
        } catch (error) {
          console.warn(`Failed to fetch ${category}:`, error);
          return [];
        }
      });

      const categoryResults = await Promise.all(categoryPromises);
      allProducts = categoryResults.flat();

      // Filter products based on search query
      const filteredProducts = allProducts.filter(product => {
        const name = (product.Name || '').toLowerCase();
        const nameWithoutBrand = (product.NameWithoutBrand || '').toLowerCase();
        const brand = (product.Brand?.Name || '').toLowerCase();
        const description = (product.DescriptionHtmlSimple || '').toLowerCase();
        
        return name.includes(searchTerm) || 
               nameWithoutBrand.includes(searchTerm) || 
               brand.includes(searchTerm) ||
               description.includes(searchTerm);
      });

      return filteredProducts;
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
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

export async function searchProducts(query) {
  return await externalServices.searchProducts(query);
}
