//admin.route
const express = require('express');
const router = express.Router();
const adminController = require("../../controllers/admin.controller")
const cloudinary = require('../../config/cloudinaryConfig');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const upload = require('../../config/multerConfig'); // Adjust the path as necessary

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
      folder: 'speakers',
      format: async (req, file) => file.originalname.split('.').pop(), // Use the original file's format
      public_id: (req, file) => `${Date.now()}-${file.originalname}`, // Use unique filenames
  },
});




router.route("/").post(adminController.CreateAdminController);


//registration route start
router.route("/registration-fee").put(adminController.SaveRegistrationFees);
router.route("/registration-process").put(adminController.saveRegistrationProcess);
router.route("/registration-info").get(adminController.GetRegistrationFees);
router.route("/registration-process").get(adminController.GetRegistrationProcess);
//registration route end


router.route("/get-admin").post(adminController.GetAdminController);
router.route("/").get(adminController.GetAdminController);
router.route("/admin-list").get(adminController.GetAdminListController);
router.route("/admin-list/:email").delete(adminController.removeAdminByEmailController);



//Committe route start here 
//==============================

//remove committe update version
router.route("/committee/:committeeId/member/:memberId").delete(adminController.removeCommitteeByIdController);

//update-committe
router.route("/committee/:committeeId").put(adminController.UpdateCommitteController);

//Full committe fetch

router.route("/committee").get(adminController.GetCommitte);

// Route for removing a committee by its ID
// router.route("/:committeeId").delete(adminController.removeFullcommittee);
router.route("/remove/committe/:id").delete(adminController.removeFullcommittee);

//Committe route end here 
//==============================



//speaker start route here 
//==============================
router.route("/speakers").get(adminController.getSpeaker)
// Speaker route with Multer middleware for picture upload
// router.route("/speaker").post(upload.single('picture'), adminController.createSpeakerController);

// Use the multer middleware to handle file uploads
router.post('/speaker', upload.single('picture'), adminController.createSpeakerController);

//Remove Speaker route 
router.route("/remove/speaker/:id").delete(adminController.removeSpeakerController);

//speaker route end here 
//==============================



router.route("/home-content").patch(adminController.HomePageContentController);


router.route('/update-date').put(adminController.updateConferenceDates);

router.route('/get-update-date').get(adminController.getupdateConferenceDates);

//submission route start here

router.route('/update-submission').put(adminController.updateSubmissioninfo);
router.route('/get-update-submission').get(adminController.getupdateSubmissioninfo);

//submission route end here

//get unapproved user list route
router.route('/unapproved-reviewers').get(adminController.getUnapprovedReviewers);
//save approved user list route
router.route('/approve-reviewer').post(adminController.approveReviewer);

//handle requestes reviewer
router.route('/requested-reviewers').get(adminController.getRequestedReviewers);
router.route('/accept-request').post(adminController.acceptReviewerRequest);
router.route('/reject-request').post(adminController.rejectReviewerRequest);

// Route to get approved reviewers
router.route('/approved-reviewers-list').get(adminController.getApprovedReviewers);

// Route to delete a reviewer
router.route('/reviewer/:id').delete(adminController.deleteReviewer);
router.route('/add-user').post(adminController.addUserManually);

//router for get reviewer role dropdown select
router.route('/get-reviewers').get(adminController.getReviewers);

//router for customize domain data store
router.route('/cutomize-domains').post(adminController.customizeDomainController);
router.route('/get-cutomize-domains').get(adminController.getcustomizeDomainController);
router.route('/reject-paper').patch(adminController.rejectPaperController);
router.route('/get-reviews-info/:paperId').get(adminController.getReviewsinfoController);

router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
})


module.exports = router;