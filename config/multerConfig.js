//config/multerConfig.js
const multer = require('multer');

// Configure multer to use memory storage
const storage = multer.memoryStorage(); // Use memory storage to keep file buffer in memory
const upload = multer({ storage: storage });

module.exports = upload; // Export the configured multer instance
