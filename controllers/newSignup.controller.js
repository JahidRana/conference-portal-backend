const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/userSchema.model');

// Replace with your email service credentials
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

exports.CreateSignUpController = async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create the OTP and the token
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const token = jwt.sign({ email, otp }, process.env.JWT_SECRET, { expiresIn: '10m' });

        // Prepare the email options
        const mailOptions = {
            from: 'Conference Portal',
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}`,
        };

        // Send the email before saving the user
        await transporter.sendMail(mailOptions);

     // If the email is sent successfully, save the user to the database
     const isApproved = role === 'author'; // Set isApproved=true if role is 'author'
     const user = new User({ firstName, lastName, email, password, role, isApproved });
     await user.save();

        res.status(200).json({ message: 'OTP sent to email', token });
    } catch (error) {
        console.error('Error occurred in CreateSignUpController:', error); // Log the error
        res.status(500).json({ message: 'Server error', error: error.message || error });
    }
};

exports.VerifyOtpController = async (req, res) => {
    const { otp, token } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        user.isVerified = true;
        await user.save();

          res.status(200).json({ message: 'User verified successfully', user });
    } catch (error) {
        console.error('Error occurred in VerifyOtpController:', error); // Log the error
        res.status(400).json({ message: 'Invalid or expired token', error: error.message || error });
    }
};

