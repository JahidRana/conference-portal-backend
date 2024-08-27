const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema.model'); // Assuming User model is in this path

exports.CreateSigninController = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email, role });


        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check if the role matches
        if (user.role !== role) {
            return res.status(400).json({ message: 'Incorrect role selected' });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check if the user is verified
        if (!user.isVerified) {
            return res.status(403).json({ message: 'Account is not verified. Please verify your email.' });
        }

        // Check if the user is approved
        if (!user.isApproved) {
            return res.status(403).json({ message: 'Account is not approved yet. Please wait for admin approval.' });
        }

        // Generate displayName
        const displayName = `${user.firstName} ${user.lastName}`;

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role, email: user.email, displayName },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Determine redirect URL based on role
        let dashboardURL = '/';
        if (user.role === 'reviewer') {
            dashboardURL = '/reviewer';
        } else if (user.role === 'author') {
            dashboardURL = '/author';
        }

        // Send response with token and redirect URL
        return res.json({
            message: 'Login successful',
            token,
            role: user.role,
            redirectURL: dashboardURL,
            displayName
        });

    } catch (err) {
        console.error("Error occurred during sign-in:", err);
        return res.status(500).json({ message: 'Server error' });
    }
};


exports.CreateAdminSigninController=async (req, res) => {
    const { email, password } = req.body;
 
   
    try {
        // Check if the user exists
        const user = await User.findOne({ email });
      

        if (!user) {
            console.log("No user found with this email.");
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
      

        if (!isMatch) {
            console.log("Passwords do not match.");
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check if the user is approved
        if (!user.isApproved) {
            return res.status(403).json({ message: 'User is not approved yet' });
        }
  

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role},
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Determine redirect URL based on role
        let dashboardURL = '/';
        if (user.role === 'admin') {
            dashboardURL = '/admin/dashboard';
        } 

        // Send response with token and redirect URL
        return res.json({
            message: 'Login successful',
            token,
            role:user.role,
            redirectURL: dashboardURL,
        });

    } catch (err) {
        console.error("Error occurred during sign-in:", err);
        return res.status(500).json({ message: 'Server error' });
    }
};


exports.getDashboardURL = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // Assuming token is sent in the Authorization header
        if (!token) {
            return res.status(401).json({ message: 'Authorization token is missing' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user based on the decoded token's userId
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Determine the dashboard URL based on the role
        let dashboardURL = '/';
        if (user.role === 'admin') {
            dashboardURL = '/admin/dashboard';
        } else if (user.role === 'reviewer') {
            dashboardURL = '/reviewer';
        } else if (user.role === 'author') {
            dashboardURL = '/author';
        }

        // Send the dashboard URL in the response
        return res.json({ dashboardURL });
    } catch (err) {
        console.error("Error fetching dashboard URL:", err);
        return res.status(500).json({ message: 'Server error' });
    }
};