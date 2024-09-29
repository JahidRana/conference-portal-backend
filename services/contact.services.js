const Contact = require("../models/contact.model")

exports.createContactServices = async (contactInfo) => {
    const contact = await Contact.create(contactInfo);

    return contact;
};