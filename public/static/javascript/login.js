document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        // Save user details to localStorage
        localStorage.setItem("user", JSON.stringify(result.user));

        showToast("Login successful", "success");
        setTimeout(() => (window.location.href = "/dashboard"), 2000); // Redirect after 2 seconds
      } else {
        showToast(result.message || "Login failed", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("An error occurred. Please try again.", "error");
    }
  });
