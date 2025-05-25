import { renderProductList } from "./ProductListing.mjs";
import { loadHeaderFooter } from "./utils.mjs";

document.addEventListener("DOMContentLoaded", () => {
  // Load header and footer
  loadHeaderFooter();
  
  // Render the list of tent products when the page loads
  renderProductList(".product-list", "tents");
});
