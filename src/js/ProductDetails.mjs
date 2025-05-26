import { setLocalStorage, getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.js";
import { loadHeaderFooter, getParam } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource; // Expecting an instance of ProductData
  }

  async init() {
    // Load the product data using the API
    this.product = await this.dataSource.getDataById(this.productId);

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
    // Fix image path
    const img = document.querySelector(".product-detail__image img");
    img.src = this.product.Image.startsWith("http")
      ? this.product.Image
      : `/images/${this.product.Image}`;
    img.alt = this.product.Name;

    document.querySelector(".product-detail__color").innerText = Array.isArray(
      this.product.Colors,
    )
      ? this.product.Colors.map((c) => c.ColorName || c).join(", ")
      : this.product.Colors || "";
    document.querySelector(".product-detail__description").innerHTML =
      this.product.DescriptionHtml || this.product.Description || "";
    document.querySelector(".product-card__price").innerText =
      `$${this.product.FinalPrice}`;
  }
}

// Helper to initialize on page load
export async function productDetails() {
  const productId = getParam("id");
  if (!productId) return;
  const dataSource = new ProductData();
  const details = new ProductDetails(productId, dataSource);
  await details.init();
}

// Load header and footerloadHeaderFooter();

const category = getParam("category");
// first create an instance of the ProductData class.
const dataSource = new ProductData();
// then get the element you want the product list to render in
const listElement = document.querySelector(".product-list");
// then create an instance of the ProductList class and send it the correct information.
const myList = new ProductList(category, dataSource, listElement);
// finally call the init method to show the products
myList.init();

// Update the heading to include the category
const heading = document.querySelector(".products h2");
if (heading && category) {
  // Capitalize the first letter and replace hyphens with spaces
  const formattedCategory = category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  heading.textContent = `Top Products: ${formattedCategory}`;
}
