const express = require('express');
const router = express.Router();
const newsignUpController = require("../../controllers/newSignup.controller");
const upload = require('../../config/multerConfig'); // Using multer memory storage configuration

// Route to handle sign-up with CV upload
router.post('/sign-up', upload.single('cv'), newsignUpController.CreateSignUpController);

// Route to handle OTP verification
router.route("/verify-otp").post(newsignUpController.VerifyOtpController);

module.exports = router;
