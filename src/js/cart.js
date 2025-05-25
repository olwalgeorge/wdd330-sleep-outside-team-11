import { getLocalStorage, setLocalStorage, formatCurrency, loadHeaderFooter, updateCartCount } from "./utils.mjs";

function calculateCartTotal(cartItems) {
  if (!cartItems || cartItems.length === 0) {
    return 0;
  }
    return cartItems.reduce((total, item) => total + parseFloat(item.FinalPrice), 0);
}

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const productListElement = document.querySelector(".product-list");
  
  if (cartItems && cartItems.length > 0) {
    const htmlItems = cartItems.map((item) => cartItemTemplate(item));
    productListElement.innerHTML = htmlItems.join("");
    
    // Add event listeners to remove buttons
    addRemoveListeners();
    
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
      "<li class=\"cart-empty\">Your cart is empty</li>";
    
    // Remove total if cart is empty
    const totalElement = document.querySelector(".cart-footer");
    if (totalElement) {
      totalElement.remove();
    }
  }
}

function cartItemTemplate(item) {
  // Fix image paths if needed
  let imagePath = item.Images?.PrimaryMedium || item.Image;
  if (imagePath && imagePath.includes("../images")) {
    imagePath = imagePath.replace("../images", "/images");
  }
  
  const newItem = `<li class="cart-card divider">
  <button class="cart-card__remove" data-id="${item.Id}" aria-label="Remove ${item.Name} from cart">
    <span>×</span>
  </button>
  <a href="/product_pages/index.html?product=${item.Id}" class="cart-card__image">
    <img
      src="${imagePath}"
      alt="${item.Name}"
    />
  </a>
  <a href="/product_pages/index.html?product=${item.Id}">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors?.[0]?.ColorName || "N/A"}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

function removeFromCart(productId) {
  let cartItems = getLocalStorage("so-cart");
  if (cartItems) {
    // Find the index of the first item with the matching ID
    const itemIndex = cartItems.findIndex(item => item.Id === productId);
    if (itemIndex > -1) {
      // Remove the item from the cart
      cartItems.splice(itemIndex, 1);
      // Save the updated cart back to localStorage
      setLocalStorage("so-cart", cartItems);
      // Update cart count
      updateCartCount();
      // Re-render the cart contents
      renderCartContents();
    }
  }
}

function addRemoveListeners() {
  const removeButtons = document.querySelectorAll(".cart-card__remove");
  removeButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const productId = e.currentTarget.dataset.id;
      removeFromCart(productId);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter();
  renderCartContents();
  // Make sure cart count is updated when cart page loads
  updateCartCount();
});
