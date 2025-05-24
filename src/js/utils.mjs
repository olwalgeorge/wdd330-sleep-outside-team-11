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

export async function renderListWithTemplate(
  template,
  parentElement,
  list,
  callback,
) {
  parentElement.innerHTML = ""; // Clear the parent element
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    let clone = template.content.cloneNode(true); // Clone the template
    if (callback) {
      clone = await callback(clone, item); // Customize the clone if callback is provided
    }
    parentElement.appendChild(clone); // Append the clone to the parent
  }
}

export async function renderWithTemplate(
  template,
  parentElement,
  list,
  callback,
) {
  parentElement.innerHTML = ""; // Clear the parent element
  let clone = template.content.cloneNode(true); // Clone the template
  parentElement.appendChild(clone); // Append the clone to the parent
  if (callback) {
    await callback(clone, data); // Call the callback if provided
  }
}

// Function to load template from HTML file
export async function loadTemplate(path) {
  const response = await fetch(path);
  const template = await response.text();
}

// A function to load the header and footer templates
export async function loadHeaderFooter() {
  const header = await loadTemplate("./partials/header.html"); // Load header template
  const footer = await loadTemplate("./partials/footer.html"); // Load footer template
  const headerElement = document.querySelector("header"); // Select the header element
  const footerElement = document.querySelector("footer"); // Select the footer element
  renderWithTemplate(header, headerElement); // Render the header
  renderWithTemplate(footer, footerElement); // Render the footer
}
