const cloudinary = require('../config/cloudinaryConfig');
const SubmissionGuideline=require("../models/sumissionForm.model")
const authorSubmit=require("../models/authorSubmit.model")
const nodemailer = require('nodemailer');
const authorSubmitServices = require("../services/authorSubmit.services");
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
  });

  const getNextPaperID = async () => {
    const lastPaper = await authorSubmit.findOne({}, {}, { sort: { paperID: -1 } }); // Get the last inserted document
    return lastPaper ? lastPaper.paperID + 1 : 1; // Increment paperID, or set to 1 if no document exists
  };
  

  exports.CreateAuthorSubmitController = async (req, res, next) => {
    try {
      // Check if a file is uploaded
      if (!req.file) {
        return res.status(400).json({
          status: "Fail",
          message: "No file uploaded",
        });
      }
  
      // Get the next serial paper ID
      const paperID = await getNextPaperID();
  
      // Get the original file extension
      const fileExtension = req.file.originalname.split('.').pop();
  
      // Cloudinary upload (upload using paperID with the original file extension)
      const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "raw",
        folder: "submit-papers",
        public_id: `${paperID}.${fileExtension}`, // Use paperID as file name
        use_filename: true,
        unique_filename: false,
        overwrite: true
      });
  
      // Prepare submission information
      const submitInformation = {
        ...req.body,
        cloudinaryURL: cloudinaryResponse.secure_url,
        cloudinaryPublicID: cloudinaryResponse.public_id,
        paperID // Save the paperID in the database
      };
  
      // Save submission to the database
      const registeredInfo = await authorSubmitServices.createAuthorSubmitServices(submitInformation);
  
      // Send confirmation email
      const email = submitInformation.author?.[0]?.email;
      if (email) {
        const mailOptions = {
          from: `"Conference Portal" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Paper Submission Confirmation",
          text: `Hello ${submitInformation.author[0].firstName} ${submitInformation.author[0].lastName},
  
  Thank you for submitting your paper titled "${submitInformation.title}". We have successfully received your submission with Paper ID: ${paperID}. You can track the status of your submission by logging into your account.
  
  Best regards,
  Conference Portal Admin`
        };
  
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending confirmation email:', error);
          } else {
            console.log('Confirmation email sent:', info.response);
          }
        });
      }
  
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

    
    // Initialize the queries object
    const queries = {};
    
    const { page = 1, limit = 8, email } = req.query;
    
    // Calculate skip and convert limit to integer
    const skip = (page - 1) * parseInt(limit, 10);
    
    // Set properties in the queries object
    queries.skip = skip;
    queries.limit = parseInt(limit, 10);
    queries.email = email;
    
   
    
    try {
        const registeredInfo = await authorSubmitServices.GetReviewerAssignedPaperByEmailServices(queries);
        res.status(200).json({
            status: "success",
            message: "Submitted data fetched successfully",
            data: registeredInfo
        });
    } catch (err) {
        res.status(400).json({
            status: "Fail",
            message: "Can't fetch submitted data",
            error: err
        });
    }
};

exports.GetAuthorSubmitByIdController = async (req, res, next) => {
   
    const {id } = req.params;
  
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
//get specific paper controller


exports.GetSpecificPaperController = async (req, res, next) => {
    try {
        const { id } = req.params; // Get the paper ID from the request parameters

        const paper = await authorSubmit.findById(id);

        // Check if paper exists
        if (!paper) {
            return res.status(404).json({
                status: "Fail",
                message: "Paper not found",
            });
        }

        // Return the paper details
        res.status(200).json({
            status: "success",
            data: paper,
        });
    } catch (err) {
        res.status(400).json({
            status: "Fail",
            message: "Failed to fetch paper details",
            error: err,
        });
    }
};





// //acceptPaperController
// exports.acceptPaperController = async (req, res) => {
//     try {
//         const { paperId } = req.body;

//         // Find the paper by ID
//         const paper = await authorSubmit.findById(paperId);

//         if (!paper) {
//             return res.status(404).json({
//                 status: "fail",
//                 message: "Paper not found",
//             });
//         }

//         // Check if the paper is already accepted
//         if (paper.accepted) {
//             return res.status(400).json({
//                 status: "fail",
//                 message: "Paper has already been accepted",
//             });
//         }

//         // Create a new document in the AcceptedPaper collection with the paper's data
//         const acceptedPaper = new AcceptedPaper({
//             title: paper.title,
//             abstract: paper.abstract,
//             paperDomain: paper.paperDomain,
//             keywords: paper.keywords,
//             cloudinaryURL: paper.cloudinaryURL,
//             cloudinaryPublicID: paper.cloudinaryPublicID,
//             assignedReviewer: paper.assignedReviewer,
//             review: paper.review,
//             author: paper.author,
//             accepted: true ,// Mark as accepted
//         });

//         // Save the accepted paper
//         await acceptedPaper.save();

//         // Update the original paper to mark it as accepted
//         paper.accepted = true;
//         await paper.save();

//         res.status(200).json({
//             status: "success",
//             message: "Paper accepted and saved successfully",
//         });
//     } catch (err) {
//         res.status(500).json({
//             status: "error",
//             message: "Failed to accept paper",
//             error: err.message,
//         });
//     }
// };

//accepted paper List
exports.acceptPaperList=async (req, res) => {
    try {
        // Find all papers where accepted is true
        const papers = await authorSubmit.find({ accepted: true });

        res.status(200).json({
            status: "success",
            data: papers
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: "Failed to fetch accepted papers",
            error: err,
        });
    }
};

//accept paper
exports.acceptPaperController = async (req, res) => {
    const { paperId } = req.body;
    
    try {
        // Find the paper by ID and update its accepted status to false
        const paper = await authorSubmit.findByIdAndUpdate(
          paperId, 
          { 
              accepted: true, 
              status: 'Accepted' // Update status to 'Accepted'
          }, 
          { new: true } // Return the updated paper
      );


        if (!paper) {
            return res.status(404).json({
                success: false,
                message: 'Paper not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Paper accepted successfully',
            data: paper,
        });
    } catch (error) {
        console.error('Error unaccepting paper:', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.',
        });
    }
};


//unaccept paper

exports.unacceptPaperController=async (req, res) => {
    const { paperId } = req.body;

    try {
        // Find the paper by ID and update its accepted status to false
        const paper = await authorSubmit.findByIdAndUpdate(paperId, { accepted: false }, { new: true });

        if (!paper) {
            return res.status(404).json({
                success: false,
                message: 'Paper not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Paper unaccepted successfully',
            data: paper,
        });
    } catch (error) {
        console.error('Error unaccepting paper:', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.',
        });
    }
};

exports.deletePaperController = async (req, res) => {
    try {
        const { paperId } = req.body;
        const paper = await authorSubmit.findByIdAndDelete(paperId);

        if (!paper) {
            return res.status(404).json({
                success: false,
                message: 'Paper not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Paper deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.',
        });
    }
};


exports.GetpaperByEmailandRoleController = async (req, res) => {
    const { email, role } = req.query;
    try {
        // Fetch papers based on email and role
        const papers = await authorSubmit.find({
            'author.email': email,
            role: role
        });
      
        // Check if papers were found
        if (papers.length === 0) {
            return res.status(404).json({ message: 'No papers found' });
        }

        res.status(200).json({ data: papers });
    } catch (error) {
        console.error('Error fetching papers:', error);
        res.status(500).json({ message: 'Error fetching papers', error });
    }
};


exports.AssignReviewerController=async (req, res) => {
    const { paperId, reviewers } = req.body;
  
    if (!paperId || !reviewers || reviewers.length === 0) {
      return res.status(400).json({ message: 'Paper ID and reviewers are required' });
    }
  
    try {
      // Find the paper by ID and update the assignedReviewer and status fields
      const updatedPaper = await authorSubmit.findByIdAndUpdate(
        paperId,
        {
          $set: {
            assignedReviewer: reviewers,
            status: 'Under Review' // Update status to 'under review'
          }
        },
        { new: true } // Return the updated document
      );
  
      if (!updatedPaper) {
        return res.status(404).json({ message: 'Paper not found' });
      }
  
      res.status(200).json({ message: 'Reviewers assigned and status updated to "under review"', data: updatedPaper });
    } catch (error) {
      console.error('Error assigning reviewers and updating status:', error);
      res.status(500).json({ message: 'Error updating reviewers and status' });
    }
  };

//   exports.showAuthoReviewController= async (req, res) => {
//     try {
//       const { role, email } = req.query;
  
//       // Ensure both role and email are provided
//       if (!role || !email) {
//         return res.status(400).json({ error: 'Role and email are required' });
//       }
  
//       // Query to find matching documents based on role and author email
//       const document = await authorSubmit.findOne({
//         role: role,
//         'author.email': email
//       });
  
//       // If no document is found, return 404
//       if (!document) {
//         return res.status(404).json({ message: 'No matching records found' });
//       }
  
//       // Filter assigned reviewers to only include those with at least one non-empty review field
//       const reviewersWithValidReviewInfo = document.assignedReviewer.filter(reviewer => {
//         const reviewInfo = reviewer.reviewInfo || {};
//         return (
//           reviewInfo.reviewMessage || 
//           reviewInfo.recommendation || 
//           reviewInfo.reviewPicURL
//         );
//       });
  
//       if (reviewersWithValidReviewInfo.length > 0) {
//         // If valid reviewInfo is found, return the paper title along with reviewInfo of all reviewers who have reviewed
//         return res.status(200).json({
//           message: "Review(s) found",
//           title: document.title, // Include the paper title in the response
//           data: reviewersWithValidReviewInfo.map(reviewer => ({
//             name: reviewer.name, // Include the reviewer's name
//             reviewMessage: reviewer.reviewInfo?.reviewMessage || '-',
//             recommendation: reviewer.reviewInfo?.recommendation || '-',
//             reviewPicURL: reviewer.reviewInfo?.reviewPicURL || '-'
//           }))
//         });
//       } else {
//         // If no valid reviewInfo is present, return the paper title and a message saying no review has been done yet
//         return res.status(200).json({
//           message: "Reviewer has not reviewed the paper yet.",
//           title: document.title, // Include the paper title even if no reviews are present
//           data: []
//         });
//       }
  
//     } catch (error) {
//       // Handle errors (e.g., database connection errors)
//       return res.status(500).json({ error: error.message });
//     }};


exports.showAuthoReviewController = async (req, res) => {
  try {
      const { role, email } = req.query;

      // Log the received query parameters
  

      // Ensure both role and email are provided
      if (!role || !email) {
          return res.status(400).json({ error: 'Role and email are required' });
      }

      // Query to find all matching documents based on role and author email
      const documents = await authorSubmit.find({
          role: role,
          'author.email': email
      });

      // Log the retrieved documents
 

      // If no document is found, return 404
      if (documents.length === 0) {
          return res.status(404).json({ message: 'No matching records found' });
      }

      // Process the documents to extract valid review information
      const result = documents.map(document => {
          // Check if assignedReviewer exists and is an array, then filter reviewers with valid review info
          if (Array.isArray(document.assignedReviewer)) {
              const reviewersWithValidReviewInfo = document.assignedReviewer.filter(reviewer => {
                  const reviewInfo = reviewer.reviewInfo || {};
                  return (
                      reviewInfo.reviewMessage ||
                      reviewInfo.recommendation ||
                      reviewInfo.reviewPicURL
                  );
              });

              // Only return papers with valid reviewers having review info
              if (reviewersWithValidReviewInfo.length > 0) {
                  return {
                      title: document.title,
                      status: document.status,
                      reviewers: reviewersWithValidReviewInfo.map(reviewer => ({
                          name: reviewer.name, // Include the reviewer's name
                          reviewMessage: reviewer.reviewInfo?.reviewMessage || '-',
                          recommendation: reviewer.reviewInfo?.recommendation || '-',
                          reviewPicURL: reviewer.reviewInfo?.reviewPicURL || '-'
                      }))
                  };
              }
          }

          // Return nothing if no valid reviewers are found
          return null;
      }).filter(doc => doc !== null); // Filter out null results

      // Log the processed result
  

      // Check if there are any valid reviewers in the result
      const hasReviews = result.some(doc => doc.reviewers.length > 0);

      if (hasReviews) {
        
          return res.status(200).json({
              message: "Review(s) found",
              data: result
          });
      } else {
        
          // If no valid review info is present in any document
          return res.status(200).json({
              message: "No reviews found for the matching documents.",
              data: result
          });
      }

  } catch (error) {
      // Handle errors (e.g., database connection errors)
      // console.error("Error occurred:", error);
      return res.status(500).json({ error: error.message });
  }
};
