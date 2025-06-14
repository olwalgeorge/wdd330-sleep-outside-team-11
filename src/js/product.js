import { getLocalStorage, setLocalStorage, loadHeaderFooter, updateCartCount, alertMessage } from "./utils.mjs";
import { findProductById } from "./ExternalServices.mjs";
import { renderProductDetails } from "./ProductDetails.mjs";

function addProductToCart(product) {
  let cart = getLocalStorage("so-cart");
  // Check if cart exists and is an array
  if (!cart) {
    cart = [];
  } else if (!Array.isArray(cart)) {
    // convert cart into an array if cart exists but is not an array
    cart = [cart]; 
  }
  
  // Check if product is already in cart
  const existingProductIndex = cart.findIndex(item => item.Id === product.Id);
  
  if (existingProductIndex >= 0) {
    // Product already exists, increment quantity
    if (!cart[existingProductIndex].quantity) {
      // If quantity property doesn't exist, initialize it to 1
      cart[existingProductIndex].quantity = 1;
    }
    // Increment the quantity
    cart[existingProductIndex].quantity++;
  } else {
    // Product not in cart, add it with quantity of 1
    product.quantity = 1;
    cart.push(product);
  }
  
  // Save the updated cart back to localStorage
  setLocalStorage("so-cart", cart);
  // Update the cart count display
  updateCartCount();
}
// add to cart button event handler
async function addToCartHandler(e) { 
  const product = await findProductById(e.target.dataset.id);
  
  // Check if product is already in cart before adding
  const cart = getLocalStorage("so-cart") || [];
  const existingProduct = Array.isArray(cart) ? 
    cart.find(item => item.Id === product.Id) : 
    (cart.Id === product.Id ? cart : null);
  
  addProductToCart(product);
  
  // Show appropriate success message based on whether the item was added or quantity incremented
  if (existingProduct) {
    alertMessage(`✓ ${product.NameWithoutBrand || product.Name} quantity updated in cart!`, false, "success");
  } else {
    alertMessage(`✓ ${product.NameWithoutBrand || product.Name} added to cart!`, false, "success");
  }
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);

// Helper function to determine product category from product data
function determineProductCategory(product) {
  // This is a simple implementation that could be enhanced with more detailed logic
  const name = product.Name.toLowerCase();
  
  if (name.includes("tent")) return "tents";
  if (name.includes("pack") || name.includes("backpack")) return "backpacks";
  if (name.includes("sleeping") || name.includes("bag")) return "sleeping-bags";
  if (name.includes("hammock")) return "hammocks";
  
  // Default to tents if we can't determine
  return "tents";
}

// Load product details when the DOM is ready
document.addEventListener("DOMContentLoaded", async () => {
  loadHeaderFooter();
  await renderProductDetails();
  
  // Set up breadcrumb navigation
  const productId = new URLSearchParams(window.location.search).get("product");
  if (productId) {
    try {
      const product = await findProductById(productId);
      if (product) {
        // Set the product name in the breadcrumb
        document.getElementById("productBreadcrumb").textContent = product.Name;
        
        // Determine the category and set up the category link
        const category = determineProductCategory(product);
        const categoryLink = document.getElementById("categoryLink");
        
        let displayCategory = category;
        if (category === "sleeping-bags") {
          displayCategory = "Sleeping Bags";
        } else {
          // Capitalize first letter of the category
          displayCategory = category.charAt(0).toUpperCase() + category.slice(1);
        }
        
        categoryLink.textContent = displayCategory;
        categoryLink.href = `/product-listing/index.html?category=${category}`;
      }
    } catch (error) {
      // Silently handle error
    }
  }
});
