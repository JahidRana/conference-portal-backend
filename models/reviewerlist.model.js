const mongoose = require('mongoose');


const ReviewerList = mongoose.Schema({
    name: String,
    email : String

},{
    timestamps: true
})
const ReviewersList = mongoose.model('SelectedReviewersList', ReviewerList);

module.exports = ReviewersList;