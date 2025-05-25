import { renderProductList } from "./ProductListing.mjs";
import { loadHeaderFooter } from "./utils.mjs";

document.addEventListener("DOMContentLoaded", () => {
  // Load header and footer
  loadHeaderFooter();
  
  // Render a small sample of tent products on the home page
  renderProductList(".product-list", "tents");
});
