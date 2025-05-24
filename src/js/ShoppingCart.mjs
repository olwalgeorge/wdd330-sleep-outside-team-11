import {
  getLocalStorage,
  formatCurrency,
  renderWithTemplate,
} from "./utils.mjs";

export default class ShoppingCart {
  constructor(listElement, template) {
    this.listElement = listElement;
    this.template = template;
    this.cartKey = "so-cart";
  }

  getCartItems() {
    return getLocalStorage(this.cartKey) || [];
  }

  calculateCartTotal(cartItems) {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce(
      (total, item) => total + parseFloat(item.FinalPrice),
      0,
    );
  }

  async renderCart() {
    const cartItems = this.getCartItems();
    this.listElement.innerHTML = ""; // Clear previous contents

    if (cartItems.length > 0) {
      for (let item of cartItems) {
        await renderWithTemplate(
          this.template,
          this.listElement,
          item,
          this.cartItemCallback,
        );
      }
      // Display total
      const total = this.calculateCartTotal(cartItems);
      let totalElement = document.querySelector(".cart-total");
      if (!totalElement) {
        totalElement = document.createElement("div");
        totalElement.classList.add("cart-total");
        this.listElement.parentElement.appendChild(totalElement);
      }
      totalElement.textContent = `Total: ${formatCurrency(total)}`;
    } else {
      this.listElement.innerHTML =
        '<li class="cart-empty">Your cart is empty</li>';
      const totalElement = document.querySelector(".cart-total");
      if (totalElement) totalElement.remove();
    }
  }

  // Customize this callback to fill in template fields
  async cartItemCallback(clone, item) {
    clone.querySelector(".cart-card__image img").src = item.Image;
    clone.querySelector(".cart-card__image img").alt = item.Name;
    clone.querySelector(".card__name").textContent = item.Name;
    clone.querySelector(".cart-card__color").textContent =
      item.Colors[0].ColorName;
    clone.querySelector(".cart-card__quantity").textContent = `qty: 1`;
    clone.querySelector(".cart-card__price").textContent = formatCurrency(
      item.FinalPrice,
    );
    return clone;
  }
}
