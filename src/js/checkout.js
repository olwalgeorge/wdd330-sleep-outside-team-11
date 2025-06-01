import { loadHeaderFooter, getLocalStorage, formatCurrency, updateCartCount } from "./utils.mjs";

// Tax and shipping constants
const TAX_RATE = 0.06; // 6% tax rate
const SHIPPING_THRESHOLD = 100; // Free shipping over $100
const SHIPPING_COST = 10; // $10 shipping cost

// Calculate order totals
function calculateOrderTotals(cartItems) {
  const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.FinalPrice), 0);
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;
  
  return {
    subtotal: subtotal,
    shipping: shipping,
    tax: tax,
    total: total
  };
}

// Display order summary from cart items
function displayOrderSummary() {
  const cartItems = getLocalStorage("so-cart");
  const orderItemsElement = document.querySelector("#order-items");
  const subtotalElement = document.querySelector("#subtotal");
  const shippingElement = document.querySelector("#shipping");
  const taxElement = document.querySelector("#tax");
  const orderTotalElement = document.querySelector("#orderTotal");
  
  if (!cartItems || cartItems.length === 0) {
    if (orderItemsElement) {
      orderItemsElement.innerHTML = "<p>Your cart is empty</p>";
    }
    return;
  }
  
  // Calculate totals
  const totals = calculateOrderTotals(cartItems);
  
  // Build the order items HTML
  let itemsHTML = "<ul class=\"summary-items\">";
  
  cartItems.forEach(item => {
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
          <span class="item-price">${formatCurrency(parseFloat(item.FinalPrice))}</span>
        </div>
      </li>
    `;
  });
  
  itemsHTML += "</ul>";
  
  // Update the DOM with calculated values
  if (orderItemsElement) orderItemsElement.innerHTML = itemsHTML;
  if (subtotalElement) subtotalElement.textContent = formatCurrency(totals.subtotal);
  if (shippingElement) shippingElement.textContent = formatCurrency(totals.shipping);
  if (taxElement) taxElement.textContent = formatCurrency(totals.tax);
  if (orderTotalElement) orderTotalElement.innerHTML = `<strong>${formatCurrency(totals.total)}</strong>`;
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
      
      // Calculate totals
      const totals = calculateOrderTotals(cartItems);
      
      // Prepare order object
      const order = {
        orderDate: new Date().toISOString(),
        items: cartItems,
        orderTotal: totals.total,
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
