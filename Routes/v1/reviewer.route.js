const express = require('express');
const router = express.Router();
const reviewerController = require("../../controllers/reviewer.controller")

router.route("/").post(reviewerController.CreateReviewerController);
router.route("/get-reviewer").post(reviewerController.GetReviewerController);
router.route("/selected-reviewer").post(reviewerController.CreateSelectedReviewerController);
router.route("/").get(reviewerController.GetRequestedReviewersController);
router.route("/selected-reviewer-list").get(reviewerController.GetAllReviewerListController);
router.route("/:email").delete(reviewerController.deleteReviewerByIdController);
router.route("/reviewer-list/:email").delete(reviewerController.deleteSelectedReviewerController);
router.route("/:id").patch(reviewerController.UpdatePaperToAssigningReviewerController);
router.route("/reviewing/:id").patch(reviewerController.UploadingReviewController);

module.exports = router;