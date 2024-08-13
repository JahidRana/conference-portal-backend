const authorSubmit = require("../models/authorSubmit.model")


exports.DeleteAssignedReviewer = async ({email}) =>{
    // console.log(email);
    
    // const submitInfo = await authorSubmit.updateOne({"assignedReviewer.value" : email}, { $unset: { "assignedReviewer.value": 1 } });
    // console.log('from review services deleteReviewerByIdService- DeleteInfo ---',submitInfo);
    // return submitInfo;
    // const user = await SignUp.findOne({email : email});
    // return user;
};