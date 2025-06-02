import { loadHeaderFooter, getLocalStorage, formatCurrency, updateCartCount } from "./utils.mjs";

// Display order summary from cart items
function displayOrderSummary() {
  const cartItems = getLocalStorage("so-cart");
  const orderSummaryElement = document.querySelector(".order-summary");
  
  // If there's no element for order summary yet, we're not showing it
  if (!orderSummaryElement || !cartItems || cartItems.length === 0) {
    return;
  }
  
  // Calculate total
  const total = cartItems.reduce((sum, item) => sum + parseFloat(item.FinalPrice), 0);
  
  // Build the order summary HTML
  let summaryHTML = "<h3>Order Summary</h3><ul>";
  
  cartItems.forEach(item => {
    // Fix image paths if needed
    let imagePath = item.Images?.PrimarySmall || item.Image;
    if (imagePath && imagePath.includes("../images")) {
      imagePath = imagePath.replace("../images", "/images");
    }
    
    summaryHTML += `
      <li class="summary-item">
        <img src="${imagePath}" alt="${item.Name}" width="30">
        <span>${item.Name}</span>
        <span>$${item.FinalPrice}</span>
      </li>
    `;
  });
  
  summaryHTML += `</ul><p class="order-total">Total: ${formatCurrency(total)}</p>`;
  orderSummaryElement.innerHTML = summaryHTML;
}

document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter();
  displayOrderSummary();
  // Update cart count
  updateCartCount();
});
