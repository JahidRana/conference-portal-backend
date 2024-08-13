const express = require('express');
const router = express.Router();
const ContactController = require("../../controllers/contact.controller")

router.route("/").post(ContactController.createContactController);

module.exports = router;