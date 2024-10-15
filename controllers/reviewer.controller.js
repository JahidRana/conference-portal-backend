const reviewerServices = require("../services/reviewer.services");
const User = require("../models/userSchema.model");
const AuthorSubmit = require("../models/authorSubmit.model");
const Domains = require("../models/domainSchema .model");
const cloudinary = require("cloudinary").v2;
const path = require("path");

// Helper function to upload to Cloudinary using Promises
const uploadToCloudinary = (fileBuffer, nextFileNumber, mimetype) => {
  return new Promise((resolve, reject) => {
    const fileExtension = mimetype.split("/")[1]; // Extract file extension from mimetype (e.g., 'pdf', 'jpeg')
    const resourceType = mimetype.startsWith("image/") ? "image" : "raw"; // Determine if it's an image or raw type (e.g., pdf, docx, etc.)

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "cv", // Cloudinary folder to store files
        resource_type: resourceType, // Specify 'image' or 'raw' based on file type
        public_id: nextFileNumber.toString(), // Name the file as '1', '2', '3', etc.
        format: fileExtension, // Pass the format without dot (e.g., 'pdf', 'jpg')
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result.secure_url); // Resolve the secure URL from Cloudinary
      }
    );

    stream.end(fileBuffer); // End the stream with the file buffer
  });
};

exports.CheckStatusReviewer = async (req, res) => {
  const { email } = req.params;
  const role = "reviewer";
  try {
    // Find the user by email
    const user = await User.findOne({ email, role });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user's information, including isApproved
    res.status(200).json({
      isApproved: user.isApproved,
      role: user.role,
      reviwerrequestStatus: user.reviwerrequestStatus,
      displayName: `${user.firstName} ${user.lastName}`, // Example of returning the full name
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.CreateReviewerController = async (req, res) => {
  const { email, role } = req.body;

  try {
    // Find a reviewer by both email and role
    const existingReviewer = await User.findOne({ email, role });

    if (existingReviewer) {
      // Return the existing reviewer data
      return res.status(200).json(existingReviewer);
    }

    // If no reviewer found, respond with a message indicating no existing reviewer
    res
      .status(404)
      .json({ message: "No reviewer found with the given email and role" });
  } catch (error) {
    res.status(500).json({ message: "Error processing request", error });
  }
};

//review controll request handle
// Controller function for creating a reviewer with a different role
exports.createReviewerWithDifferentRoleController = async (req, res) => {
  const { email, previousRole, newRole, message, domain1, domain2, domain3 } =
    req.body;

  try {
    // Check if a user with the same email and newRole already exists
    const existingReviewer = await User.findOne({ email, role: newRole });
    if (existingReviewer) {
      return res.status(400).json({
        message: "User with this email and role already exists",
      });
    }

    // Find the existing user with the specified email and previous role
    const existingUser = await User.findOne({ email, role: previousRole });
    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "User not found with the specified email and role" });
    }
    let cvUrl = null;
    // Handle CV upload to Cloudinary if file is provided
    if (req.file) {
      try {
        const { buffer, mimetype } = req.file; // Extract file details

        // Fetch the next available file number (this is just an example, you need to implement how you get the next file number)
        const lastUser = await User.findOne().sort({ _id: -1 }).limit(1); // Get the last document in your collection
        const nextFileNumber = lastUser ? parseInt(lastUser._id, 10) + 1 : 1; // Increment based on the last file

        // Upload the file to Cloudinary with the next file number and the correct extension
        cvUrl = await uploadToCloudinary(buffer, nextFileNumber, mimetype);
      } catch (uploadError) {
        return res.status(500).json({
          message: "Error uploading CV to Cloudinary",
          error: uploadError,
        });
      }
    }

    // Create a new reviewer with the updated role, same password, and isApproved set to false
    const newReviewer = new User({
      ...existingUser.toObject(),
      role: newRole,
      message: message,
      isApproved: false, // Set isApproved to false
      isVerified: true, // Mark as verified
      _id: undefined, // Remove _id to create a new document
      password: existingUser.password, // Use the already hashed password
      reviwerrequestStatus: "submitted", // Set the request status as submitted
      domain1: domain1 || null, // Optional field for domain1
      domain2: domain2 || null, // Optional field for domain2
      domain3: domain3 || null, // Optional field for domain3
      cvUrl: cvUrl, // Store the Cloudinary URL of the uploaded CV
    });

    // Save the new reviewer
    const savedReviewer = await newReviewer.save();
    res.status(201).json({
      status: "success",
      message: "Reviewer created successfully",
      data: savedReviewer,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating reviewer", error });
  }
};

exports.checkReviewerRequestStatus = async (req, res) => {
  try {
    const { email } = req.params; // Extract email from the URL params
    const role = "reviewer"; // Hardcoded role as "reviewer"

    // Find the user by email and role
    const user = await User.findOne({ email: email, role: role });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with the specified email and role" });
    }

    // Respond with the reviewer's request status
    res.status(200).json({
      message: "Reviewer request status fetched successfully",
      reviewerrequestStatus: user.reviewerrequestStatus, // Correct spelling of reviewer request status
    });
  } catch (error) {
    console.error("Error checking reviewer request status:", error);
    res
      .status(500)
      .json({
        message: "Error fetching reviewer request status",
        error: error.message,
      });
  }
};

exports.CreateSelectedReviewerController = async (req, res, next) => {
  try {
    const info = req.body;

    if (!info.email) {
      return res.send({ code: 400, massage: "Bad Request" });
    }
    const registeredInfo = await reviewerServices.createSelectedReviewerService(
      info
    );
    res.status(200).json({
      status: "success",
      message: "Reviewer is added successfully",
      data: registeredInfo,
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: "Reviewer Couldn't added Successfully",
      error: err,
    });
  }
};
exports.UpdatePaperToAssigningReviewerController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const info = req.body;
    if (!info[0].value) {
      return res.send({ code: 400, massage: "Bad Request" });
    }

    const registeredInfo =
      await reviewerServices.assigningPaperToReviewerService(id, info);
    res.status(200).json({
      status: "success",
      message: "Reviewer is added successfully to Paper",
      data: registeredInfo,
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: "Reviewer Couldn't added Successfully to Paper",
      error: err,
    });
  }
};
exports.UploadingReviewController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const info = req.body;

    const registeredInfo = await reviewerServices.uploadReviewService(id, info);
    res.status(200).json({
      status: "success",
      message: "Reviewer is added successfully to Paper",
      data: registeredInfo,
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: "Reviewer Couldn't added Successfully to Paper",
      error: err,
    });
  }
};
exports.GetReviewerController = async (req, res, next) => {
  try {
    const email = req.body.email;

    const reviewerList = await reviewerServices.getReviewerServices({
      email: email,
    });
    res.status(200).json({
      status: "success",
      message: "Reviewer List get successfully",
      data: reviewerList,
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: "Can't get Reviewer List",
      error: err,
    });
  }
};
exports.GetAllReviewerListController = async (req, res, next) => {
  try {
    const reviewerList = await reviewerServices.getAllReviewersListServices();
    res.status(200).json({
      status: "success",
      message: "Reviewer Selected List get successfully",
      data: reviewerList,
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: "Can't get Reviewer List",
      error: err,
    });
  }
};
exports.GetRequestedReviewersController = async (req, res, next) => {
  try {
    const reviewerList =
      await reviewerServices.getRequestedReviewersListServices();
    res.status(200).json({
      status: "success",
      message: "Reviewer List get successfully",
      data: reviewerList,
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: "Can't get Reviewer List",
      error: err,
    });
  }
};
exports.deleteReviewerByIdController = async (req, res, next) => {
  try {
    const { email } = req.params;

    const reviewerList = await reviewerServices.deleteReviewerByIdService(
      email
    );
    res.status(200).json({
      status: "success",
      message: "Reviewer Deleted successesFully",
      data: reviewerList,
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: "Can't get Reviewer List",
      error: err,
    });
  }
};
exports.deleteSelectedReviewerController = async (req, res, next) => {
  try {
    const { email } = req.params;

    const reviewerList = await reviewerServices.deleteSelectedReviewerService(
      email
    );
    res.status(200).json({
      status: "success",
      message: "Reviewer Deleted successesFully",
      data: reviewerList,
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: "Can't get Reviewer List",
      error: err,
    });
  }
};

//changes by me
exports.reviewerReviewController = async (req, res) => {
  const reviewerEmail = req.query.email;

  // Validate that the email query parameter is provided
  if (!reviewerEmail) {
    return res.status(400).json({ error: "Email parameter is required." });
  }

  try {
    // Find papers where the reviewer email matches
    const papers = await AuthorSubmit.find(
      { "assignedReviewer.email": reviewerEmail },
      "_id title cloudinaryURL assignedReviewer" // Fetch necessary details along with all reviewers
    );

    // If no papers found, return a custom message
    if (papers.length === 0) {
      return res.status(200).json({ message: "No assigned papers yet." });
    }

    // Process each paper to find the matching reviewer and extract review info
    const response = papers.map((paper) => {
      const reviewer = paper.assignedReviewer.find(
        (r) => r.email === reviewerEmail
      ); // Find the matching reviewer by email
      const reviewInfo = reviewer ? reviewer.reviewInfo : null; // Access the nested reviewInfo

      return {
        id: paper._id,
        title: paper.title,
        paperURL: paper.cloudinaryURL,
        reviewMessage: reviewInfo ? reviewInfo.reviewMessage : null, // Access the review message from reviewInfo
        reviewPicURL: reviewInfo ? reviewInfo.reviewPicURL : null, // Access the review picture URL from reviewInfo
      };
    });

    // Return the found papers with additional review information
    res.status(200).json(response);
  } catch (error) {
    // Handle server errors
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

exports.submitReviewController = async (req, res) => {
  const { reviewMessage, reviewDate, paperId, reviewerEmail, recommendation } =
    req.body;
  const file = req.file;

  // Check for required fields
  if (
    !reviewMessage ||
    !reviewDate ||
    !paperId ||
    !reviewerEmail ||
    !recommendation
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    let reviewPicURL = "";
    let reviewPublicID = "";

    // If a file is provided, store its path and filename
    if (file) {
      reviewPicURL = file.path;
      reviewPublicID = file.filename;
    }

    // Find the paper by its ID
    const paper = await AuthorSubmit.findById(paperId);
    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }

    // Find the specific reviewer in the assignedReviewer array
    const reviewerIndex = paper.assignedReviewer.findIndex(
      (reviewer) => reviewer.email === reviewerEmail
    );
    if (reviewerIndex === -1) {
      return res
        .status(404)
        .json({ message: "Reviewer not found for this paper." });
    }

    // Update the reviewer's reviewInfo
    paper.assignedReviewer[reviewerIndex].reviewInfo = {
      reviewDate,
      reviewMessage,
      recommendation, // Save the recommendation value
      reviewPicURL,
      reviewPublicID,
    };

    // Save the updated paper document
    await paper.save();

    // Return success response
    res
      .status(200)
      .json({ message: "Review submitted successfully", data: paper });
  } catch (error) {
    console.error("Error in submitReviewController:", error);
    // Return generic internal server error response
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

exports.getDomainController = async (req, res) => {
  try {
    // Fetch only the mainDomain field from each document
    const domains = await Domains.find({}, "mainDomain");
    res.status(200).json(domains);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve domains" });
  }
};
