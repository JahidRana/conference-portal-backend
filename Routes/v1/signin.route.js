const express = require('express');
const router = express.Router();
const signInController = require("../../controllers/signin.controller");


router.route("/signin/getdashboard").get(signInController.getDashboardURL); // Check this line

router.route("/signin").post(signInController.CreateSigninController);
router.route("/signin/admin").post(signInController.CreateAdminSigninController);


module.exports = router;