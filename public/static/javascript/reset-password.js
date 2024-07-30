document
  .getElementById("resetPasswordForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Validate that passwords match
    if (data.newPassword !== data.confirmNewPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    // Assume we have a query parameter `token` to verify user
    // const urlParams = new URLSearchParams(window.location.search);
    // const token = urlParams.get("token");

    // Extract verification code (JWT) from URL path
    const pathSegments = window.location.pathname.split("/");
    const resetToken = pathSegments[pathSegments.length - 1];

    try {
      //   const response = await fetch(
      //     `/api/v1/auth/reset-password?token=${token}`,
      //     {
      //       method: "POST",
      //       headers: { "Content-Type": "application/json" },
      //       body: JSON.stringify({
      //         confirmNewPassword: data.confirmNewPassword,
      //         newPassword: data.newPassword,
      //       }),
      //     }
      //   );
      const response = await fetch(
        `/api/v1/auth/reset-password/${resetToken}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            confirmNewPassword: data.confirmNewPassword,
            newPassword: data.newPassword,
          }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        showToast("Password reset successful", "success");
        setTimeout(() => (window.location.href = "/login"), 2000); // Redirect after 2 seconds
      } else {
        showToast(result.message || "Password reset failed", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("An error occurred. Please try again.", "error");
    }
  });
