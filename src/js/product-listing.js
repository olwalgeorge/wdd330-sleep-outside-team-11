import { loadHeaderFooter, updateCartCount, getParam } from "./utils.mjs";
import { renderProductList } from "./ProductListing.mjs";

function formatCategory(category) {
  if (!category) return "Products";
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

document.addEventListener("DOMContentLoaded", () => {
  // Load header and footer
  try {
    loadHeaderFooter();
  } catch (error) {
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
      }
    }
  }

  // Initial render
  renderProducts();

  // Update cart count
  try {
    updateCartCount();
  } catch (error) {
    console.error("Failed to update cart count:", error);
  }

  // Add event listener for sort changes
  if (sortSelect) {
    sortSelect.addEventListener("change", renderProducts);
  }
});
