import { getLocalStorage, formatCurrency, loadHeaderFooter } from "./utils.mjs"; // Import loadHeaderFooter
import ShoppingCart from "./ShoppingCart.mjs"; // Import ShoppingCart class
// Load the header and footer into the page
document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter(); // Loads header and footer from partials

  renderCartContents(); // Render the cart contents after DOM is ready
});

function calculateCartTotal(cartItems) {
  if (!cartItems || cartItems.length === 0) {
    return 0;
  }
  return cartItems.reduce(
    (total, item) => total + parseFloat(item.FinalPrice),
    0,
  );
}

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const productListElement = document.querySelector(".product-list");

  if (cartItems && cartItems.length > 0) {
    const htmlItems = cartItems.map((item) => cartItemTemplate(item));
    productListElement.innerHTML = htmlItems.join("");

    // Calculate and display the total
    const total = calculateCartTotal(cartItems);
    const totalElement = document.querySelector(".cart-total");
    if (totalElement) {
      totalElement.textContent = `Total: ${formatCurrency(total)}`;
    } else {
      // Create total element if it doesn't exist
      const totalDiv = document.createElement("div");
      totalDiv.classList.add("cart-footer");
      totalDiv.innerHTML = `<p class="cart-total">Total: ${formatCurrency(total)}</p>`;
      document.querySelector(".products").appendChild(totalDiv);
    }
  } else {
    productListElement.innerHTML =
      '<li class="cart-empty">Your cart is empty</li>';

    // Remove total if cart is empty
    const totalElement = document.querySelector(".cart-footer");
    if (totalElement) {
      totalElement.remove();
    }

    document.querySelector(".product-list").innerHTML =
      '<li class="cart-empty">Your cart is empty</li>';
  }
}

// Template for cart items
// This function creates a template for each cart item
// Get the template and list element
const template = document.getElementById("cart-item-template");
const listElement = document.querySelector(".product-list");

// Create and render the shopping cart
const cart = new ShoppingCart(listElement, template);
cart.renderCart();

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}
