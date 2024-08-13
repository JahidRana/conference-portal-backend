const {
    getHomePageContentService, getDatesService
} = require("../services/utilities.services");

exports.getHomePageMassageController = async (req, res, next) => {
    try {
        const contact = await getHomePageContentService();
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
exports.getDatesController = async (req, res, next) => {
    try {
        const dates = await getDatesService();
        res.status(200).json({
            status: "success",
            message: "Dates gets successfully",
            data: dates
        })
    } catch (err) {
        res.status(400).json({
            status: "Fail",
            message: "Can't get Dates",
            error: err.message
        })
    }
};