const express = require('express');
const router = express.Router();
const signInController = require("../../controllers/signin.controller");



router.route("/signin").post(signInController.CreateSigninController);

module.exports = router;