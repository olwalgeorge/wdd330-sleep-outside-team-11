import { loadHeaderFooter, updateCartCount, getParam } from "./utils.mjs";
import { renderProductList } from "./ProductListing.mjs";

document.addEventListener("DOMContentLoaded", () => {
  // Load header and footer
  loadHeaderFooter();
  
  // Get the category from the URL parameter
  const category = getParam("category");
  
  // Set the category title with proper formatting
  let displayCategory = category;
  if (category === "sleeping-bags") {
    displayCategory = "Sleeping Bags";
  } else {
    // Capitalize first letter of the category
    displayCategory = category.charAt(0).toUpperCase() + category.slice(1);
  }
  
  // Update the page title and category display
  document.getElementById("category-title").textContent = displayCategory;
  document.getElementById("category-name").textContent = displayCategory;
  document.title = `Sleep Outside | ${displayCategory}`;
    // Render the list of products for the specified category
  renderProductList(".product-list", category);
  
  // Update cart count display
  updateCartCount();
});
