const userModel = require('../models/user');
const cloudinary = require('../middleware/cloudinary');
const bcrypt = require('bcrypt');

const fs = require('fs');

exports.createUser = async (req, res) =>{
    try {
        const {fullName, email, phoneNumber, password} = req.body;
       
       const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await userModel.create({
            fullName,
            email,
            phoneNumber, 
            password: hashedPassword,
        });
        res.status(201).json({
            message: 'User created successfully',
            user: newUser
         });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'something went wrong',
        });
    }
};
exports.updateUser = async (req, res) =>{
    try {
       
         const file = req.file;
      const cloudFile = await cloudinary.uploader.upload(file.path);

     const profExtracturl = {
            secureUrl: cloudFile.secure_url,
            publicId: cloudFile.public_id
        };
        console.log(profExtracturl);

        fs.unlinkSync(file.path);
         const {id} = req.params;
        const {bankName, cardNumber} = req.body;
        const updatedUser = await userModel.findByIdAndUpdate(id, {
            bankName,
            cardNumber,
            profilePicture: profExtracturl
        }, 
        {
            new: true
        });
        res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: 'Something went wrong'
        });
    }
};
