const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/userSchema.model");
const cloudinary = require("cloudinary").v2; // Import Cloudinary
const path = require("path");

// Setup email transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

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

exports.CreateSignUpController = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    role,
    domain1,
    domain2,
    domain3,
  } = req.body;

  try {
    // Check if a user with the same email and role already exists
    const existingUser = await User.findOne({ email, role });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already used with this role" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const token = jwt.sign({ email, otp, role }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    const mailOptions = {
      from: "Conference Portal",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}`,
    };

    // Send OTP email
    await transporter.sendMail(mailOptions);

    // Upload CV to Cloudinary if provided
    let cvUrl = null;
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

    const isApproved = role === "author"; // Automatically approve 'author' role

    // Create the new user with optional domains and CV URL
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role,
      isApproved,
      reviwerrequestStatus: "pending",
      domain1: domain1 || null,
      domain2: domain2 || null,
      domain3: domain3 || null,
      cvUrl, // Store the Cloudinary URL in the database
    });

    await user.save();

    res.status(200).json({ message: "OTP sent to email", token });
  } catch (error) {
    console.error("Error occurred in CreateSignUpController:", error);
    res
      .status(500)
      .json({ message: "Server error", error: error.message || error });
  }
};

exports.VerifyOtpController = async (req, res) => {
  const { otp, token } = req.body;

  try {
    // Verify the token and decode it
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    // Check if the provided OTP matches the one in the token
    if (decoded.otp !== otp) {
      console.log(
        "OTP mismatch: Expected OTP:",
        decoded.otp,
        "Received OTP:",
        otp
      );
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Log before updating the user's isVerified field
    console.log(
      `Finding user with email: ${decoded.email} and role: ${decoded.role} and updating isVerified to true`
    );

    // Find the user by both email and role and update the isVerified field
    const updatedUser = await User.findOneAndUpdate(
      { email: decoded.email, role: decoded.role }, // Find the user by both email and role
      { $set: { isVerified: true } }, // Set isVerified to true
      { new: true } // Return the updated user document
    );

    // Check if the user was found and updated
    if (!updatedUser) {
      console.log("User not found or already verified.");
      return res
        .status(400)
        .json({ message: "User not found or already verified" });
    }

    res.status(200).json({
      message: "User verified successfully",
      user: updatedUser, // Return the updated user object
    });
  } catch (error) {
    console.error("Error occurred in VerifyOtpController:", error);
    res.status(400).json({
      message: "Invalid or expired token",
      error: error.message || error,
    });
  }
};
