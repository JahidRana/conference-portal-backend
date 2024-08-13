const 
    authorSubmitServices
 = require("../services/authorSubmit.services");


 const queries = {}

exports.CreateAuthorSubmitController = async (req, res, next) => {
    try {
        const fileURL = req.file.path
        const submitInformation = {...req.body, 'fileURL': fileURL};
        // console.log(req.file,submitInformation);
        const title = req.body.title;
        if(!title){
            return res.send({code: 400, massage: "Bad Request"})
        }
        console.log('submitInformation from controller',submitInformation);
        const registeredInfo = await authorSubmitServices.createAuthorSubmitServices(submitInformation);
        res.status(200).json({
            status: "success",
            message: "Submission completed successfully",
            data: registeredInfo
        })
    } catch (err) {
        res.status(400).json({
            status: "Fail",
            message: "Can't Submitted Successfully",
            error: err,
            
        })
    }
};
exports.GetAuthorSubmitController = async (req, res, next) => {
    console.log(req.query);
    const {page=1, limit=8} =req.query;
    const skip = (page-1)*parseInt(limit);
    queries.skip = skip;
    queries.limit =limit;
    try {
        
        const registeredInfo = await authorSubmitServices.getAuthorSubmitServices(queries);
        res.status(200).json({
            status: "success",
            message: "Submitted data get successfully",
            data: registeredInfo
        })
    } catch (err) {
        res.status(400).json({
            status: "Fail",
            message: "Can't Submitted data get",
            error: err,
            
        })
    }
};
exports.GetAuthorSubmitByEmailController = async (req, res, next) => {
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxx",req.query);
    const {page=1, limit=8, email} =req.query;
    const skip = (page-1)*parseInt(limit);
    queries.skip = skip;
    queries.limit =limit;
    queries.email =email;
    console.log("queries from GetAuthorSubmitByEmailController",queries);
    try {
        
        const registeredInfo = await authorSubmitServices.getAuthorSubmitByEmailServices(queries);
        res.status(200).json({
            status: "success",
            message: "Submitted data get successfully",
            data: registeredInfo
        })
    } catch (err) {
        res.status(400).json({
            status: "Fail",
            message: "Can't Submitted data get",
            error: err,
            
        })
    }
};
exports.GetReviewerAssignedPaperByEmailController = async (req, res, next) => {
    console.log("++++++++++++++++",req.query);
    const {page=1, limit=8, email} =req.query;
    const skip = (page-1)*parseInt(limit);
    queries.skip = skip;
    queries.limit =limit;
    queries.email =email;
    console.log("queries from GetAuthorSubmitByEmailController",queries);
    try {
        
        const registeredInfo = await authorSubmitServices.GetReviewerAssignedPaperByEmailServices(queries);
        res.status(200).json({
            status: "success",
            message: "Submitted data get successfully",
            data: registeredInfo
        })
    } catch (err) {
        res.status(400).json({
            status: "Fail",
            message: "Can't Submitted data get",
            error: err,
            
        })
    }
};
exports.GetAuthorSubmitByIdController = async (req, res, next) => {
   
    const {id } = req.params;
    console.log("connectedhfgxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",id);
    const queries = {_id : id};
    
    try {
        
        const registeredInfo = await authorSubmitServices.getAuthorSubmitByIdServices(queries);
        res.status(200).json({
            status: "success",
            message: "Submitted data get successfully",
            data: registeredInfo
        })
    } catch (err) {
        res.status(400).json({
            status: "Fail",
            message: "Can't Submitted data get",
            error: err,
            
        })
    }
};