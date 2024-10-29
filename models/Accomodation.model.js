const mongoose = require('mongoose');

const accommodationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  
    imageUrl: {
      type: String,
      required: true, // URL of the uploaded image
    },
    imageId: {
      type: String,
      required: true, // Cloudinary public ID of the image
    },

});

const Accommodation = mongoose.model('Accommodation', accommodationSchema);

module.exports = Accommodation;
