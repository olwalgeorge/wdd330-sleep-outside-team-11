import {
  getLocalStorage,
  setLocalStorage,
  loadHeaderFooter,
  updateCartCount,
  getParam,
} from "./utils.mjs";
import { findProductById } from "./ProductData.mjs";
import { renderProductDetails } from "./ProductDetails.mjs";

loadHeaderFooter();

const productId = getParam("product");

async function init() {
  const product = await findProductById(productId);
  renderProductDetails(product);

  // Add event listener to the add to cart button
  document
    .getElementById("addToCart")
    .addEventListener("click", addToCartHandler);
}

function addProductToCart(product) {
  let cart = getLocalStorage("so-cart");
  if (!cart) {
    cart = [];
  } else if (!Array.isArray(cart)) {
    cart = [cart];
  }
  cart.push(product);
  setLocalStorage("so-cart", cart);
  updateCartCount();
}

async function addToCartHandler(e) {
  const product = await findProductById(e.target.dataset.id);
  addProductToCart(product);
}

init();
