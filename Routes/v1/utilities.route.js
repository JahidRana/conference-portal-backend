const express = require('express');
const router = express.Router();
const utilitiesController = require("../../controllers/utilities.controller")


router.route("/").get(utilitiesController.getHomePageMassageController);
router.route("/get-date").get(utilitiesController.getDatesController);



module.exports = router;