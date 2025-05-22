
import { renderProductList } from "./ProductListing.mjs";

document.addEventListener("DOMContentLoaded", () => {
  // Render the list of tent products when the page loads
  renderProductList(".product-list", "tents");

import ProductData from "./ProductData.mjs"; // Import the ProductData module
import Alert from "./alert";
const category = "tents";
const listElement = document.querySelector(".product-list"); // Select the product list element

const dataSource = new ProductData(); // Create an instance of ProductData
const productList = new productList(category, dataSource, listElement);
productList.init();

const alert = new Alert(); // Create an instance of Alert
alert.fetchAlerts().then(() => {
  alert.renderAlerts(); // Render the alerts after fetching them

});
