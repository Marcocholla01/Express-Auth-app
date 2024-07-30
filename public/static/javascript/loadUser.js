// Check if user is already logged in
window.addEventListener("load", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    window.location.href = "/dashboard";
  }
});
