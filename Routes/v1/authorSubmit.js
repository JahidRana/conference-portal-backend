const express = require('express');
const router = express.Router();
const authorController = require("../../controllers/authorController");
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../../config/cloudinaryConfig');

// Configure multer storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'submit-papers',
    resource_type: 'raw', // Explicitly set resource type to 'raw' for non-image files like PDFs
    format: async (req, file) => file.originalname.split('.').pop(), // Extracts the file extension
    public_id: (req, file) => `${Date.now()}-${file.originalname.replace(/\s+/g, '_').replace(/\.[^/.]+$/, "")}`, // Ensure no spaces and avoid double extensions
  },
});

const upload = multer({ storage: storage });

router.route("/get-research-areas").get(authorController.GetResearchAreasController);

router.get('/get-papers', authorController.GetAllPapersController);
router.route("/accept-paper").patch(authorController.acceptPaperController);
router.route("/unaccept-paper").patch(authorController.unacceptPaperController);
router.route("/delete-paper").delete(authorController.deletePaperController);
router.get('/accepted-papers-list',authorController.acceptPaperList);
// router.route("/get-paper-by-email").get(authorController.GetAuthorSubmitByEmailController);

router.route("/get-paper-by-email-role").get(authorController.GetpaperByEmailandRoleController);


router.route("/get-reviewer-assigned-paper-by-email").get(authorController.GetReviewerAssignedPaperByEmailController);

router.post('/upload', upload.single('file'), authorController.CreateAuthorSubmitController);

router.route("/:id").get(authorController.GetAuthorSubmitByIdController);

router.route("/").get(authorController.GetAuthorSubmitController);

//assign reviewers
router.route("/assign-reviewers").patch(authorController.AssignReviewerController);



module.exports = router;
