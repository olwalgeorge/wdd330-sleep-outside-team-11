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
      
      try {
        // Submit order using CheckoutProcess and ExternalServices
        // Pass the form element directly to the checkout method
        const result = await checkout.checkout(form);
        
        // Clear cart on successful submission
        localStorage.removeItem("so-cart");
        updateCartCount();
        
        // Show success message
        alert(`Order submitted successfully! Order ID: ${result.orderId || "N/A"}`);
        
        // Redirect to home page or order confirmation
        window.location.href = "/";
      } catch (error) {
        alert(`There was an error submitting your order: ${error.message}`);
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter();
  displayOrderSummary();
  addInputFormatting();
  handleFormSubmission();
  updateCartCount();
});
