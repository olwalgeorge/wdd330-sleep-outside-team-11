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
