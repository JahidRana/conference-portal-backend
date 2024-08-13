// config/cloudinaryConfig.js

const cloudinary = require('cloudinary').v2;
          
cloudinary.config({ 
  cloud_name: 'dlpsf2ilp', 
  api_key: '237579442725822', 
  api_secret: 'svz8FREWrNMiODsCeVcdZtsF3sw' 
});

module.exports = cloudinary;  // Export the configured Cloudinary instance
