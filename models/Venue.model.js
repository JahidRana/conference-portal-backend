const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  description: { type: String, required: true },
  imageUrl: { type: String, required: true }, // Ensure this is correctly named
  imageId: { type: String, required: true },
  // Add other fields as necessary
});

module.exports = mongoose.model('Venue', venueSchema);
