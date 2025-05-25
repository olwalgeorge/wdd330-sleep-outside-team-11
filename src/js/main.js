import { renderProductList } from "./ProductListing.mjs";
import { loadHeaderFooter, updateCartCount } from "./utils.mjs";

document.addEventListener("DOMContentLoaded", () => {
  // Load header and footer
  loadHeaderFooter();
  
  // Render a small sample of tent products on the home page
  renderProductList(".product-list", "tents");
  
  // Make sure cart count is updated when the page loads
  updateCartCount();
});
