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
