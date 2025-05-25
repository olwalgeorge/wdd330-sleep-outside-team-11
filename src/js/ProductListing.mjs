// ProductListing.mjs - Module for rendering product lists on index page
import { getProductsByCategory } from "./ProductData.mjs";

export async function renderProductList(selector, category) {
  try {
    // Get the element to insert products into
    const element = document.querySelector(selector);
    
    if (!element) {
      return;
    }

    // Show loading indicator
    element.innerHTML = "<li class='loading-indicator'>Loading products...</li>";
    
    // Get all products in the category
    const products = await getProductsByCategory(category);

    // Clear existing content
    element.innerHTML = "";
    
    if (!products || products.length === 0) {
      element.innerHTML = "<li class='no-products'>No products found in this category</li>";
      return;
    }
    
    // Create HTML for each product
    products.forEach(product => {
      // Fix image paths if needed
      let imagePath = product.Images?.PrimaryMedium || product.Image;
      if (imagePath && imagePath.includes("../images")) {
        imagePath = imagePath.replace("../images", "/images");
      }
      
      const productUrl = window.location.pathname.includes("product-listing") 
        ? `/product_pages/index.html?product=${product.Id}` 
        : `product_pages/index.html?product=${product.Id}`;
      
      element.innerHTML += `
        <li class="product-card">
          <a href="${productUrl}">
            <img src="${imagePath}" alt="${product.Name}" />
            <h3 class="card__brand">${product.Brand?.Name || "Brand"}</h3>
            <h2 class="card__name">${product.NameWithoutBrand || product.Name}</h2>
            <p class="product-card__price">$${product.FinalPrice}</p>
          </a>
        </li>
      `;
    });  } catch (error) {
    // Handle error silently without console.error
    const element = document.querySelector(selector);
    if (element) {
      element.innerHTML = "<li class='error-message'>Error loading products. Please try again later.</li>";
    }
  }
}
