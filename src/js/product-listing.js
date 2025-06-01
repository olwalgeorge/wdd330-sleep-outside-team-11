
import { loadHeaderFooter, updateCartCount, getParam } from "./utils.mjs";
import { renderProductList } from "./ProductListing.mjs";

function formatCategory(category) {
  if (!category) return "Products";
  return category
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

document.addEventListener("DOMContentLoaded", () => {
  // Load header and footer
  try {
    loadHeaderFooter();
  } catch (error) {
    // Handle error silently
  }

  // Get search query and category parameters
  const searchQuery = getParam("search");
  const validCategories = ["tents", "sleeping-bags", "backpacks", "all"];
  const category = validCategories.includes(getParam("category")) ? getParam("category") : "all";
  
  // Determine display content based on search vs category
  let displayTitle, displayBreadcrumb;
  if (searchQuery && searchQuery.trim()) {
    displayTitle = `Search Results`;
    displayBreadcrumb = `Search: "${searchQuery}"`;
    document.title = `Sleep Outside | Search: ${searchQuery}`;
  } else {
    const displayCategory = formatCategory(category);
    displayTitle = displayCategory;
    displayBreadcrumb = displayCategory;
    document.title = `Sleep Outside | ${displayCategory}`;
  }

  // Update page display elements
  const categoryTitle = document.getElementById("category-title");
  const categoryName = document.getElementById("category-name");
  if (categoryTitle && categoryName) {
    categoryTitle.textContent = displayTitle;
    categoryName.textContent = displayBreadcrumb;
  }

  // Get sort select element
  const sortSelect = document.getElementById("sort-select");  // Function to render products with current sort
  function renderProducts() {
    const sortValue = sortSelect ? sortSelect.value : "name-asc"; // Default to name-asc
    try {
      renderProductList(".product-list", category, sortValue, searchQuery);
    } catch (error) {
      const productList = document.querySelector(".product-list");
      if (productList) {
        productList.innerHTML = "<li>Unable to load products. Please try again later.</li>";
      }
    }
  }

  // Initial render
  renderProducts();

  // Update cart count
  try {
    updateCartCount();
  } catch (error) {
    // Handle error silently
  }

  // Add event listener for sort changes
  if (sortSelect) {
    sortSelect.addEventListener("change", renderProducts);
  }
});