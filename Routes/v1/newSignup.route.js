const express = require('express');
const router = express.Router();
const newsignUpController = require("../../controllers/newSignup.controller");


router.route("/sign-up").post(newsignUpController.CreateSignUpController);
router.route("/verify-otp").post(newsignUpController.VerifyOtpController);

module.exports = router;