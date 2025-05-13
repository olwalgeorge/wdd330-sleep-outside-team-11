import { renderProductList } from "./ProductListing.mjs";

document.addEventListener("DOMContentLoaded", () => {
  // Render the list of tent products when the page loads
  renderProductList(".product-list", "tents");
});
