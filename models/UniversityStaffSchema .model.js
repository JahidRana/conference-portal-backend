const mongoose = require('mongoose');

const UniversityStaffSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide the title"],
    },
    name: {
        type: String,
        required: [true, "Please provide the name"],
    },
    position: {
        type: String,
        required: [true, "Please provide the position"],
    },
    university: {
        type: String,
        required: [true, "Please provide the university"],
    },
    abstract: {
        type: String,
        required: [true, "Please provide the abstract"],
    },
    website: {
        type: String,
        required: [true, "Please provide the website URL"],
    },
    picture: {
        type: String,
        required: [true, "Please provide the picture URL"],
    },
    imageId: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

const UniversityStaff = mongoose.model('UniversityStaff', UniversityStaffSchema);

module.exports = UniversityStaff;
