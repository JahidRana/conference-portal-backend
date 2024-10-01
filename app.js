const express = require("express");
const app = express();
// const multer = require('multer');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const cloudinary = require('./config/cloudinaryConfig');
const cors = require('cors');
const bodyParser = require('body-parser');

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Cloudinary storage configuration
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'speakers',
//     format: async (req, file) => file.originalname.split('.').pop(),
//     public_id: (req, file) => `${Date.now()}-${file.originalname}`,
//   },
// });

// // Multer setup with Cloudinary storage
// const upload = multer({ storage: storage });


// Routes setup
const contactRoute = require('./Routes/v1/contact.route');
const authorRoute = require('./Routes/v1/authorSubmit');
const adminRoute = require('./Routes/v1/admin.route');
const reviewerRoute = require('./Routes/v1/reviewer.route');
const signUpRoute = require('./Routes/v1/signUp.route');
const newsignUpRoute = require('./Routes/v1/newSignup.route');//new sign up route
const committeeRoute = require('./Routes/v1/createCommittee.route');
const utilitiesRoute = require('./Routes/v1/utilities.route');
const trackRoute = require('./Routes/v1/track.route');
const signInRoute=require('./Routes/v1/signin.route');


// Set up routes using multer with Cloudinary storage
app.use('/api/v1/contact', contactRoute);
app.use('/api/v1/submit', authorRoute); // Updated route file
app.use('/api/v1/admin', adminRoute);
app.use('/api/v1/reviewer', reviewerRoute);
app.use('/api/v1/create-committee', committeeRoute);
app.use('/api/v1/sign-up', signUpRoute);

app.use('/api/v1/new-sign-up', newsignUpRoute);//new-sign up route
app.use('/api/v1/sign-in', signInRoute);//new-sign up route

app.use('/api/v1', utilitiesRoute);
app.use('/api/v1/track-chair/delete-assigned-reviewer', trackRoute);


// Health check route to test if the API is running
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is running successfully!",
    });
});



module.exports = app;
