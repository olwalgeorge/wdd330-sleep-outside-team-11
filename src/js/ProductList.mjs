// Template function to generate the HTML for a single product card
function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="product_pages/?product=${product.Id}">
      <img src="${product.Image}" alt="Image of ${product.Name}">
      <h2 class="card__brand">${product.Brand}</h2>
      <h3 class="card__name">${product.Name}</h3>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

export default class productList {
  // ProductList class
  // This class is responsible for managing a list of products
  // Constructor to initialize the ProductList instance
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
  renderList(list) {
    const htmlStrings = list.map(productCardTemplate);
    this.listElement.insertAdjacentHTML("afterbegin", htmlStrings.join(""));
  }
}
