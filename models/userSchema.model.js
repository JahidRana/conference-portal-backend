const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true }, // Add this line for role
    isVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false }, // New field
    message: { type: String, default: null }, // Optional field
    reviwerrequestStatus:{ type: String, default: null }, // New field
});

// Hash password before saving
// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) return next();
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
// });

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
