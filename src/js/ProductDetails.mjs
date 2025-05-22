import { findProductById } from "./ProductData.mjs";
import { getParam } from "./utils.mjs";

export async function renderProductDetails() {
  // Get the product id from URL parameter
  const productId = getParam("product");
  if (!productId) {
    return;
  }
  
  try {
    // Get the product details from the data module
    const product = await findProductById(productId);
    
    if (!product) {
      return;
    }
    
    // Render the product details in the DOM
    document.getElementById("productName").textContent = product.Name;
    document.getElementById("productNameWithoutBrand").textContent = product.NameWithoutBrand;
    document.getElementById("productImage").src = product.Image;
    document.getElementById("productImage").alt = product.Name;
    document.getElementById("productFinalPrice").textContent = `$${product.FinalPrice}`;
    document.getElementById("productColorName").textContent = product.Colors[0].ColorName;
    document.getElementById("productDescriptionHtml").innerHTML = product.DescriptionHtml;
    
    // Set the product ID for the "Add to Cart" button
    document.getElementById("addToCart").setAttribute("data-id", product.Id);
    
    // Update the page title
    document.title = `Sleep Outside | ${product.Name}`;
  } catch (error) {
    // Error handling without console.error

import { setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource; // Expecting an instance of ProductData
  }

  async init() {
    // Load the product data
    this.product = await this.dataSource.findProductById(this.productId);

    // Render the product details on the page
    this.renderProductDetails();

    // Set up the Add to Cart button
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
    setLocalStorage("so-cart", this.product);
  }

  renderProductDetails() {
    document.querySelector(".product-detail__title").innerText =
      this.product.Name;
    document.querySelector(".product-detail__image img").src =
      this.product.Image;
    document.querySelector(".product-detail__image img").alt =
      this.product.Name;
    document.querySelector(".product-detail__color").innerText =
      this.product.Colors.join(", ");
    document.querySelector(".product-detail__description").innerText =
      this.product.Description;
    document.querySelector(".product-card__price").innerText =
      `$${this.product.FinalPrice}`;
  }
}
