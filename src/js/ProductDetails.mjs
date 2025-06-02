import { findProductById } from "./ProductData.mjs";
import { getParam } from "./utils.mjs";

export async function renderProductDetails() {
  // Get the product id from URL parameter
  const productId = getParam("product");
  if (!productId) {
    return;
  }

  try {
    // Get the product details from the data module
    const product = await findProductById(productId);

    if (!product) {
      return;
    }

    // Render the product details in the DOM
    document.getElementById("productName").textContent = product.Name;
    document.getElementById("productNameWithoutBrand").textContent =
      product.NameWithoutBrand || "";

    // Handle different image formats from the API
    let imagePath = product.Images?.PrimaryLarge || product.Image;
    if (imagePath && imagePath.includes("../images")) {
      imagePath = imagePath.replace("../images", "/images");
    }

    document.getElementById("productImage").src = imagePath;
    document.getElementById("productImage").alt = product.Name;
    document.getElementById("productFinalPrice").textContent =
      `$${product.FinalPrice}`;
    document.getElementById("productColorName").textContent =
      product.Colors[0].ColorName;
    document.getElementById("productDescriptionHtml").innerHTML =
      product.DescriptionHtml;

    // Set the product ID for the "Add to Cart" button
    document.getElementById("addToCart").setAttribute("data-id", product.Id);

    // Update the page title
    document.title = `Sleep Outside | ${product.Name}`;
  } catch (error) {
    // Error handling without console.error
  }
}
