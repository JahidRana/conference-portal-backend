const mongoose = require('mongoose');

const SubmissionGuidelineSchema = mongoose.Schema({
    guideline: {
        type: String,
        required: [true, "Please provide the submission guideline"],
    },
    researchAreas: {
        type: [String],  // Array of strings to store multiple research areas
        required: [true, "Please provide at least one research area"],
    },
}, {
    timestamps: true  // Automatically adds createdAt and updatedAt fields
});

const SubmissionGuideline = mongoose.model('SubmissionGuideline', SubmissionGuidelineSchema);

module.exports = SubmissionGuideline;
