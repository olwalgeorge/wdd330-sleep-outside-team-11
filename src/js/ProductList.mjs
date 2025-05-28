// Template function to generate the HTML for a single product card
function productCardTemplate(product) {
  // Use PrimaryMedium for product list images, fallback to product.Image
  let imagePath = product.Images?.PrimaryMedium || product.Image;
  if (imagePath && imagePath.includes("../images")) {
    imagePath = imagePath.replace("../images", "/images");
  }
  // Link to product detail page with correct id param
  return `<li class="product-card">
    <a href="product_pages/index.html?product=${product.Id}">
      <img src="${imagePath}" alt="Image of ${product.Name}">
      <h2 class="card__brand">${product.Brand}</h2>
      <h3 class="card__name">${product.Name}</h3>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

export default class ProductList {
  // This class is responsible for managing a list of products
  constructor(category, dataSource, listElement) {
    this.category = category; // Set the category
    this.dataSource = dataSource; // Set the data source
    this.listElement = listElement; // Set the list element
  }

  // Method to fetch products from the data source
  async init() {
    const list = await this.dataSource.getData(this.category); // Fetch products from the data source
    this.render(list); // Render the products
  }

  render(list) {
    this.listElement.innerHTML = ""; // Prevent duplicates
    const htmlStrings = list.map(productCardTemplate);
    this.listElement.insertAdjacentHTML("afterbegin", htmlStrings.join(""));
  }

  renderList(list) {
    this.render(list);
  }
}
