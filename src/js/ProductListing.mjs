<<<<<<< HEAD
import { getProductsByCategory } from "./ProductData.mjs";
=======
>>>>>>> d67fb3abc8266d1ae029c39b3d4ccb4e6dc94f21

import { getProductsByCategory, searchProducts } from "./ExternalServices.mjs";

export async function renderProductList(selector, category, sort = "name-asc", searchQuery = null) {
  try {
<<<<<<< HEAD
    // Get all products in the category
    const products = await getProductsByCategory(category);

    // Filter to only include products we have detail pages for
    const filteredProducts = products.filter((product) =>
      AVAILABLE_PRODUCTS.includes(product.Id),
    );

=======
>>>>>>> d67fb3abc8266d1ae029c39b3d4ccb4e6dc94f21
    // Get the element to insert products into
    const element = document.querySelector(selector);

    if (!element) {
      return;
    }    // Show loading indicator
    element.innerHTML = "<li class='loading-indicator'>Loading products...</li>";
    
    // Get products either by search query or category
    let products;
    if (searchQuery && searchQuery.trim()) {
      products = await searchProducts(searchQuery.trim());
    } else {
      products = await getProductsByCategory(category);
    }

    // Show loading indicator
    element.innerHTML =
      "<li class='loading-indicator'>Loading products...</li>";

    // Get all products in the category
    const products = await getProductsByCategory(category);

    // Clear existing content
    element.innerHTML = "";
<<<<<<< HEAD

    // Create HTML for each product
    filteredProducts.forEach((product) => {
      // Fix image paths by converting ../images to /images
      const imagePath = product.Image.replace("../images", "/images");

=======
      if (!products || products.length === 0) {
      const message = searchQuery && searchQuery.trim() 
        ? `No products found for "${searchQuery}"`
        : "No products found in this category";
      element.innerHTML = `<li class='no-products'>${message}</li>`;
      return;
    }

    // Sort products
    products.sort((a, b) => {
      switch (sort) {
        case "name-asc":
          return (a.NameWithoutBrand || a.Name).localeCompare(b.NameWithoutBrand || b.Name);
        case "name-desc":
          return (b.NameWithoutBrand || b.Name).localeCompare(a.NameWithoutBrand || a.Name);
        case "price-asc":
          return a.FinalPrice - b.FinalPrice;
        case "price-desc":
          return b.FinalPrice - a.FinalPrice;
        default:
          return 0;
      }
    });

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
      
>>>>>>> d67fb3abc8266d1ae029c39b3d4ccb4e6dc94f21
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
    });
  } catch (error) {
    // Handle error silently without console.error
    const element = document.querySelector(selector);
    if (element) {
<<<<<<< HEAD
      element.innerHTML =
        "<li class='error-message'>Error loading products. Please try again later.</li>";
=======
      element.innerHTML = "<li class='error-message'>Error loading products. Please try again later.</li>";
>>>>>>> d67fb3abc8266d1ae029c39b3d4ccb4e6dc94f21
    }
  }
}