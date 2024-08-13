const 
    SignUpServices
 = require("../services/signUp.services");

exports.CreateSignUpController = async (req, res, next) => {
    try {
        const signUpInfo = req.body;
        const user = await SignUpServices.findUserByEmail(signUpInfo.email)
        console.log(user);
        if(user){
            return res.status(400).send("User already registered");
        }
        const registeredInfo = await SignUpServices.createSignUpServices(signUpInfo);
        res.status(200).json({
            status: "success",
            message: "Registration completed successfully",
            data: registeredInfo
        })
    } catch (err) {
        res.status(400).json({
            status: "Fail",
            message: "Can't Registered Successfully",
            error: err,
            
        })
    }
};