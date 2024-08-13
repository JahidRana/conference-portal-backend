const mongoose = require('mongoose');


const MakeAdmin = mongoose.Schema({
    email : String

},{
    timestamps: true
})
const makeAdmin = mongoose.model('makeAdmin', MakeAdmin);

module.exports = makeAdmin;