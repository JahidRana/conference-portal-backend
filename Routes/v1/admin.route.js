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

router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
})


module.exports = router;