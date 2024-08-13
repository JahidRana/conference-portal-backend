const 
    reviewerServices
 = require("../services/reviewer.services");

exports.CreateReviewerController = async (req, res, next) => {
    try {
        const info = req.body;
        console.log('accepted body from ReviewerController',info);
        if(!info.email){
            return res.send({code: 400, massage: "Bad Request"})
        }
        const registeredInfo = await reviewerServices.createReviewerService(info);
        res.status(200).json({
            status: "success",
            message: "Reviewer is added successfully",
            data: registeredInfo
        })
    } catch (err) {
        res.status(400).json({
            status: "Fail",
            message: "Reviewer Couldn't added Successfully",
            error: err,
            
        })
    }
};
exports.CreateSelectedReviewerController = async (req, res, next) => {
    try {
        console.log('callllled');
         const info = req.body;
        console.log('accepted body from ReviewerController',info);
        if(!info.email){
            return res.send({code: 400, massage: "Bad Request"})
        }
        const registeredInfo = await reviewerServices.createSelectedReviewerService(info);
        res.status(200).json({
            status: "success",
            message: "Reviewer is added successfully",
            data: registeredInfo
        })
    } catch (err) {
        res.status(400).json({
            status: "Fail",
            message: "Reviewer Couldn't added Successfully",
            error: err,
            
        })
    }
};
exports.UpdatePaperToAssigningReviewerController = async (req, res, next) => {
    try {

        const {id } = req.params

        const info = req.body
        if(!info[0].value){
            return res.send({code: 400, massage: "Bad Request"})
        }

        const registeredInfo = await reviewerServices.assigningPaperToReviewerService(id, info);
            res.status(200).json({
                status: "success",
                message: "Reviewer is added successfully to Paper",
                data: registeredInfo
            })


    } catch (err) {
        res.status(400).json({
            status: "Fail",
            message: "Reviewer Couldn't added Successfully to Paper",
            error: err,
            
        })
    }
};
exports.UploadingReviewController = async (req, res, next) => {
    try {

        const {id } = req.params

        const info = req.body

        console.log("UploadingReviewController", id, info);
        // if(!info[0].value){
        //     return res.send({code: 400, massage: "Bad Request"})
        // }

        const registeredInfo = await reviewerServices.uploadReviewService(id, info);
            res.status(200).json({
                status: "success",
                message: "Reviewer is added successfully to Paper",
                data: registeredInfo
            })


    } catch (err) {
        res.status(400).json({
            status: "Fail",
            message: "Reviewer Couldn't added Successfully to Paper",
            error: err,
            
        })
    }
};
exports.GetReviewerController = async (req, res, next) => {
    try {
        const email =req.body.email;
        console.log('email from GetReviewerController', email);
        const reviewerList = await reviewerServices.getReviewerServices({'email' : email});
        res.status(200).json({
            status: "success",
            message: "Reviewer List get successfully",
            data: reviewerList
        })
    } catch (err) {
        res.status(400).json({
            status: "Fail",
            message: "Can't get Reviewer List",
            error: err,
            
        })
    }
};
exports.GetAllReviewerListController = async (req, res, next) => {
    try {
        
        const reviewerList = await reviewerServices.getAllReviewersListServices();
        res.status(200).json({
            status: "success",
            message: "Reviewer Selected List get successfully",
            data: reviewerList
        })
    } catch (err) {
        res.status(400).json({
            status: "Fail",
            message: "Can't get Reviewer List",
            error: err,
            
        })
    }
};
exports.GetRequestedReviewersController = async (req, res, next) => {
    try {
        const reviewerList = await reviewerServices.getRequestedReviewersListServices();
        res.status(200).json({
            status: "success",
            message: "Reviewer List get successfully",
            data: reviewerList
        })
    } catch (err) {
        res.status(400).json({
            status: "Fail",
            message: "Can't get Reviewer List",
            error: err,
            
        })
    }
};
exports.deleteReviewerByIdController = async (req, res, next) => {
    try {
        const {email} = req.params
        console.log("deleteReviewerByIdController id ",email); 
        const reviewerList = await reviewerServices.deleteReviewerByIdService(email);
        res.status(200).json({
            status: "success",
            message: "Reviewer Deleted successesFully",
            data: reviewerList
        })
    } catch (err) {
        res.status(400).json({
            status: "Fail",
            message: "Can't get Reviewer List",
            error: err,
            
        })
    }
};
exports.deleteSelectedReviewerController = async (req, res, next) => {
    try {
        const {email} = req.params
        console.log("deleteReviewerByIdController id ",email); 
        const reviewerList = await reviewerServices.deleteSelectedReviewerService(email);
        res.status(200).json({
            status: "success",
            message: "Reviewer Deleted successesFully",
            data: reviewerList
        })
    } catch (err) {
        res.status(400).json({
            status: "Fail",
            message: "Can't get Reviewer List",
            error: err,
            
        })
    }
};