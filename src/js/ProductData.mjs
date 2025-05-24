const baseURL = "/json";

// Function to fetch product data from the json file
async function fetchProductData(category = "tents") {
  const response = await fetch(`${baseURL}/${category}.json`);
  const data = await response.json();
  return data;
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
