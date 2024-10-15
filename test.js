
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
        cloudinaryURL: cloudinaryResponse.secure_url, // URL of the uploaded file
        cloudinaryPublicID: cloudinaryResponse.public_id // Public ID for future reference
      };
  
    
        // Extract email from submitInformation
    const email = submitInformation.author?.[0]?.email;


    // Check for existing record with the same email
    // const existingRecord = await authorSubmit.findOne({ "author.email": email });


    // if (existingRecord) {
    //   return res.status(400).json({
    //     status: "Fail",
    //     message: "Duplicate entry found",
    //   });
    // }

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
