const asyncHandler = require(`express-async-handler`);
const path = require(`path`);

const homePage = asyncHandler(async (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

const loginPage = asyncHandler(async (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "public", "authentication", "login.html")
  );
});
const registerPage = asyncHandler(async (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "public", "authentication", "register.html")
  );
});

const verifyAccountPage = asyncHandler(async (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "public", "authentication", "verifyAccount.html")
  );
});

const changePasswordPage = asyncHandler(async (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "..",
      "public",
      "authentication",
      "change-password.html"
    )
  );
});

const resetPasswordPage = asyncHandler(async (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "..",
      "public",
      "authentication",
      "reset-password.html"
    )
  );
});

const forgotPasswordPage = asyncHandler(async (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "..",
      "public",
      "authentication",
      "forgot-password.html"
    )
  );
});

const notFoundPage = asyncHandler(async (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "404.html"));
});

const dashboardPage = asyncHandler(async (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "dashboard.html"));
});

module.exports = {
  homePage,
  notFoundPage,
  loginPage,
  registerPage,
  resetPasswordPage,
  forgotPasswordPage,
  changePasswordPage,
  verifyAccountPage,
  dashboardPage,
};
