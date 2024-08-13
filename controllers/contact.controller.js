const {
    createContactServices
} = require("../services/contact.services");

exports.createContactController = async (req, res, next) => {
    try {
        const contactDetails = req.body;
        
        const contact = await createContactServices(contactDetails);
        console.log(contact);
        res.status(200).json({
            status: "success",
            message: "Contact created successfully",
            data: contact
        })
    } catch (err) {
        res.status(400).json({
            status: "Fail",
            message: "Can't created Contact",
            error: err.message
        })
    }
};