import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
    this.services = new ExternalServices();
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
  }  // Method to get the current order data for form submission
  getOrderData() {
    return {
      items: this.list,
      itemTotal: this.itemTotal,
      tax: this.tax,
      shipping: this.shipping,
      orderTotal: this.orderTotal
    };
  }

  // takes the items currently stored in the cart (localstorage) and returns them in a simplified form.
  packageItems(items) {
    // convert the list of products from localStorage to the simpler form required for the checkout process.
    // An Array.map would be perfect for this process.
    return items.map(item => ({
      id: item.Id,
      name: item.Name,
      price: parseFloat(item.FinalPrice),
      quantity: 1 // assuming quantity of 1 for each item for now
    }));
  }

  // Helper function to convert form data to JSON object
  formDataToJSON(formElement) {
    const formData = new FormData(formElement);
    const convertedJSON = {};
    
    formData.forEach((value, key) => {
      convertedJSON[key] = value;
    });
    
    return convertedJSON;
  }
  // checkout function that will get called when the form is submitted
  async checkout(form) {
    // get the form element data by the form name
    const json = this.formDataToJSON(form);
    
    // convert the form data to a JSON order object and map field names to server expectations
    const orderData = {
      orderDate: new Date().toISOString(),
      fname: json.firstName,
      lname: json.lastName, 
      street: json.street,
      city: json.city,
      state: json.state,
      zip: json.zip,
      cardNumber: json.cardNumber.replace(/\s/g, ""), // Remove spaces for submission
      expiration: json.expiration,
      code: json.securityCode,
      items: this.packageItems(this.list),
      orderTotal: this.orderTotal.toFixed(2),
      shipping: this.shipping,
      tax: this.tax.toFixed(2)
    };

    try {
      // call the checkout method in the ExternalServices module and send it the JSON order data.
      const result = await this.services.checkout(orderData);
      return result;
    } catch (error) {
      // Enhanced error handling to provide more detailed information
      if (error.name === "servicesError") {
        // Server returned detailed error information
        throw error;
      } else {
        // Generic error fallback
        throw { name: "checkoutError", message: error.message || "Unknown error occurred during checkout" };
      }
    }
  }
}
