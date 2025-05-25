import { findProductById } from "./ProductData.mjs";
import { getParam } from "./utils.mjs";

export async function renderProductDetails() {
  // Get the product id from URL parameter
  const productId = getParam("product");
  if (!productId) {
    return;
  }
  
  try {
    // Get the product details from the data module
    const product = await findProductById(productId);
    
    if (!product) {
      return;
    }
    
    // Render the product details in the DOM
    document.getElementById("productName").textContent = product.Name;
    document.getElementById("productNameWithoutBrand").textContent = product.NameWithoutBrand || "";
    
    // Handle different image formats from the API
    let imagePath = product.Images?.PrimaryLarge || product.Image;
    if (imagePath && imagePath.includes("../images")) {
      imagePath = imagePath.replace("../images", "/images");
    }
    
    document.getElementById("productImage").src = imagePath;
    document.getElementById("productImage").alt = product.Name;
    
    // Check if product is discounted (FinalPrice < SuggestedRetailPrice)
    const isDiscounted = product.FinalPrice < product.SuggestedRetailPrice;
    
    if (isDiscounted) {
      // Create a price container div to hold both prices
      const priceContainer = document.createElement("div");
      priceContainer.className = "product-detail__price-container";
      
      // Create and add the original price element
      const originalPrice = document.createElement("p");
      originalPrice.className = "product-card__original-price";
      originalPrice.textContent = `$${product.SuggestedRetailPrice.toFixed(2)}`;
      priceContainer.appendChild(originalPrice);
      
      // Create and add the final price element
      const finalPrice = document.createElement("p");
      finalPrice.className = "product-card__price";
      finalPrice.textContent = `$${product.FinalPrice.toFixed(2)}`;
      priceContainer.appendChild(finalPrice);
      
      // Create discount badge
      const discountAmount = product.SuggestedRetailPrice - product.FinalPrice;
      const discountPercentage = Math.round((discountAmount / product.SuggestedRetailPrice) * 100);
      const discountBadge = document.createElement("div");
      discountBadge.className = "discount-badge product-detail__discount-badge";
      discountBadge.textContent = `Save ${discountPercentage}% ($${discountAmount.toFixed(2)})`;
      
      // Get the original price element and replace it with our container
      const priceElement = document.getElementById("productFinalPrice");
      priceElement.replaceWith(priceContainer);
      
      // Add the discount badge to the product detail section
      const productDetailSection = document.querySelector(".product-detail");
      productDetailSection.insertBefore(discountBadge, document.getElementById("productImage"));
    } else {
      // No discount, just show the final price
      document.getElementById("productFinalPrice").textContent = `$${product.FinalPrice.toFixed(2)}`;
    }
    
    // Handle color display if available
    if (product.Colors && product.Colors.length > 0) {
      document.getElementById("productColorName").textContent = product.Colors[0].ColorName;
    } else {
      document.getElementById("productColorName").textContent = "";
    }
    
    document.getElementById("productDescriptionHtml").innerHTML = product.DescriptionHtml || product.Description || "";
    
    // Set the product ID for the "Add to Cart" button
    document.getElementById("addToCart").setAttribute("data-id", product.Id);
    
    // Update the page title
    document.title = `Sleep Outside | ${product.Name}`;  } catch (error) {
    // Handle error silently without console.error
    // Display an error message on the page
    const errorElement = document.createElement("p");
    errorElement.classList.add("error-message");
    errorElement.textContent = "We're sorry, there was an error loading this product.";
    document.querySelector(".product-detail").appendChild(errorElement);
  }
}
