async function logout() {
  try {
    const response = await fetch("/api/v1/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const result = await response.json();
    if (response.ok) {
      // Clear user details from localStorage
      localStorage.removeItem("user");
      showCustomAlert("Successfully logged out. Redirecting...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000); // Redirect after 2 seconds
    } else {
      showCustomAlert(result.message || "Logout failed", true);
    }
  } catch (error) {
    console.error("Error:", error);
    showCustomAlert("An error occurred during logout. Please try again.", true);
  }
}
