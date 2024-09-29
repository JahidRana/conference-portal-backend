const CommitteeModel = require("../models/createCommittee.model")

exports.createCommitteeServices = async (contactInfo) => {
    const createdCommittee = await CommitteeModel.create(contactInfo);
  
    return createdCommittee;
};
exports.getCreateCommitteeServices = async () => {

    const committeeInfo = await CommitteeModel.find({});

    return committeeInfo;
};