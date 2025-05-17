import ProductData from "./ProductData.mjs"; // Import the ProductData module

const category = "tents";
const listElement = document.querySelector(".product-list"); // Select the product list element

const dataSource = new ProductData(); // Create an instance of ProductData
const productList = new productList(category, dataSource, listElement);
productList.init();
