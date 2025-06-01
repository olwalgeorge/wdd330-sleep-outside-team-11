// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// Function to get parameters from the URL
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// Format currency
export function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

// Get the number of items in the cart
export function getCartItemCount() {
  const cartItems = getLocalStorage("so-cart");
  return cartItems ? cartItems.length : 0;
}

// Update the cart count display
export function updateCartCount() {
  const cartCountElement = document.getElementById("cart-count");
  if (cartCountElement) {
    const count = getCartItemCount();
    if (count > 0) {
      cartCountElement.textContent = count;
      cartCountElement.style.display = "block";
    } else {
      cartCountElement.style.display = "none";
    }
  }
}

// render template with data if available
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if(callback) {
    callback(data);
  }
}

// load template from file
export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

// load and render header and footer
export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("/partials/header.html");
  const footerTemplate = await loadTemplate("/partials/footer.html");

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
  
  // Update cart count after header is loaded
  updateCartCount();
  
  // Initialize search form functionality
  initializeSearchForm();
}

// Initialize search form functionality
function initializeSearchForm() {
  const searchForm = document.querySelector(".search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", function(event) {
      event.preventDefault();
      const searchInput = document.getElementById("search-input");
      const searchQuery = searchInput.value.trim();
      
      if (searchQuery) {
        // Navigate to product listing page with search parameter
        window.location.href = `/product-listing/?search=${encodeURIComponent(searchQuery)}`;
      }
    });
  }
}

// Custom alert message function for better user feedback
export function alertMessage(message, scroll = true, type = "error") {
  // Remove any existing alerts
  const existingAlert = document.querySelector(".alert-message");
  if (existingAlert) {
    existingAlert.remove();
  }
  
  // Create alert element
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert-message ${type}`;
  alertDiv.innerHTML = `
    <div class="alert-content">
      <span class="alert-text">${message}</span>
      <button class="alert-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;
  
  // Insert at top of main element
  const mainElement = document.querySelector("main");
  if (mainElement) {
    mainElement.insertBefore(alertDiv, mainElement.firstChild);
  } else {
    // Fallback to body if main not found
    document.body.insertBefore(alertDiv, document.body.firstChild);
  }
  
  // Scroll to top if requested
  if (scroll) {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
  
  // Auto-remove after 8 seconds (longer for success messages)
  const timeout = type === "success" ? 5000 : 8000;
  setTimeout(() => {
    if (document.contains(alertDiv)) {
      alertDiv.remove();
    }
  }, timeout);
}
