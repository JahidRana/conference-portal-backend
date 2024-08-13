const mongoose = require('mongoose');
const validator=require('validator')


const SignUpSchema = mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please Provide Your Name"],
    },
    role: {
        type : String,
        required: [true, "Please Provide Your Role"],
        enums : ["author","admin","reviewer","TCP"]
    },
    email: {
        type: String,
        unique: [true, "Please provide an unique email"],
        required: [true, "Please provide your email address"],
        validate : {
            validator : (value)=>validator.isEmail(value),
            massage : "Please provide valid email"
        }
    },
    password : {
        type : String,
        required : [true,"Please provide your password"],
        validate : {
            validator : (value)=>
                validator.isStrongPassword(value,{
                    minLength : 6,
                    minNumbers : 1,
                    minSymbol : 1,
                }),
            massage : "Please provide Strong password",
        }
    },
    confirmPassword : {
        type : String,
        required : [true,"Please provide your password"],
        validate : {
        validator :   function(value){
           return this.password ===value
           },
        massage : "password didn't match"
        }
    }

},{
    timestamps: true
})
const SignUp = mongoose.model('SignUp', SignUpSchema);

module.exports = SignUp;