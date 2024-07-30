// Check if user is already logged in
window.addEventListener("load", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    window.location.href = "/login";
  }
});

// Function to display dynamic user details
function loadUserDetails() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    document.getElementById("username").textContent = user.username || "";
    document.getElementById("userName").textContent = user.username || "";
    document.getElementById("userEmail").textContent = user.email || "";
    document.getElementById("firstName").textContent = user.firstName || "";
    document.getElementById("lastName").textContent = user.lastName || "";
    document.getElementById("phoneNumber").textContent = user.phoneNumber || "";
  } else {
    document.getElementById("username").textContent = "Guest";
  }
}

// Call the function to load user details when the page loads
loadUserDetails();

function showCustomAlert(message, isError = false) {
  const alertBox = document.getElementById("customAlert");
  const alertMessage = document.getElementById("alertMessage");

  alertMessage.textContent = message;
  alertBox.className = `custom-alert ${isError ? "error" : ""}`;
  alertBox.style.display = "block";

  // Hide the alert after 5 seconds
  setTimeout(() => {
    alertBox.style.display = "none";
  }, 5000);
}

function closeCustomAlert() {
  const alertBox = document.getElementById("customAlert");
  alertBox.style.display = "none";
}

// Example function to simulate profile update
function updateProfile() {
  showCustomAlert("Profile update feature coming soon!");
}

// Example function to redirect to settings
function goToSettings() {
  window.location.href = "/settings";
}
