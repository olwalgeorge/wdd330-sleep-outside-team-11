const baseURL = "https://wdd330-backend.onrender.com";

export default class ExternalServices {
  // Fetch products by category
  async getData(category = "tents") {
    const response = await fetch(`${baseURL}/products/search/${category}`);
    const data = await response.json();
    return data.Result;
  }

  // Fetch a single product by id
  async findProductById(id) {
    const response = await fetch(`${baseURL}/product/${id}`);
    const data = await response.json();
    return data.Result;
  }

  // Submit the order to the server
  async checkout(order) {
    const url = "https://wdd330-backend.onrender.com:3000/checkout";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    };
    const response = await fetch(url, options);
    if (!response.ok) throw new Error("Checkout failed");
    return await response.json();
  }
}
