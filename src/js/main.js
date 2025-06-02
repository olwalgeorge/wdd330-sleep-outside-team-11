import { renderProductList } from "./ProductListing.mjs";
import { loadHeaderFooter, updateCartCount } from "./utils.mjs";

document.addEventListener("DOMContentLoaded", () => {
  // Load header and footer
  loadHeaderFooter();
<<<<<<< HEAD

  // Render a small sample of tent products on the home page
  renderProductList(".product-list", "tents");

=======
  
  // Render a small sample of tent products on the home page
  renderProductList(".product-list", "tents");
  
>>>>>>> d67fb3abc8266d1ae029c39b3d4ccb4e6dc94f21
  // Make sure cart count is updated when the page loads
  updateCartCount();
});
