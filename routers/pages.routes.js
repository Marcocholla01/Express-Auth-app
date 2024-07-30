const router = require(`express`).Router();
const {
  homePage,
  notFoundPage,
  loginPage,
  registerPage,
  forgotPasswordPage,
  resetPasswordPage,
  verifyAccountPage,
  changePasswordPage,
  dashboardPage,
} = require("../controllers/pages.controllers");

router.get(`/`, homePage);
router.get(`/register`, registerPage);
router.get(`/dashboard`, dashboardPage);
router.get(`/forgot-password`, forgotPasswordPage);
router.get(`/reset-password/:resetToken`, resetPasswordPage);
router.get(`/activate/:verifyToken`, verifyAccountPage);
router.get(`/change-password`, changePasswordPage);
router.get(`/login`, loginPage);
router.get("*", notFoundPage);

module.exports = router;
