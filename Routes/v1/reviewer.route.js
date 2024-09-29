const express = require('express');
const router = express.Router();
const multer = require('multer'); // Ensure multer is imported
const reviewerController = require("../../controllers/reviewer.controller")
const cloudinary = require('../../config/cloudinaryConfig');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const reviewerStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'reviewer_uploads', // This is the specific folder for reviewer uploads
        format: async (req, file) => file.originalname.split('.').pop(), // Optional: retain original file format
        public_id: (req, file) => 'reviewer-' + Date.now()  // Custom public ID for each upload
    }
});

const reviewerUpload = multer({ storage: reviewerStorage });

router.route("/check/:email").get(reviewerController.CheckStatusReviewer);
router.route("/request").post(reviewerController.CreateReviewerController);

router.route("/newrequest").post(reviewerController.createReviewerWithDifferentRoleController);


router.route("/get-reviewer").post(reviewerController.GetReviewerController);
router.route("/selected-reviewer").post(reviewerController.CreateSelectedReviewerController);
router.route("/").get(reviewerController.GetRequestedReviewersController);
router.route("/selected-reviewer-list").get(reviewerController.GetAllReviewerListController);
router.route("/:email").delete(reviewerController.deleteReviewerByIdController);
router.route("/reviewer-list/:email").delete(reviewerController.deleteSelectedReviewerController);
router.route("/:id").patch(reviewerController.UpdatePaperToAssigningReviewerController);
router.route("/reviewing/:id").patch(reviewerController.UploadingReviewController);


//update reviewers code by me

router.route("/review-papers").get(reviewerController.reviewerReviewController);

router.post('/submit-review', reviewerUpload.single('file'), reviewerController.submitReviewController);




module.exports = router;