const 
CommitteeServices
 = require("../services/createCommittee.services");

exports.CreateCommitteeController = async (req, res, next) => {
    try {
        const committeeInfo = req.body;

        const registeredInfo = await CommitteeServices.createCommitteeServices(committeeInfo);
        res.status(200).json({
            status: "success",
            message: "Committee completed successfully",
            data: registeredInfo
        })
    } catch (err) {
        res.status(400).json({
            status: "Fail",
            message: "Can't Committee Successfully",
            error: err,
            
        })
    }
};
exports.getCreatedCommitteeController = async (req, res, next) => {
    try {
        const committeeList = await CommitteeServices.getCreateCommitteeServices();
        res.status(200).json({
            status: "success",
            message: "Admin List get successfully",
            data: committeeList
        })
    } catch (err) {
        res.status(400).json({
            status: "Fail",
            message: "Can't get Admin List",
            error: err,
            
        })
    }
};