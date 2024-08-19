// models/RegistrationFees.js
const mongoose = require('mongoose');

const registrationProcessSchema = new mongoose.Schema({
    step_no: { type: String, required: true },
    process: { type: String, required: true }
});

const RegistrationProcess = mongoose.model('RegistrationProcess', registrationProcessSchema );

module.exports = RegistrationProcess;
