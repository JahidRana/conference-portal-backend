const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true }, // Keeps track of the user role (e.g., reviewer, author)
    isVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false }, // Indicates whether the reviewer has been approved
    message:{ type: String, default: null },//message
    reviwerrequestStatus: { type: String, default: null }, // Status of reviewer request
    domain1: { type: String, default: null }, // Selected domain 1 for reviewers
    domain2: { type: String, default: null }, // Selected domain 2 for reviewers (optional)
    domain3: { type: String, default: null }, // Selected domain 3 for reviewers (optional)
    cvUrl: { type: String, default: null }, // Stores the URL/path of the uploaded CV
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    // If the password has already been hashed, skip hashing again
    if (!this.isModified('password') || this.password.startsWith('$2b$')) {
        return next();
    }
    
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
