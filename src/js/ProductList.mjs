// ProductListing.mjs - Module for rendering product lists on index page
import { getProductsByCategory } from "./ProductData.mjs";

// Known product IDs for the products we currently have detail pages for
const AVAILABLE_PRODUCTS = ["880RR", "985RF", "985PR", "344YJ"];

export async function renderProductList(selector, category) {
  try {
    // Get all products in the category
    const products = await getProductsByCategory(category);

    // Filter to only include products we have detail pages for
    const filteredProducts = products.filter(product => AVAILABLE_PRODUCTS.includes(product.Id));

    // Get the element to insert products into
    const element = document.querySelector(selector);
    
    if (!element) {
      return;
    }

    // Clear existing content
    element.innerHTML = "";
    
    // Create HTML for each product
    filteredProducts.forEach(product => {
      // Fix image paths by converting ../images to /images
      const imagePath = product.Image.replace("../images", "/images");
      
      element.innerHTML += `
        <li class="product-card">
          <a href="product_pages/index.html?product=${product.Id}">
            <img src="${imagePath}" alt="${product.Name}" />
            <h3 class="card__brand">${product.Brand.Name}</h3>
            <h2 class="card__name">${product.NameWithoutBrand}</h2>
            <p class="product-card__price">$${product.FinalPrice}</p>
          </a>
        </li>
      `;    });
  } catch (error) {
    // Error handling silently
  }
}