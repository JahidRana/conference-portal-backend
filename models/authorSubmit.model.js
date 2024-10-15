const mongoose = require('mongoose');

var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const AuthorSubmit = mongoose.Schema({
  title: String,
  abstract: String,
  paperDomains: [{ type: String }], // Array to handle multiple domains
  keywords: String,
  cloudinaryURL: String, // New field for Cloudinary URL
  cloudinaryPublicID: String, // New field for Cloudinary Public ID
  paperID: {
    type: Number,
    unique: true, // Ensure that each paperID is unique
    default: null // Allow null for existing documents
  },  
  // Array of assigned reviewers, each having their own review info
  assignedReviewer: [
    {

      name: String,
      email: String,
      reviewInfo: {
        reviewDate: String,
        reviewMessage: String,  // Review message from this reviewer
        recommendation:String,
        reviewPicURL: String ,   // URL for any review-related images
        reviewPublicID: String
      }
    }
  ],
  
  author: [{
    firstName: String,
    lastName: String,
    email: {
      type: String,
      trim: true,
      required: [true, 'Email address is required'],
      lowercase: true,
      // unique: true,
      validate: [validateEmail, 'Please fill a valid email address'],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    affiliation: String,
    country: String,
    state: String,
    city: String,
    postCode: String,
    street: String,
    line1: String,
    line2: String,
  }],
  
  accepted: { type: Boolean, default: false },
  
  role: {
    type: String,
    default: null // Optional role field with default value null
  },
  
  status: {
    type: String,
    default: null // Optional status field with default value null
  }
}, {
  timestamps: true
});

const authorSubmit = mongoose.model('authorSubmit', AuthorSubmit);
module.exports = authorSubmit;
