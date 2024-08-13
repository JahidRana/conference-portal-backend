const mongoose = require('mongoose');


const HomePageContentSchema = mongoose.Schema({

    content: {
        type: 'String',
        required: [true, "Please provide a Content"],
    },
},{
    timestamps: true
})
const HomePageMassage = mongoose.model('HomePageMassage', HomePageContentSchema);

module.exports = HomePageMassage;