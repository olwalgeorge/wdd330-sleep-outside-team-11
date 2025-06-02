<<<<<<< HEAD
=======

>>>>>>> d67fb3abc8266d1ae029c39b3d4ccb4e6dc94f21
import { loadHeaderFooter, updateCartCount, getParam } from "./utils.mjs";
import { renderProductList } from "./ProductListing.mjs";

function formatCategory(category) {
  if (!category) return "Products";
  return category
    .split("-")
<<<<<<< HEAD
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
=======
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
>>>>>>> d67fb3abc8266d1ae029c39b3d4ccb4e6dc94f21
    .join(" ");
}

document.addEventListener("DOMContentLoaded", () => {
  // Load header and footer
  try {
    loadHeaderFooter();
  } catch (error) {
<<<<<<< HEAD
    console.error("Failed to load header/footer:", error);
  }

  // Get and validate category
  const validCategories = ["tents", "sleeping-bags", "backpacks", "all"];
  const category = validCategories.includes(getParam("category"))
    ? getParam("category")
    : "all";
  const displayCategory = formatCategory(category);

  // Update category display
  const categoryTitle = document.getElementById("category-title");
  const categoryName = document.getElementById("category-name");
  if (categoryTitle && categoryName) {
    categoryTitle.textContent = displayCategory;
    categoryName.textContent = displayCategory;
    document.title = `Sleep Outside | ${displayCategory}`;
  } else {
    console.error("Category title or name element not found");
  }

  // Get sort select element
  const sortSelect = document.getElementById("sort-select");

  // Function to render products with current sort
  function renderProducts() {
    const sortValue = sortSelect ? sortSelect.value : "name-asc"; // Default to name-asc
    try {
      renderProductList(".product-list", category, sortValue);
    } catch (error) {
      console.error("Failed to render product list:", error);
      const productList = document.querySelector(".product-list");
      if (productList) {
        productList.innerHTML =
          "<li>Unable to load products. Please try again later.</li>";
=======
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
>>>>>>> d67fb3abc8266d1ae029c39b3d4ccb4e6dc94f21
      }
    }
  }

  // Initial render
  renderProducts();

  // Update cart count
  try {
    updateCartCount();
  } catch (error) {
<<<<<<< HEAD
    console.error("Failed to update cart count:", error);
=======
    // Handle error silently
>>>>>>> d67fb3abc8266d1ae029c39b3d4ccb4e6dc94f21
  }

  // Add event listener for sort changes
  if (sortSelect) {
    sortSelect.addEventListener("change", renderProducts);
<<<<<<< HEAD
  } else {
    console.error("Sort select element not found");
  }
});
=======
  }
});
>>>>>>> d67fb3abc8266d1ae029c39b3d4ccb4e6dc94f21
