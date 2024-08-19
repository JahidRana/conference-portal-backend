// models/RegistrationFees.js
const mongoose = require('mongoose');

const registrationFeesSchema = new mongoose.Schema({
    category: { type: String, required: true },
    local: { type: String, required: true },
    international: { type: String, required: true },
});

const RegistrationFees = mongoose.model('RegistrationFees', registrationFeesSchema);

module.exports = RegistrationFees;
