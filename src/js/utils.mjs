export function getParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

export async function loadHeaderFooter() {
  // Load header
  const header = document.getElementById("main-header");
  if (header) {
    const response = await fetch("/public/header.html");
    if (response.ok) {
      header.innerHTML = await response.text();
    }
  }
  // Load footer
  const footer = document.getElementById("main-footer");
  if (footer) {
    const response = await fetch("/public/footer.html");
    if (response.ok) {
      footer.innerHTML = await response.text();
    }
  }
}

export function updateCartCount() {
  // Placeholder for cart count update logic
  // Implement as needed based on cart storage
}

// Make sure this function clears content properly
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = true,
) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
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
}
