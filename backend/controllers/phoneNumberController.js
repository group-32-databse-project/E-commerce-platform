const PhoneNumber = require('../models/PhoneNumber'); // Assuming you have a PhoneNumber model

// Save phone number
exports.savePhoneNumber = async (req, res) => {
    try {
        const { phone } = req.body;
        const { id } = req.params;
       // console.log('Saving phone number:', phone);
       // console.log('Saving phone id:', id);
       const phonenum =  await PhoneNumber.save(phone,id);
       
       if(!phonenum){
        return res.status(404).json({ message: 'Phone number not found' });
         }
        console.log('Saving phone number:', phone);
        res.status(201).json({ message: 'Phone number saved successfully', PhoneNumber });
    } catch (error) {
        res.status(500).json({ message: 'Error saving phone number', error });
    }
};

// Display phone numbers
exports.getPhoneNumbers = async (req, res) => {
    try {
        const phoneNumbers = await PhoneNumber.find();
        res.status(200).json(phoneNumbers);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving phone numbers', error });
    }
};