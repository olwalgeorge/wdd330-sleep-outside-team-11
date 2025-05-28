import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="../product_pages/?product=${product.Id}">
      <img
        src="${product.Images.PrimaryMedium}"
        alt="Image of ${product.Name}"
      />
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData(this.category);
    this.renderList(list);
    this.updateTitle();
  }

  updateTitle() {
    const titleElement = document.querySelector("h2");
    if (titleElement && this.category) {
      const categoryName =
        this.category.charAt(0).toUpperCase() +
        this.category.slice(1).replace("-", " ");
      titleElement.textContent = `Top Products: ${categoryName}`;
    }
  }

  renderList(list) {
    // Clear existing content first to prevent duplicates
    this.listElement.innerHTML = "";
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }

  sortProducts(sortType) {
    let sortedProducts = [...this.products];

    switch (sortType) {
      case "name":
        sortedProducts.sort((a, b) => {
          const nameA = a.NameWithoutBrand || a.Name;
          const nameB = b.NameWithoutBrand || b.Name;
          return nameA.localeCompare(nameB);
        });
        break;

      case "name-desc":
        sortedProducts.sort((a, b) => {
          const nameA = a.NameWithoutBrand || a.Name;
          const nameB = b.NameWithoutBrand || b.Name;
          return nameB.localeCompare(nameA);
        });
        break;

      case "price":
        sortedProducts.sort((a, b) => {
          return parseFloat(a.FinalPrice) - parseFloat(b.FinalPrice);
        });
        break;

      case "price-desc":
        sortedProducts.sort((a, b) => {
          return parseFloat(b.FinalPrice) - parseFloat(a.FinalPrice);
        });
        break;

      case "brand":
        sortedProducts.sort((a, b) => {
          return a.Brand.Name.localeCompare(b.Brand.Name);
        });
        break;

      case "brand-desc":
        sortedProducts.sort((a, b) => {
          return b.Brand.Name.localeCompare(a.Brand.Name);
        });
        break;

      case "default":
      default:
        // Use original order
        sortedProducts = [...this.products];
        break;
    }

    this.renderList(sortedProducts);
  }
}
