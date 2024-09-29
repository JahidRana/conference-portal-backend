const {
    DeleteAssignedReviewer
} = require("../services/track.services");

exports.deleteAssignedReviewerController = async (req, res, next) => {
    const {email } = req.params;
   
    try {
        const contact = await DeleteAssignedReviewer({'email' : email});
        res.status(200).json({
            status: "success",
            message: "Massage got successfully",
            data: contact
        })
    } catch (err) {
        res.status(400).json({
            status: "Fail",
            message: "Can't created Massage",
            error: err.message
        })
    }
};
