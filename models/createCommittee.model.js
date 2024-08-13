const mongoose = require('mongoose');


const CreateCommitteeSchema = mongoose.Schema({

    mainCommittee: {
        committeeName : String,
        members : [{
            affiliation : String,
            designation : String,
            name : String,
            email : String,
            convenor:String
        }]
    },
    subCommittee: {
        subCommitteeName : String,
        subCommitteeMembers : [{
            affiliation : String,
            designation : String,
            name : String,
            email : String
        }]
    },
    

},{
    timestamps: true
})
const CreatedCommittee = mongoose.model('CreatedCommittee', CreateCommitteeSchema);

module.exports = CreatedCommittee;