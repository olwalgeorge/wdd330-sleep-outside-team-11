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
      
      // Check if product is discounted (FinalPrice < SuggestedRetailPrice)
      const isDiscounted = product.FinalPrice < product.SuggestedRetailPrice;
      
      // Format the prices with exactly two decimal places
      const finalPrice = product.FinalPrice.toFixed(2);
      
      // Create discount badge HTML if discounted
      const discountBadge = isDiscounted 
        ? `<div class="discount-badge">On Sale</div>` 
        : "";
      
      // Calculate and display original price if discounted
      const originalPriceDisplay = isDiscounted 
        ? `<p class="product-card__original-price">$${product.SuggestedRetailPrice.toFixed(2)}</p>` 
        : "";
      
      element.innerHTML += `
        <li class="product-card ${isDiscounted ? "product-card--on-sale" : ""}">
          <a href="${productUrl}">
            ${discountBadge}
            <img src="${imagePath}" alt="${product.Name}" />
            <h3 class="card__brand">${product.Brand?.Name || "Brand"}</h3>
            <h2 class="card__name">${product.NameWithoutBrand || product.Name}</h2>
            <div class="product-card__price-container">
              ${originalPriceDisplay}
              <p class="product-card__price">$${finalPrice}</p>
            </div>
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
