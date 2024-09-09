const mongoose = require('mongoose');

var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const AuthorSubmit = mongoose.Schema({
  title: String,
  abstract: String,
  paperDomains: [{ type: String }], // Change to array to handle multiple domains
  keywords: String,
  cloudinaryURL: String, // New field for Cloudinary URL
  cloudinaryPublicID: String, // New field for Cloudinary Public ID
  assignedReviewer: [
    {
      name: String,
      email: String
    }
  ],
  review: {
    reviewDate: String,
    Reviewer: {
      displayName: String,
      email: String,
      photoURL: String
    },
    reviewInfo: [
      {
        overallEvaluation: String,
        detailsEvaluation: String,
        abstractEvaluation: String,
        introductionEvaluation: String,
        literatureEvaluation: String,
        resultEvaluation: String,
        commentToTCP: String,
        referenceReview: String
      }
    ]
  },
  author: [{
    firstName: String,
    lastName: String,
    email: {
      type: String,
      trim: true,
      required: [true, 'Email address is required'],
      lowercase: true,
      unique: true,
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
    default: null // Make role optional with a default value of null
},
status: {
    type: String,
    default: null // status is now optional and defaults to null
}
}, {
  timestamps: true
});

const authorSubmit = mongoose.model('authorSubmit', AuthorSubmit);
module.exports = authorSubmit;
