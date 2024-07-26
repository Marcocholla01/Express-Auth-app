const router = require(`express`).Router();

router.post(`/register`);
router.post(`/login`);
router.post(`/logout`);
router.post(`/forgot-password`);
router.post(`/reset-password/:resetToken`);

module.exports = router;
