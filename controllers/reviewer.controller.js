const reviewerServices = require("../services/reviewer.services");
const User = require("../models/userSchema.model");

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
      reviwerrequestStatus:user.reviwerrequestStatus,
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
    console.log(existingReviewer);
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

exports.createReviewerWithDifferentRoleController = async (req, res) => {
  const { email, previousRole, newRole, message } = req.body;

  try {
    // Find the existing user with the specified email and previous role
    const existingUser = await User.findOne({ email, role: previousRole });
    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "User not found with the specified email and role" });
    }

    // Create a new reviewer with the updated role, same password, and isApproved set to false
    const newReviewer = new User({
      ...existingUser.toObject(),
      role: newRole,
      message: message,
      isApproved: false, // Set isApproved to false
      _id: undefined, // Remove _id to create a new document
      password: existingUser.password, // Use the already hashed password
      reviwerrequestStatus:"pending"
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

exports.CreateSelectedReviewerController = async (req, res, next) => {
  try {
    console.log("callllled");
    const info = req.body;
    console.log("accepted body from ReviewerController", info);
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

    console.log("UploadingReviewController", id, info);
    // if(!info[0].value){
    //     return res.send({code: 400, massage: "Bad Request"})
    // }

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
    console.log("email from GetReviewerController", email);
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
    console.log("deleteReviewerByIdController id ", email);
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
    console.log("deleteReviewerByIdController id ", email);
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
