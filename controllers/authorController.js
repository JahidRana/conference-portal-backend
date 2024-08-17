const cloudinary = require('../config/cloudinaryConfig');
const SubmissionGuideline=require("../models/sumissionForm.model")
const authorSubmit=require("../models/authorSubmit.model")
const AcceptedPaper = require('../models/acceptePaperschema.model'); // New model
const authorSubmitServices = require("../services/authorSubmit.services");

exports.CreateAuthorSubmitController = async (req, res, next) => {
    try {
      // Check if a file is uploaded
      if (!req.file) {
        return res.status(400).json({
          status: "Fail",
          message: "No file uploaded",
        });
      }
  
      // Cloudinary upload
      const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "raw", // for PDF and other non-image files
        folder: "submit-papers",
        use_filename: true,
        unique_filename: false,
        overwrite: true
      });
  
      // Prepare submission information
      const submitInformation = {
        ...req.body,
        fileURL: cloudinaryResponse.secure_url, // URL of the uploaded file
        public_id: cloudinaryResponse.public_id // Public ID for future reference
      };
  
      console.log(submitInformation);
        // Extract email from submitInformation
    const email = submitInformation.author?.[0]?.email;
    console.log("From submit info mail:", email);

    // Check for existing record with the same email
    const existingRecord = await authorSubmit.findOne({ "author.email": email });
    console.log("existing record:", existingRecord);

    if (existingRecord) {
      return res.status(400).json({
        status: "Fail",
        message: "Duplicate entry found",
      });
    }

    // Save submission to the database
    const registeredInfo = await authorSubmitServices.createAuthorSubmitServices(submitInformation);

    res.status(200).json({
      status: "success",
      message: "Submission completed successfully",
      data: registeredInfo,
    });
  } catch (err) {
    console.error('Error in CreateAuthorSubmitController:', err);
    res.status(400).json({
      status: "Fail",
      message: "Submission failed",
      error: {
        message: err.message,
        name: err.name,
        http_code: err.status || 400,
      },
    });
  }
};
//GetResearchAreasController

exports.GetResearchAreasController = async (req, res, next) => {
    try {
        const guidelines = await SubmissionGuideline.findOne(); // Assuming there is only one document
        res.status(200).json({
            status: "success",
            data: guidelines.researchAreas,
        });
    } catch (err) {
        res.status(400).json({
            status: "Fail",
            message: "Failed to fetch research areas",
            error: err,
        });
    }
};


exports.GetAuthorSubmitController = async (req, res, next) => {
    console.log(req.query);
    const {page=1, limit=8} =req.query;
    const skip = (page-1)*parseInt(limit);
    queries.skip = skip;
    queries.limit =limit;
    try {
        
        const registeredInfo = await authorSubmitServices.getAuthorSubmitServices(queries);
        res.status(200).json({
            status: "success",
            message: "Submitted data get successfully",
            data: registeredInfo
        })
    } catch (err) {
        res.status(400).json({
            status: "Fail",
            message: "Can't Submitted data get",
            error: err,
            
        })
    }
};
exports.GetAuthorSubmitByEmailController = async (req, res, next) => {
   
    const {page=1, limit=8, email} =req.query;
    const skip = (page-1)*parseInt(limit);
    // queries.skip = skip;
    // queries.limit =limit;
    // queries.email =email;
   // Initialize queries object
   const queries = {
    skip,
    limit: parseInt(limit),
    email,
};


    console.log("queries from GetAuthorSubmitByEmailController",queries);
    try {
        
        const registeredInfo = await authorSubmitServices.getAuthorSubmitByEmailServices(queries);
        res.status(200).json({
            status: "success",
            message: "Submitted data get successfully",
            data: registeredInfo
        })
    } catch (err) {
        res.status(400).json({
            status: "Fail",
            message: "Can't Submitted data get",
            error: err,
            
        })
    }
};
exports.GetReviewerAssignedPaperByEmailController = async (req, res, next) => {
    console.log("++++++++++++++++",req.query);
    const {page=1, limit=8, email} =req.query;
    const skip = (page-1)*parseInt(limit);
    queries.skip = skip;
    queries.limit =limit;
    queries.email =email;
    console.log("queries from GetAuthorSubmitByEmailController",queries);
    try {
        
        const registeredInfo = await authorSubmitServices.GetReviewerAssignedPaperByEmailServices(queries);
        res.status(200).json({
            status: "success",
            message: "Submitted data get successfully",
            data: registeredInfo
        })
    } catch (err) {
        res.status(400).json({
            status: "Fail",
            message: "Can't Submitted data get",
            error: err,
            
        })
    }
};
exports.GetAuthorSubmitByIdController = async (req, res, next) => {
   
    const {id } = req.params;
    console.log("connectedhfgxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",id);
    const queries = {_id : id};
    
    try {
        
        const registeredInfo = await authorSubmitServices.getAuthorSubmitByIdServices(queries);
        res.status(200).json({
            status: "success",
            message: "Submitted data get successfully",
            data: registeredInfo
        })
    } catch (err) {
        res.status(400).json({
            status: "Fail",
            message: "Can't Submitted data get",
            error: err,
            
        })
    }
};


exports.GetAllPapersController = async (req, res, next) => {
    try {
        // Fetch all papers including all fields
        const papers = await authorSubmit.find({}); // Fetch all fields of all documents

        res.status(200).json({
            status: "success",
            data: papers,
        });
    } catch (err) {
        res.status(400).json({
            status: "Fail",
            message: "Failed to fetch paper details",
            error: err,
        });
    }
};

//acceptPaperController
exports.acceptPaperController = async (req, res) => {
    try {
        const { paperId } = req.body;

        // Find the paper by ID
        const paper = await authorSubmit.findById(paperId);

        if (!paper) {
            return res.status(404).json({
                status: "fail",
                message: "Paper not found",
            });
        }

        // Check if the paper is already accepted
        if (paper.accepted) {
            return res.status(400).json({
                status: "fail",
                message: "Paper has already been accepted",
            });
        }

        // Create a new document in the AcceptedPaper collection with the paper's data
        const acceptedPaper = new AcceptedPaper({
            title: paper.title,
            abstract: paper.abstract,
            paperDomain: paper.paperDomain,
            keywords: paper.keywords,
            cloudinaryURL: paper.cloudinaryURL,
            cloudinaryPublicID: paper.cloudinaryPublicID,
            assignedReviewer: paper.assignedReviewer,
            review: paper.review,
            author: paper.author,
            accepted: true // Mark as accepted
        });

        // Save the accepted paper
        await acceptedPaper.save();

        // Update the original paper to mark it as accepted
        paper.accepted = true;
        await paper.save();

        res.status(200).json({
            status: "success",
            message: "Paper accepted and saved successfully",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Failed to accept paper",
            error: err.message,
        });
    }
};

exports.acceptPaperList=async (req, res) => {
    try {
        const papers = await AcceptedPaper.find();
        res.status(200).json({
            status: "success",
            data: papers
        });
    } catch (err) {
        res.status(400).json({
            status: "Fail",
            message: "Failed to fetch accepted papers",
            error: err,
        });
    }
};