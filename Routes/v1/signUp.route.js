const express = require('express');
const router = express.Router();
const signUpController = require("../../controllers/signUp.controller")

router.route("/").post(signUpController.CreateSignUpController);

module.exports = router;