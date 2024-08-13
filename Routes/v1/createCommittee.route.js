const express = require('express');
const router = express.Router();
const committeeController = require("../../controllers/createCommittee.controller")

router.route("/").post(committeeController.CreateCommitteeController);
router.route("/").get(committeeController.getCreatedCommitteeController);


module.exports = router;