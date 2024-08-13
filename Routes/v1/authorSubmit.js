const express = require('express');
const router = express.Router();
const authorController = require("../../controllers/authorController")


router.route("/get-paper-by-email").get(authorController.GetAuthorSubmitByEmailController);
router.route("/get-reviewer-assigned-paper-by-email").get(authorController.GetReviewerAssignedPaperByEmailController);
router.route("/:id").get(authorController.GetAuthorSubmitByIdController);
router.route("/").post(authorController.CreateAuthorSubmitController);
router.route("/").get(authorController.GetAuthorSubmitController);


module.exports = router;