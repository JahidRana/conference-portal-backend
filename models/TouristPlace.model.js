const mongoose = require('mongoose');

const touristSchema = new mongoose.Schema({
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

const Tourist = mongoose.model('Tourist', touristSchema);

module.exports = Tourist;
