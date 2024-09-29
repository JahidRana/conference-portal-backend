//admin.controller.js
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const adminServices = require("../services/admin.services");
// const cloudinary = require("../config/cloudinaryConfig");
const cloudinary = require('../config/cloudinaryConfig');
const CreatedCommittee = require("../models/createCommittee.model");
const Speaker = require("../models/UniversityStaffSchema .model");
const ConferenceDates = require("../models/ConferenceDate.model");
const SubmissionGuideline=require("../models/sumissionForm.model")
const RegistrationFees=require("../models/registrationFees.model.js");
const RegistrationProcess= require("../models/registrationProcess.model.js");
const User =require("../models/userSchema.model");
const Domain =require("../models/domainSchema .model")
const AuthorSubmit=require("../models/authorSubmit.model.js");


exports.CreateAdminController = async (req, res, next) => {
  try {
    const email = req.body.email;
  
    if (!email) {
      return res.send({ code: 400, massage: "Bad Request" });
    }
    const registeredInfo = await adminServices.createAdminService({
      email: email,
    });
    res.status(200).json({
      status: "success",
      message: "Admin is added successfully",
      data: registeredInfo,
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: "Admin Couldn't added Successfully",
      error: err,
    });
  }
};
//old -create-speaker
// exports.createSpeakerController = async (req, res) => {
//   try {
//     // Check if the request includes a file (picture)
//     if (!req.file) {

//       return res.status(400).send({ message: "No picture uploaded" });
//     }

//     // Upload the picture to Cloudinary (folder already specified in CloudinaryStorage)
//     const result = await cloudinary.uploader.upload(req.file.path);

//     if (!result || !result.secure_url) {
//         console.error("Failed to get Cloudinary URL");
//         return res.status(500).json({ message: "Failed to upload picture to Cloudinary" });
//       }

//     // Construct the Cloudinary URL for the uploaded image
//     const pictureUrl = result.secure_url;

//     const imageId = result.public_id;

//     // Create a new speaker instance and set its properties
//     const speaker = new Speaker({
//       title: req.body.title,
//       name: req.body.name,
//       position: req.body.position,
//       university: req.body.university,
//       abstract: req.body.abstract,
//       website: req.body.website,
//       picture: pictureUrl, // Add the Cloudinary URL to the speaker document
//       imageId: imageId,
//     });

//     // Save the speaker to the database
//     await speaker.save();

//     // Send a success response
//     res.status(201).json(speaker);
//   } catch (error) {
//     console.error("Error uploading picture to Cloudinary admin.controller:", error);
//     res.status(500).json({ message: "Error uploading picture admin.controller" });
//   }
// };

// //new -create-speaker


exports.createSpeakerController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "No picture uploaded" });
    }

    cloudinary.uploader.upload_stream(
      {
        folder: 'speakers',
        use_filename: true,
        unique_filename: true,
      },
      async (error, result) => {
      
        if (error) {
          console.error("Upload error:", error); // Log the error
          return res.status(500).json({ message: "Failed to upload picture to Cloudinary", error: error.message });
        }

        const speaker = new Speaker({
          title: req.body.title,
          name: req.body.name,
          position: req.body.position,
          university: req.body.university,
          abstract: req.body.abstract,
          website: req.body.website,
          picture: result.secure_url,
          imageId: result.public_id,
        });

        await speaker.save();

        res.status(201).json(speaker);
      }
    ).end(req.file.buffer); // Ensure buffer is correct
  } catch (error) {
    console.error("Error uploading picture to Cloudinary:", error);
    res.status(500).json({ message: "Error uploading picture to Cloudinary", error: error.message });
  }
};






//remove speaker controller
exports.removeSpeakerController = async (req, res) => {
  try {
    const speakerId = req.params.id;
    // Logic to delete the speaker from the database
    await Speaker.findByIdAndDelete(speakerId);
    res.status(200).json({ message: "Speaker deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting speaker" });
  }
};

//get spearkers

exports.getSpeaker = async (req, res) => {
  try {
    const speakers = await Speaker.find();
    res.status(200).json(speakers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch speakers" });
  }
};

exports.GetAdminController = async (req, res, next) => {
  try {
    const email = req.body.email;
    const adminList = await adminServices.getAdminServices({ email: email });
    res.status(200).json({
      status: "success",
      message: "Admin List get successfully",
      data: adminList,
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: "Can't get Admin List",
      error: err,
    });
  }
};
exports.GetAdminListController = async (req, res, next) => {
  try {
    const adminList = await adminServices.getAdminListServices();
    res.status(200).json({
      status: "success",
      message: "Admin List get successfully",
      data: adminList,
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: "Can't get Admin List",
      error: err,
    });
  }
};
exports.removeAdminByEmailController = async (req, res, next) => {
  try {
    const { email } = req.params;
  
    const reviewerList = await adminServices.removeAdminByEmailService(email);
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

//remove committe-(delete already)
// exports.removeCommitteByIdController = async (req, res, next) => {

//     try {
//         const {id} = req.params

//         const committeList = await adminServices.removeCommitteByIdService(id);
//         res.status(200).json({
//             status: "success",
//             message: "Committe Deleted successesFully",
//             data: committeList
//         })
//     } catch (err) {
//         res.status(400).json({
//             status: "Fail",
//             message: "Can't get Committe List",
//             error: err,

//         })
//     }
// };

//remove commite update version

exports.removeCommitteeByIdController = async (req, res, next) => {
  const { committeeId, memberId } = req.params;

  try {
    // Find the committee by ID
    const committee = await CreatedCommittee.findById(committeeId);

    if (!committee) {
      return res.status(404).json({ message: "Committee not found" });
    }

    // Filter out the member to be removed from the mainCommittee.members array
    committee.mainCommittee.members = committee.mainCommittee.members.filter(
      (member) => member._id.toString() !== memberId
    );

    // Save the updated committee to the database
    await committee.save();

    res.json({ message: "Member removed successfully", committee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.removeFullcommittee = async (req, res, next) => {
  try {
    const committeeId = req.params.id;
   

    // Assuming you have a Committee model to handle database operations
    const result = await CreatedCommittee.findByIdAndDelete(committeeId);

    if (!result) {
      return res.status(404).json({
        status: "fail",
        message: "Committee not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Committee removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while removing the committee",
      error: error.message,
    });
  }
};

//update UpdateCommitteController

exports.UpdateCommitteController = async (req, res) => {
  const { committeeId } = req.params;

  const newMember = {
    affiliation: req.body.affiliation,
    designation: req.body.designation,
    name: req.body.name,
    email: req.body.email,
    convenor: req.body.convenor, // Include this if you want to specify the convenor status
  };
 
  try {
    const updatedCommittee = await CreatedCommittee.findByIdAndUpdate(
      committeeId,
      { $push: { "mainCommittee.members": newMember } },
      { new: true }
    );

    if (!updatedCommittee) {
      return res.status(404).send("Committee not found");
    }

    res.send(updatedCommittee);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//get GetCommitte

exports.GetCommitte = async (req, res) => {
  try {
    // Fetch all committees from the database
    const committees = await CreatedCommittee.find();

    res.json(committees); // Send the committee data as JSON response
  } catch (error) {
    console.error("Error fetching committees:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.HomePageContentController = async (req, res, next) => {
  try {
    const content = req.body.homePageMassage;
   
    if (!content) {
      return res.send({ code: 400, massage: "Bad Request" });
    }
    const registeredInfo = await adminServices.HomePageContentService({
      content: content,
    });
    res.status(200).json({
      status: "success",
      message: "Conference Massage is added successfully",
      data: registeredInfo,
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: "Conference Massage Couldn't added Successfully",
      error: err,
    });
  }
};

//old update date controller
// exports.UpdateDateController = async (req, res, next) => {
//     try {
//         const dateInfo =req.body;


//         if(!dateInfo){
//             return res.send({code: 400, massage: "Bad Request"})
//         }
//         const ConferenceInfo = await adminServices.updateDateService(dateInfo);
//         res.status(200).json({
//             status: "success",
//             message: "Conference Date is added successfully",
//             data: ConferenceInfo
//         })
//     } catch (err) {
//         res.status(400).json({
//             status: "Fail",
//             message: "Conference Date Couldn't added Successfully",
//             error: err,

//         })
//     }
// };

//new update date controller
exports.updateConferenceDates = async (req, res) => {
  const {
    PaperSubmissionDeadline,
    AcceptanceNotification,
    CameraReadySubmission,
    RegistrationDeadline,
    ConferenceStartDate,
    ConferenceEndDate,
  } = req.body;

  try {
    let dates = await ConferenceDates.findOne(); // Find the single document

    if (!dates) {
      return res.status(404).json({ message: "Conference dates not found" });
    }

    if (PaperSubmissionDeadline)
      dates.PaperSubmissionDeadline = PaperSubmissionDeadline;
    if (AcceptanceNotification)
      dates.AcceptanceNotification = AcceptanceNotification;
    if (CameraReadySubmission)
      dates.CameraReadySubmission = CameraReadySubmission;
    if (RegistrationDeadline) dates.RegistrationDeadline = RegistrationDeadline;
    if (ConferenceStartDate) dates.ConferenceStartDate = ConferenceStartDate;
    if (ConferenceEndDate) dates.ConferenceEndDate = ConferenceEndDate;

    await dates.save();

    res
      .status(200)
      .json({ message: "Conference dates updated successfully", dates });
  } catch (error) {
    res.status(500).json({ message: "Error updating conference dates", error });
  }
};

//get update data
exports.getupdateConferenceDates = async (req, res) => {
  try {
    // Fetch all committees from the database
    const getDates = await ConferenceDates.find();

    res.json(getDates); // Send the committee data as JSON response
  } catch (error) {
    console.error("Error fetching committees:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



exports.updateSubmissioninfo = async (req, res) => {
  const { guideline, submissionProcess } = req.body;

  try {
      const result = await SubmissionGuideline.updateOne(
          {}, // Empty filter object to update the first found document or create a new one
          { guideline, submissionProcess }, // Replace with new data
          { upsert: true, runValidators: true } // Upsert: create if not exist
      );

      if (result.upsertedCount > 0) {
          return res.status(201).send({ message: 'Submission Guideline created successfully' });
      }

      res.status(200).send({ message: 'Submission Guideline updated successfully' });
  } catch (error) {
      console.error('Error details:', error); // Log the full error
      res.status(500).send({ message: 'Server Error', error: error.message });
  }
};

exports.getupdateSubmissioninfo=async (req, res) => {
  try {
      const submissionGuideline = await SubmissionGuideline.find(); // or .find() if you expect multiple documents
     
      if (!submissionGuideline) {
          return res.status(404).send({ message: 'No submission guideline found' });
      }
      res.status(200).send(submissionGuideline);
  } catch (error) {
      res.status(500).send({ message: 'Server Error', error: error.message });
  }
};

exports.SaveRegistrationFees = async (req, res) => {
  try {
      const registrations = req.body;

      // Update or insert the incoming data
      const result = await Promise.all(registrations.map(async (reg) => {
          return RegistrationFees.updateOne(
              { category: reg.category }, // Use a unique identifier if needed
              { $set: reg },
              { upsert: true }
          );
      }));

      // Get the categories that were sent in the request
      const incomingCategories = registrations.map(reg => reg.category);

      // Remove any categories from the database that are not in the incoming data
      await RegistrationFees.deleteMany({
          category: { $nin: incomingCategories }
      });

      res.status(200).json({ message: 'Data saved and outdated entries removed successfully', result });
  } catch (error) {
      res.status(500).json({ message: 'Error saving data', error });
  }
};

exports.GetRegistrationFees=async (req, res) => {
  try {
      const fees = await RegistrationFees.find(); // Fetch all records from the RegistrationFees model
      res.status(200).json(fees); // Send the fetched data as JSON
  } catch (error) {
      console.error('Error fetching registration fees:', error);
      res.status(500).json({ error: 'Internal Server Error' }); // Handle errors
  }
};

//RegistrationProcess
exports.saveRegistrationProcess = async (req, res) => {
  try {
      const processes = req.body;

      // Update or insert the incoming data
      const result = await Promise.all(processes.map(async (process) => {
          return RegistrationProcess.updateOne(
              { step_no: process.step_no }, // Use step_no as the unique identifier
              { $set: process },
              { upsert: true }
          );
      }));

      // Get the step numbers that were sent in the request
      const incomingSteps = processes.map(process => process.step_no);

      // Remove any steps from the database that are not in the incoming data
      await RegistrationProcess.deleteMany({
          step_no: { $nin: incomingSteps }
      });

      res.status(200).json({ message: 'Data saved and outdated entries removed successfully', result });
  } catch (error) {
      res.status(500).json({ message: 'Error saving data', error });
  }
};

exports.GetRegistrationProcess=async (req, res) => {
  try {
      const process = await RegistrationProcess.find(); // Fetch all records from the RegistrationFees model
      res.status(200).json(process); // Send the fetched data as JSON
  } catch (error) {
      console.error('Error fetching registration fees:', error);
      res.status(500).json({ error: 'Internal Server Error' }); // Handle errors
  }
};



// fetch unapprovedReviewers
exports.getUnapprovedReviewers = async (req, res) => {
  try {
    const unapprovedReviewers = await User.find({
      role: 'reviewer',
      isVerified: true,
      isApproved: false,
      reviwerrequestStatus: null, // Corrected field name
    });

    res.status(200).json(unapprovedReviewers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

//save approvedReviewers
exports.approveReviewer = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isApproved = true;
    await user.save();

    res.status(200).json({ message: 'Approved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};




// Fetch approved reviewers
exports.getApprovedReviewers = async (req, res) => {
  try {
      const reviewers = await User.find({
      isVerified: true,
      isApproved: true,
      role: { $ne: 'admin' } // Exclude users with the role of 'admin'
    });
    res.status(200).json(reviewers);
  } catch (error) {
    console.error('Error fetching approved reviewers:', error);
    res.status(500).json({ message: 'Failed to fetch approved reviewers.' });
  }
};

// Delete a reviewer
exports.deleteReviewer = async (req, res) => {
  const { id } = req.params;
  try {
    const reviewer = await User.findByIdAndDelete(id);
    if (!reviewer) {
      return res.status(404).json({ message: 'Reviewer not found.' });
    }
    res.status(200).json({ message: 'Reviewer deleted successfully.' });
  } catch (error) {
    console.error('Error deleting reviewer:', error);
    res.status(500).json({ message: 'Failed to delete reviewer.' });
  }
};

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
  },
});

exports.addUserManually = async (req, res) => {
  const { firstName, lastName, email, role } = req.body;

  try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
      }

      // Generate a temporary password
      const plainPassword = Math.random().toString(36).slice(-8);

      // Create a new user with the plain password (will be hashed by the schema)
      const newUser = new User({
          firstName,
          lastName,
          email,
          password: plainPassword, // Store the plain password
          role,
          isVerified: true, // Set verified status to true
          isApproved: true, // Set approved status to true
      });

      // Save the new user to the database
      await newUser.save();

      // Prepare the email options
      const mailOptions = {
          from: 'Conference Portal',
          to: email,
          subject: 'Welcome to Conference Portal',
          text: `Dear ${firstName} ${lastName},\n\nYour account has been successfully created with the role of ${role}.\n\nYour password is: ${plainPassword}\n\n.\n\nBest regards,\nConference Portal`,
      };

      // Send the email
      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: 'User added and email sent successfully' });
  } catch (error) {
      console.error('Error adding user:', error);
      res.status(500).json({ message: 'Server error', error: error.message || error });
  }
};

exports.getRequestedReviewers = async (req, res) => {
  try {
      const requestedReviewers = await User.find({
          isApproved: false,
          reviwerrequestStatus: "pending"
      });

      res.json(requestedReviewers);
  } catch (err) {
      console.error("Error fetching requested reviewers:", err);
      res.status(500).json({ message: 'Server error' });
  }
};

// Accept a reviewer request
exports.acceptReviewerRequest = async (req, res) => {
  const { userId } = req.body;

  try {
      const reviewerRequest = await User.findOne({ _id: userId });

      if (!reviewerRequest) {
          return res.status(404).json({ message: 'Reviewer request not found' });
      }
      reviewerRequest.reviwerrequestStatus="accepted";
      reviewerRequest.isApproved = true;
      
      await reviewerRequest.save();

      // const user = await User.findById(userId);
      // user.role = 'reviewer';
      // await user.save();

      res.status(200).json({ message: 'Reviewer request accepted' });
  } catch (err) {
      console.error("Error accepting reviewer request:", err);
      res.status(500).json({ message: 'Server error' });
  }
};
exports.rejectReviewerRequest = async (req, res) => {
  const { userId } = req.body;

  try {
      const reviewerRequest = await User.findOne({ _id: userId});

      if (!reviewerRequest) {
          return res.status(404).json({ message: 'Reviewer request not found' });
      }
      reviewerRequest.reviwerrequestStatus="rejected";

      await reviewerRequest.save(); // Or you could just set the status to 'Rejected'

      res.status(200).json({ message: 'Reviewer request rejected' });
  } catch (err) {
      console.error("Error rejecting reviewer request:", err);
      res.status(500).json({ message: 'Server error' });
  }
};

exports.getReviewers=async (req, res) => {
  try {
      // Find all users with role "reviewer", isVerified true, and isApproved true
      const reviewers = await User.find({ role: 'reviewer', isVerified: true, isApproved: true }, 'firstName lastName email');
      if (reviewers.length === 0) {
          return res.status(404).json({ message: 'No reviewers found' });
      }

      res.status(200).json({ data: reviewers });
  } catch (error) {
      console.error('Error fetching reviewers:', error);
      res.status(500).json({ message: 'Error fetching reviewers', error });
  }
};

exports.customizeDomainController=async (req, res) => {
  try {
      // Extract domains from request body
      const { domains } = req.body;

      if (!Array.isArray(domains) || domains.length === 0) {
          return res.status(400).json({ message: 'Invalid domains data' });
      }

      // Save each domain
      const savedDomains = [];
      for (const domain of domains) {
          if (domain.mainDomain && Array.isArray(domain.subDomains) && domain.subDomains.length > 0) {
              const newDomain = new Domain({
                  mainDomain: domain.mainDomain,
                  subDomains: domain.subDomains,
              });

              const savedDomain = await newDomain.save();
              savedDomains.push(savedDomain);
          }
      }

      return res.status(201).json({ message: 'Domains saved successfully', data: savedDomains });
  } catch (error) {
      console.error('Error saving domains:', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getcustomizeDomainController=async (req, res) => {
  try {
      const domains = await Domain.find(); // Fetch all domains
      res.status(200).json(domains);
  } catch (error) {
      console.error('Error fetching domains:', error);
      res.status(500).json({ message: 'Error fetching domains' });
  }
};

exports.rejectPaperController = async (req, res) => {
  const { paperId } = req.body;

  if (!paperId) {
      return res.status(400).json({ message: 'Paper ID is required' });
  }

  try {
      const paper = await AuthorSubmit.findById(paperId);
      if (!paper) {
          return res.status(404).json({ message: 'Paper not found' });
      }

      // Update the status to 'Rejected'
      paper.status = 'Rejected';
      await paper.save();

      res.status(200).json({ message: 'Paper status updated to "Rejected"', data: paper });
  } catch (error) {
      console.error('Error rejecting paper:', error);
      res.status(500).json({ message: 'Failed to reject the paper. Please try again.' });
  }
};

exports.getReviewsinfoController=async (req, res) => {
  try {
    const { paperId } = req.params;

    // Find the paper by its _id
    const paper = await AuthorSubmit.findById(paperId);

    if (!paper) {
      return res.status(404).json({ message: 'Paper not found' });
    }

    // Return the list of assigned reviewers with their details
    const reviewers = paper.assignedReviewer.map(reviewer => ({
      name: reviewer.name,
      email: reviewer.email,
      reviewInfo: {
        reviewMessage: reviewer.reviewInfo.reviewMessage,
        recommendation: reviewer.reviewInfo.recommendation,
        reviewPicURL: reviewer.reviewInfo.reviewPicURL
      }
    }));

    // Respond with the reviewers' details
    res.json(reviewers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};