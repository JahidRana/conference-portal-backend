const express = require('express');
const router = express.Router();
const trackController = require("../../controllers/track.controller")


router.route("/:email").delete(trackController.deleteAssignedReviewerController);



module.exports = router;