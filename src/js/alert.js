// Export the Alert class as the default export of the module
export default class Alert {
  // Constructor takes an optional path to the JSON file that contains alert data
  constructor(jsPath = "./public/json/alert.json") {
    this.jsPath = jsPath; // Path to the JSON file
    this.alerts = []; // Array to store alert data after it's fetched
  }

  /**
   * Asynchronously fetches the alerts from the JSON file specified in `this.jsPath`.
   * If successful, it saves the alert data to `this.alerts`.
   * If an error occurs (e.g., file not found or server issue), it logs an error.
   */
  async fetchAlerts() {
    try {
      const response = await fetch(this.jsPath); // Fetch the JSON file
      if (!response.ok) {
        // If response is not OK (e.g., 404, 500), throw an error
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.alerts = await response.json(); // Parse and store JSON data
    } catch (error) {
      // Log any errors that occur during fetch or parsing
      console.error("Error fetching alerts:", error);
    }
  }

  /**
   * Renders the fetched alerts to the page.
   * It looks for an element with the ID `alert-container`, and appends a new div
   * for each alert that includes the title, message, and a close button.
   * Clicking the close button removes the alert from the DOM.
   */
  renderAlerts() {
    // Find the container where alerts should be rendered
    const alertContainer = document.getElementById("alert-container");

    // If container is not found, exit early and log an error
    if (!alertContainer) {
      console.error("Alert container not found");
      return;
    }

    // Loop through each alert object stored in this.alerts
    this.alerts.forEach((alert) => {
      // Create a new <div> element to hold the alert
      const alertDiv = document.createElement("div");
      alertDiv.className = "alert"; // You can style this class in CSS

      // Set the inner HTML using template literals
      // Includes: title, message, and a close button
      alertDiv.innerHTML = `
        <strong>${alert.title}</strong>
        <p>${alert.message}</p>
        <button class="close-btn">Close</button>
      `;

      // Find the close button within the current alert div
      const closeButton = alertDiv.querySelector(".close-btn");

      // Attach a click event listener to the close button
      // When clicked, it will remove the alert from the DOM
      closeButton.addEventListener("click", () => {
        alertDiv.remove();
      });

      // Append the alert <div> to the container on the page
      alertContainer.appendChild(alertDiv);
    });
  }
}
