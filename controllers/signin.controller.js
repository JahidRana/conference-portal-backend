const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema.model');

exports.CreateSigninController = async (req, res) => {
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
   // Generate displayName
   const displayName = `${user.firstName} ${user.lastName}`;

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role, email: user.email,displayName:displayName},
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Determine redirect URL based on role
        let dashboardURL = '/';
        if (user.role === 'admin') {
            dashboardURL = '/admin/dashboard';
        } else if (user.role === 'reviewer') {
            dashboardURL = '/reviewer';
        } else if (user.role === 'author') {
            dashboardURL = '/author';
        }

        // Send response with token and redirect URL
        return res.json({
            message: 'Login successful',
            token,
            role:user.role,
            redirectURL: dashboardURL,
            displayName
        });

    } catch (err) {
        console.error("Error occurred during sign-in:", err);
        return res.status(500).json({ message: 'Server error' });
    }
};
