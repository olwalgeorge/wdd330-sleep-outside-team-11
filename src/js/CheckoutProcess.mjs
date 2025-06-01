import { getLocalStorage } from "./utils.mjs";

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key);
    this.calculateItemSummary();
  }

  calculateItemSummary() {
    // Get cart items and calculate subtotal
    this.list = getLocalStorage(this.key) || [];
    
    if (this.list.length === 0) {
      this.itemTotal = 0;
      this.displayItemSummary();
      return;
    }    // Calculate the total dollar amount of the items in the cart
    this.itemTotal = this.list.reduce((total, item) => 
      total + parseFloat(item.FinalPrice || 0), 0);

    this.displayItemSummary();
  }

  calculateItemSubTotal() {
    // Legacy method name for backwards compatibility
    this.calculateItemSummary();
  }

  calculateOrderTotal() {
    // Calculate the tax and shipping amounts
    
    // Tax: 6% sales tax on the subtotal amount
    this.tax = this.itemTotal * 0.06;
    
    // Shipping: $10 for the first item plus $2 for each additional item after that
    if (this.list.length === 0) {
      this.shipping = 0;
    } else if (this.list.length === 1) {
      this.shipping = 10;
    } else {
      this.shipping = 10 + ((this.list.length - 1) * 2);
    }
    
    // Calculate order total
    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    // Display the totals
    this.displayOrderTotals();
  }

  displayItemSummary() {
    // Display the cart items and subtotal
    const orderItemsElement = document.querySelector(`${this.outputSelector} #order-items`);
    const subtotalElement = document.querySelector(`${this.outputSelector} #subtotal`);
    
    if (this.list.length === 0) {
      if (orderItemsElement) {
        orderItemsElement.innerHTML = "<p>Your cart is empty</p>";
      }
      if (subtotalElement) {
        subtotalElement.textContent = "$0.00";
      }
      return;
    }

    // Build the order items HTML
    let itemsHTML = `<ul class="summary-items">`;
    
    this.list.forEach(item => {
      // Fix image paths if needed
      let imagePath = item.Images?.PrimarySmall || item.Image;
      if (imagePath && imagePath.includes("../images")) {
        imagePath = imagePath.replace("../images", "/images");
      }
      
      itemsHTML += `
        <li class="summary-item">
          <img src="${imagePath}" alt="${item.Name}" width="50">
          <div class="item-details">
            <span class="item-name">${item.Name}</span>
            <span class="item-price">$${parseFloat(item.FinalPrice).toFixed(2)}</span>
          </div>
        </li>
      `;
    });
    
    itemsHTML += "</ul>";
    
    // Update the DOM
    if (orderItemsElement) {
      orderItemsElement.innerHTML = itemsHTML;
    }
    
    if (subtotalElement) {
      subtotalElement.textContent = `$${this.itemTotal.toFixed(2)}`;
    }
  }

  displayOrderTotals() {
    // Once the totals are all calculated display them in the order summary page
    const taxElement = document.querySelector(`${this.outputSelector} #tax`);
    const shippingElement = document.querySelector(`${this.outputSelector} #shipping`);
    const orderTotalElement = document.querySelector(`${this.outputSelector} #orderTotal`);
    
    if (taxElement) {
      taxElement.textContent = `$${this.tax.toFixed(2)}`;
    }
    
    if (shippingElement) {
      shippingElement.textContent = `$${this.shipping.toFixed(2)}`;
    }
    
    if (orderTotalElement) {
      orderTotalElement.innerHTML = `<strong>$${this.orderTotal.toFixed(2)}</strong>`;
    }
  }

  // Method to get the current order data for form submission
  getOrderData() {
    return {
      items: this.list,
      itemTotal: this.itemTotal,
      tax: this.tax,
      shipping: this.shipping,
      orderTotal: this.orderTotal
    };
  }
}
