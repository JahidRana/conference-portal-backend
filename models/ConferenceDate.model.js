const mongoose = require('mongoose');

const ConferenceDatesSchema = mongoose.Schema({

    PaperSubmissionDeadline: {
        type: String,
        required: [true, "Please provide a Paper Submission Deadline Date"],
    },
    AcceptanceNotification: {
        type: String,
        required: [true, "Please provide Acceptance Notification Date"],
    },
    CameraReadySubmission: {
        type: String,
        required: [false, "Please provide Camera Ready Submission Date"],
    },
    RegistrationDeadline: {
        type: String,
        required: [true, "Please provide Registration Deadline Date"],
    },
    ConferenceStartDate: {
        type: String,
        required: [true, "Please provide the Conference Start Date"],
    },
    ConferenceEndDate: {
        type: String,
        required: [true, "Please provide the Conference End Date"],
    }

}, {
    timestamps: true
});

const Dates = mongoose.model('Dates', ConferenceDatesSchema);

module.exports = Dates;
