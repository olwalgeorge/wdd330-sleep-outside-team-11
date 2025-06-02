import ExternalServices from "./ExternalServices.mjs";
import { getLocalStorage } from "./utils.mjs";

// Optional: helper for formatting currency
function formatCurrency(amount) {
  return `$${Number(amount).toFixed(2)}`;
}

export default class CheckoutProcess {
  constructor() {
    this.cartItems = getLocalStorage("so-cart") || [];
    this.subtotal = 0;
    this.tax = 0;
    this.shipping = 0;
    this.total = 0;
    this.services = new ExternalServices();
  }

  // Converts cart items to the required format for the order
  packageItems(items) {
    return items.map((item) => ({
      id: item.Id,
      name: item.Name,
      price: item.FinalPrice,
      quantity: item.quantity || 1,
    }));
  }

  calculateItemSummary() {
    this.subtotal = this.cartItems.reduce((sum, item) => {
      return sum + parseFloat(item.FinalPrice || 0);
    }, 0);

    this.displayItemSummary();
    return this.subtotal;
  }

  calculateOrdertotal() {
    this.tax = this.subtotal * 0.06;
    const itemCount = this.cartItems.length;
    this.shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;
    this.total = this.subtotal + this.tax + this.shipping;
    this.displayOrderTotals();
    return this.total;
  }

  displayItemSummary() {
    const orderSummaryElement = document.querySelector(".order-summary");
    if (
      !orderSummaryElement ||
      !this.cartItems ||
      this.cartItems.length === 0
    ) {
      return;
    }

    let summaryHTML = "<h3>Order Summary</h3><ul>";
    this.cartItems.forEach((item) => {
      let imagePath = item.Images?.PrimarySmall || item.Image;
      if (imagePath && imagePath.includes("../images")) {
        imagePath = imagePath.replace("../images", "/images");
      }
      summaryHTML += `
        <li class="summary-item">
          <img src="${imagePath}" alt="${item.Name}" width="30">
          <span>${item.Name}</span>
          <span>${formatCurrency(item.FinalPrice)}</span>
        </li>
      `;
    });
    summaryHTML += `</ul>`;
    summaryHTML += `<div class="order-calculations">`;
    summaryHTML += `<p class="subtotal-line">Subtotal: ${formatCurrency(this.subtotal)}</p>`;
    summaryHTML += `</div>`;

    orderSummaryElement.innerHTML = summaryHTML;
  }

  displayOrderTotals() {
    const calculationsElement = document.querySelector(".order-calculations");
    if (!calculationsElement) {
      return;
    }
    calculationsElement.innerHTML = `
      <p class="subtotal-line">Subtotal: ${formatCurrency(this.subtotal)}</p>
      <p class="tax-line">Tax (6%): ${formatCurrency(this.tax)}</p>
      <p class="shipping-line">Shipping: ${formatCurrency(this.shipping)}</p>
      <p class="order-total">Total: ${formatCurrency(this.total)}</p>
    `;
  }

  // Converts form data to an order object and submits it
  async checkout(form) {
    const formData = new FormData(form);
    const order = Object.fromEntries(formData.entries());

    // Get cart items and totals
    const items = this.packageItems(this.cartItems);

    // Add required order fields
    order.orderDate = new Date().toISOString();
    order.items = items;
    order.orderTotal = this.total.toFixed(2);
    order.shipping = this.shipping;
    order.tax = this.tax.toFixed(2);

    // Send order to the server
    try {
      const result = await this.services.checkout(order);
      return result;
    } catch (err) {
      throw new Error("Checkout failed: " + err.message);
    }
  }
}
