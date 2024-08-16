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

router.route("/get-paper-by-email").get(authorController.GetAuthorSubmitByEmailController);
router.route("/get-reviewer-assigned-paper-by-email").get(authorController.GetReviewerAssignedPaperByEmailController);

router.post('/upload', upload.single('file'), authorController.CreateAuthorSubmitController);

router.route("/:id").get(authorController.GetAuthorSubmitByIdController);

router.route("/").get(authorController.GetAuthorSubmitController);

module.exports = router;
