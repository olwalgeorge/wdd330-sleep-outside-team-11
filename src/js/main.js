import { renderProductList } from "./ProductList.mjs";

document.addEventListener("DOMContentLoaded", () => {
  // Render the list of tent products when the page loads
  renderProductList(".product-list", "tents");
});