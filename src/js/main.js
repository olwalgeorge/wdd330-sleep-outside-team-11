import { renderProductList } from "./ProductListing.mjs";
import ProductData from "./ProductData.mjs";
import Alert from "./alert";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter } from "../js/utils.mjs"; // Import the function to load header and footer templates
loadHeaderFooter(); // Load header and footer templates

// Load the header and footer, then initialize the rest of the page
document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter(); // Load header and footer

  // Render the list of tent products when the page loads
  renderProductList(".product-list", "tents");

  const category = "tents";
  const listElement = document.querySelector(".product-list");

  const dataSource = new ProductData();
  const productList = new ProductList(category, dataSource, listElement);
  productList.init();

  const alert = new Alert();
  alert.fetchAlerts().then(() => {
    alert.renderAlerts();
  });
});
