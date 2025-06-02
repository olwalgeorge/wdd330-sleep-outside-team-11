import ExternalServices from "./ExternalServices.mjs";
import { loadHeaderFooter } from "./utils.mjs";

// Load header and footer
loadHeaderFooter();

class SignUpProcess {
  constructor() {
    this.services = new ExternalServices();
    this.avatarFile = null;
    this.init();
  }

  init() {
    // Set up form submission
    document.getElementById("signup-form").addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // Set up password confirmation validation
    document.getElementById("confirmPassword").addEventListener("input", () => {
      this.validatePasswordMatch();
    });

    // Set up avatar preview
    document.getElementById("avatar").addEventListener("change", (e) => {
      this.handleAvatarChange(e);
    });

    // Real-time validation for email
    document.getElementById("email").addEventListener("blur", () => {
      this.validateEmail();
    });
  }

  async handleSubmit() {
    // Clear previous errors
    this.clearErrors();

    // Validate form
    if (!this.validateForm()) {
      return;
    }

    try {
      // Show loading state
      this.setLoadingState(true);

      // Prepare user data
      const userData = await this.prepareUserData();

      // Create user account
      const result = await this.services.createUser(userData);

      // Handle successful signup
      this.handleSuccessfulSignup(result);
    } catch (error) {
      this.handleSignupError(error);
    } finally {
      this.setLoadingState(false);
    }
  }

  validateForm() {
    const form = document.getElementById("signup-form");
    let isValid = true;

    // Check HTML5 validation
    if (!form.checkValidity()) {
      form.reportValidity();
      isValid = false;
    }

    // Custom validations
    if (!this.validatePasswordMatch()) {
      isValid = false;
    }

    if (!this.validateEmail()) {
      isValid = false;
    }

    if (!this.validateAvatarFile()) {
      isValid = false;
    }

    return isValid;
  }

  validatePasswordMatch() {
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (confirmPassword && password !== confirmPassword) {
      this.showFieldError("confirmPassword", "Passwords do not match");
      return false;
    } else {
      this.clearFieldError("confirmPassword");
      return true;
    }
  }

  validateEmail() {
    const email = document.getElementById("email").value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email && !emailRegex.test(email)) {
      this.showFieldError("email", "Please enter a valid email address");
      return false;
    } else {
      this.clearFieldError("email");
      return true;
    }
  }

  validateAvatarFile() {
    const fileInput = document.getElementById("avatar");
    const file = fileInput.files[0];

    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        this.showFieldError("avatar", "File size must be less than 5MB");
        return false;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        this.showFieldError("avatar", "Please select a valid image file");
        return false;
      }
    }

    this.clearFieldError("avatar");
    return true;
  }

  handleAvatarChange(event) {
    const file = event.target.files[0];
    const preview = document.getElementById("avatar-preview");
    const image = document.getElementById("avatar-image");
    const placeholder = preview.querySelector(".avatar-placeholder");

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        image.src = e.target.result;
        image.style.display = "block";
        placeholder.style.display = "none";
      };
      reader.readAsDataURL(file);
      this.avatarFile = file;
    } else {
      image.style.display = "none";
      placeholder.style.display = "block";
      this.avatarFile = null;
    }
  }

  async prepareUserData() {
    const formData = new FormData(document.getElementById("signup-form"));
    const userData = {};

    // Extract form data
    for (let [key, value] of formData.entries()) {
      if (key !== "avatar" && key !== "confirmPassword") {
        userData[key] = value;
      }
    }

    // Convert avatar to base64 if present
    if (this.avatarFile) {
      userData.avatar = await this.fileToBase64(this.avatarFile);
    }

    // Format the data structure
    return {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      address: {
        street: userData.street,
        city: userData.city,
        state: userData.state,
        zipCode: userData.zipCode,
        country: userData.country,
      },
      avatar: userData.avatar || null,
      newsletter: userData.newsletter === "on",
      createdAt: new Date().toISOString(),
    };
  }

  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  handleSuccessfulSignup(result) {
    // Store user info (without password)
    const userInfo = {
      id: result.id,
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email,
    };
    localStorage.setItem("user", JSON.stringify(userInfo));

    // Redirect to success page or dashboard
    window.location.href = "./success.html";
  }

  handleSignupError(error) {
    let errorMessage =
      "An error occurred while creating your account. Please try again.";

    if (error.name === "servicesError") {
      if (error.message && typeof error.message === "object") {
        errorMessage = this.formatServerError(error.message);
      } else {
        errorMessage = error.message || errorMessage;
      }
    }

    this.showError(errorMessage);
  }

  formatServerError(serverResponse) {
    if (serverResponse.message) {
      return serverResponse.message;
    }

    if (serverResponse.errors) {
      return Object.values(serverResponse.errors).join(", ");
    }

    return "Please check your information and try again.";
  }

  showError(message) {
    const errorDiv = document.getElementById("signup-error");
    errorDiv.innerHTML = `<p class="error-message">❌ ${message}</p>`;
    errorDiv.style.display = "block";
    errorDiv.scrollIntoView({ behavior: "smooth" });
  }

  showFieldError(fieldName, message) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    const inputElement = document.getElementById(fieldName);

    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = "block";
    }

    if (inputElement) {
      inputElement.classList.add("error");
    }
  }

  clearFieldError(fieldName) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    const inputElement = document.getElementById(fieldName);

    if (errorElement) {
      errorElement.textContent = "";
      errorElement.style.display = "none";
    }

    if (inputElement) {
      inputElement.classList.remove("error");
    }
  }

  clearErrors() {
    const errorElements = document.querySelectorAll(".error-message");
    errorElements.forEach((element) => {
      element.textContent = "";
      element.style.display = "none";
    });

    const inputElements = document.querySelectorAll("input.error");
    inputElements.forEach((element) => {
      element.classList.remove("error");
    });

    const signupError = document.getElementById("signup-error");
    if (signupError) {
      signupError.style.display = "none";
    }
  }

  setLoadingState(isLoading) {
    const submitButton = document.getElementById("signup-submit");
    const form = document.getElementById("signup-form");

    if (isLoading) {
      submitButton.disabled = true;
      submitButton.classList.add("loading");
      submitButton.textContent = "Creating Account...";
      form.style.pointerEvents = "none";
    } else {
      submitButton.disabled = false;
      submitButton.classList.remove("loading");
      submitButton.textContent = "Create Account";
      form.style.pointerEvents = "auto";
    }
  }
}

// Initialize the signup process
new SignUpProcess();
