import { getLocalStorage, setLocalStorage, getParam } from "./utils.mjs"; // Added getParam import
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

function addProductToCart(product) {
  let cart = getLocalStorage("so-cart");
  // Check if cart exists and is an array
  if (!cart) {
    cart = [];
  } else if (!Array.isArray(cart)) {
    // convert cart into an array if cart exists but is not an array
    cart = [cart];
  }
  // Add the new product to the cart array
  cart.push(product);
  // Save the updated cart back to localStorage
  setLocalStorage("so-cart", cart);
}

// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id); // Renamed variable to avoid shadowing
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);

// get the product id from the URL
const productId = getParam("product"); // Fixed typo in function name (getparam -> getParam)
const dataSource = new ProductData("tents");
const productDetails = new ProductDetails(productId, dataSource); // Renamed variable to avoid shadowing
productDetails.init()}