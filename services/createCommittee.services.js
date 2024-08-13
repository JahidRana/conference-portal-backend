const CommitteeModel = require("../models/createCommittee.model")

exports.createCommitteeServices = async (contactInfo) => {
    const createdCommittee = await CommitteeModel.create(contactInfo);
    console.log(createdCommittee);
    return createdCommittee;
};
exports.getCreateCommitteeServices = async () => {

    const committeeInfo = await CommitteeModel.find({});
    console.log(committeeInfo);
    return committeeInfo;
};