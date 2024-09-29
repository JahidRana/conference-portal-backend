const HomePageMassage = require("../models/HomePageContentModel");
const Dates = require("../models/ConferenceDate.model");


exports.getHomePageContentService = async () => {
    const submitInfo = await HomePageMassage.find({});
 
    return submitInfo;
};
exports.getDatesService = async () => {
    const submitInfo = await Dates.find({});

    return submitInfo;
};