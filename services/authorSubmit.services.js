const authorSubmitModel = require("../models/authorSubmit.model")

exports.createAuthorSubmitServices = async (submitInformation) => {
    const submitInfo = await authorSubmitModel.create(submitInformation);
    console.log('from AuthorServices-------------------',submitInfo);
    return submitInfo;
};
exports.getAuthorSubmitServices = async (queries) => {
    console.log('from services getAuthorSubmitServices', queries);

    const submitInfo = await authorSubmitModel.find({})
    // .skip(queries.skip).limit(queries.limit)
    return submitInfo;
};
exports.getAuthorSubmitByEmailServices = async (queries) => {
     const {email} = queries;
    console.log('from services getAuthorSubmitByEmailServices', {author: {email : email}});

    const submitInfo = await authorSubmitModel.find({"author.email" : email})
    // .skip(queries.skip).limit(queries.limit)
    console.log(submitInfo);
    return submitInfo;
};
exports.GetReviewerAssignedPaperByEmailServices = async (queries) => {
     const {email} = queries;


    const submitInfo = await authorSubmitModel.find({"assignedReviewer.value" : email})
    // .skip(queries.skip).limit(queries.limit)
    console.log(submitInfo);
    return submitInfo;
};
exports.getAuthorSubmitByIdServices = async (queries) => {


    const submitInfo = await authorSubmitModel.find(queries)
    // .skip(queries.skip).limit(queries.limit)
    return submitInfo;
};