const authorSubmitModel = require("../models/authorSubmit.model")

exports.createAuthorSubmitServices = async (submitInformation) => {
    // Create a new instance of the model
    const submitInfo = new authorSubmitModel(submitInformation);
    
    // Perform any additional operations on submitInfo if needed
    // Example: submitInfo.someField = 'someValue';
    
    // Save the document to the database
    await submitInfo.save();

    return submitInfo;
};
exports.getAuthorSubmitServices = async (queries) => {
 
    const submitInfo = await authorSubmitModel.find({})
    // .skip(queries.skip).limit(queries.limit)
    return submitInfo;
};
exports.getAuthorSubmitByEmailServices = async (queries) => {
     const {email} = queries;

    const submitInfo = await authorSubmitModel.find({"author.email" : email})
    // .skip(queries.skip).limit(queries.limit)

    return submitInfo;
};
exports.GetReviewerAssignedPaperByEmailServices = async (queries) => {
     const {email} = queries;


    const submitInfo = await authorSubmitModel.find({"assignedReviewer.value" : email})
    // .skip(queries.skip).limit(queries.limit)

    return submitInfo;
};
exports.getAuthorSubmitByIdServices = async (queries) => {


    const submitInfo = await authorSubmitModel.find(queries)
    // .skip(queries.skip).limit(queries.limit)
    return submitInfo;
};