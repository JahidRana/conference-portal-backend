const mongoose = require('mongoose');

const AcceptedPaperSchema = new mongoose.Schema({
    title: String,
    abstract: String,
    paperDomain: String,
    keywords: String,
    cloudinaryURL: String,
    cloudinaryPublicID: String,
    assignedReviewer: [
        {
            value: String,
            label: String,
        },
    ],
    review: {
        reviewDate: String,
        Reviewer: {
            displayName: String,
            email: String,
            photoURL: String,
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
                referenceReview: String,
            },
        ],
    },
    author: [
        {
            firstName: String,
            lastName: String,
            email: String,
            affiliation: String,
            country: String,
            state: String,
            city: String,
            postCode: String,
            street: String,
            line1: String,
            line2: String,
        },
    ],
    accepted: { type: Boolean, default: false }, // Add this field
}, { timestamps: true });

const AcceptedPaper = mongoose.model('AcceptedPaper', AcceptedPaperSchema);
module.exports = AcceptedPaper;
