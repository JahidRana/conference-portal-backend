const mongoose = require('mongoose');


const AddReviewer = mongoose.Schema({
    name : String,
    email : String,
    description : String

},{
    timestamps: true
})
const Reviewer = mongoose.model('RequestedReviewerList', AddReviewer);

module.exports = Reviewer;