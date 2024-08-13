const mongoose = require('mongoose');


const ContactSchema = mongoose.Schema({

    name: {
        type: 'String',
        required: [true, "Please provide a name"],
    },
    email: {
        type: 'String',
        unique: [true, "Please provide an unique email"],
        required: [true, "Please provide your email address"],
    },
    description : String,

},{
    timestamps: true
})
const Contact = mongoose.model('Contact', ContactSchema);

module.exports = Contact;