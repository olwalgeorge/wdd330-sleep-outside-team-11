import { getLocalStorage, formatCurrency } from "./utils.mjs";

export default class CheckoutProcess {
  constructor() {
    this.cartItems = getLocalStorage("so-cart") || [];
    this.subtotal = 0;
    this.tax = 0;
    this.shipping = 0;
    this.total = 0;
  }

  calculateItemSummary() {
    // Calculate subtotal from cart items
    this.subtotal = this.cartItems.reduce((sum, item) => {
      return sum + parseFloat(item.FinalPrice || 0);
    }, 0);

    this.displayItemSummary();
    return this.subtotal;
  }

  calculateOrdertotal() {
    // Calculate tax (6% of subtotal)
    this.tax = this.subtotal * 0.06;

    // Calculate shipping ($10 for first item + $2 for each additional)
    const itemCount = this.cartItems.length;
    if (itemCount > 0) {
      this.shipping = 10 + (itemCount - 1) * 2;
    } else {
      this.shipping = 0;
    }

    // Calculate total
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

    // Build the order summary HTML with items
    let summaryHTML = "<h3>Order Summary</h3><ul>";

    this.cartItems.forEach((item) => {
      // Fix image paths if needed
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

    // Update the calculations section with tax, shipping, and total
    calculationsElement.innerHTML = `
      <p class="subtotal-line">Subtotal: ${formatCurrency(this.subtotal)}</p>
      <p class="tax-line">Tax (6%): ${formatCurrency(this.tax)}</p>
      <p class="shipping-line">Shipping: ${formatCurrency(this.shipping)}</p>
      <p class="order-total">Total: ${formatCurrency(this.total)}</p>
    `;
  }
}
