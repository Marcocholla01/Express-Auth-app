async function verifyAccount(verificationCode) {
  try {
    const response = await fetch(`/api/v1/auth/verify/${verificationCode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const result = await response.json();
    if (response.ok) {
      showToast("Verification successful", "success");
      setTimeout(() => (window.location.href = "/login"), 2000); // Redirect after 2 seconds
    } else {
      showToast(result.message || "Verification failed", "error");
    }
  } catch (error) {
    console.error("Error:", error);
    showToast("An error occurred. Please try again.", "error");
  }
}

// Extract verification code (JWT) from URL path
const pathSegments = window.location.pathname.split("/");
const verificationCode = pathSegments[pathSegments.length - 1];

if (verificationCode) {
  verifyAccount(verificationCode);
} else {
  showToast("Invalid verification code.", "error");
}
