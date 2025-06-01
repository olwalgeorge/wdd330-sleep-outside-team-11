import { loadHeaderFooter, getLocalStorage, updateCartCount } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

// Initialize CheckoutProcess
const checkout = new CheckoutProcess("so-cart", ".order-summary");

// Display order summary from cart items using CheckoutProcess
function displayOrderSummary() {
  checkout.init();
  checkout.calculateOrderTotal();
}

// Format credit card number with spaces
function formatCardNumber(value) {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  const matches = v.match(/\d{4,16}/g);
  const match = matches && matches[0] || "";
  const parts = [];
  
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }
  
  if (parts.length) {
    return parts.join(" ");
  } else {
    return v;
  }
}

// Format expiration date
function formatExpiration(value) {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  if (v.length >= 2) {
    return v.substring(0, 2) + "/" + v.substring(2, 4);
  }
  return v;
}

// Add input formatting listeners
function addInputFormatting() {
  const cardNumberInput = document.querySelector("#cardNumber");
  const expirationInput = document.querySelector("#expiration");
  const zipInput = document.querySelector("#zip");
  
  if (cardNumberInput) {
    cardNumberInput.addEventListener("input", (e) => {
      e.target.value = formatCardNumber(e.target.value);
    });
  }
  
  if (expirationInput) {
    expirationInput.addEventListener("input", (e) => {
      e.target.value = formatExpiration(e.target.value);
    });
  }
  
  // Add zip code event listener to trigger order total calculation
  if (zipInput) {
    zipInput.addEventListener("blur", () => {
      checkout.calculateOrderTotal();
    });
  }
}

// Handle form submission
function handleFormSubmission() {
  const form = document.querySelector("#checkout-form");
  
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const cartItems = getLocalStorage("so-cart");
      if (!cartItems || cartItems.length === 0) {
        alert("Your cart is empty!");
        return;
      }
      
      // Get form data
      const formData = new FormData(form);
      const orderData = {};
        // Convert form data to object
      for (let [key, value] of formData.entries()) {
        orderData[key] = value.trim();
      }
        // Calculate totals using CheckoutProcess
      const totals = checkout.getOrderData();
      
      // Prepare order object
      const order = {
        orderDate: new Date().toISOString(),
        items: cartItems,
        orderTotal: totals.orderTotal,
        shipping: totals.shipping,
        tax: totals.tax,
        fname: orderData.firstName,
        lname: orderData.lastName,
        street: orderData.street,
        city: orderData.city,
        state: orderData.state,
        zip: orderData.zip,
        cardNumber: orderData.cardNumber.replace(/\s/g, ""), // Remove spaces for submission
        expiration: orderData.expiration,
        code: orderData.securityCode
      };
      
      try {
        // Submit order to server
        const response = await submitOrder(order);
        
        if (response.success) {
          // Clear cart
          localStorage.removeItem("so-cart");
          updateCartCount();
          
          // Show success message          alert(`Order submitted successfully! Order ID: ${response.orderId || "N/A"}`);
          
          // Redirect to home page or order confirmation
          window.location.href = "/";
        } else {
          alert("Failed to submit order. Please try again.");
        }
      } catch (error) {
        alert("There was an error submitting your order. Please try again.");
      }
    });
  }
}

// Submit order to server
async function submitOrder(order) {
  try {
    const response = await fetch("https://wdd330-backend.onrender.com/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });
    
    const result = await response.json();
    
    if (response.ok) {
      return { success: true, orderId: result.orderId };
    } else {
      return { success: false, error: result.message };
    }  } catch (error) {
    return { success: false, error: "Network error" };
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter();
  displayOrderSummary();
  addInputFormatting();
  handleFormSubmission();
  updateCartCount();
});
