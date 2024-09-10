const mongoose = require('mongoose');

// Define the schema for main domain and subdomains
const DomainSchema = mongoose.Schema({
    mainDomain: {
        type: String,
        required: [true, "Please provide the main domain"],
        unique: true,  // Ensure each main domain is unique
    },
    subDomains: {
        type: [String],  // Array of strings to store related subdomains
        required: [true, "Please provide at least one subdomain"],
        validate: [subDomainsArray => subDomainsArray.length > 0, 'At least one subdomain is required']
    }
}, {
    timestamps: true  // Automatically adds createdAt and updatedAt fields
});

// Create the model from the schema
const Domain = mongoose.model('Domain', DomainSchema);

module.exports = Domain;
