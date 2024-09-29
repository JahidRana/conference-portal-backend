const ReviewersList = require("../models/reviewerlist.model")
const RequestedReviewers = require("../models/requestedReviewers.model")
const AuthorSubmit = require("../models/authorSubmit.model")

exports.createReviewerService = async (info) => {
    
    const submitInfo = await RequestedReviewers.create(info);
  
    return submitInfo;
};
exports.createSelectedReviewerService = async (info) => {
    
    const submitInfo = await ReviewersList.create(info);
    return submitInfo;
};
exports.deleteSelectedReviewerService = async (email) => {
    const submitInfo = await ReviewersList.deleteOne({"email" : email});
  
    return submitInfo;
};
exports.getRequestedReviewersListServices = async () => {

    const submitInfo = await RequestedReviewers.find({});
   
    return submitInfo;
};
exports.getAllReviewersListServices = async () => {

    const submitInfo = await ReviewersList.find({});
   
    return submitInfo;
};
exports.getReviewerServices = async ({ 'email': email }) => {
    const submitInfo = await ReviewersList.find({ 'email': email });
  
    return submitInfo;
};
exports.deleteReviewerByIdService = async (email) => {
   
    const submitInfo = await RequestedReviewers.deleteOne({"email" : email});
   
    return submitInfo;
};
exports.assigningPaperToReviewerService = async (paperID,info) => {
   
    const result = await AuthorSubmit.updateOne({ _id: paperID }, {$set:{assignedReviewer: info}})
   
    return result;
};
exports.uploadReviewService = async (paperID,info) => {
   
    const result = await AuthorSubmit.updateOne({ _id: paperID }, {$set:{review : info}})
 
    return result;
};