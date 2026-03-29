const userModel = require('../models/user');
const cloudinary = require('../middleware/cloudinary');
const bcrypt = require('bcrypt');
const {brevo} = require('../utils/brevo');
const emailTemplate = require('../email');
const jwt = require('jsonwebtoken');
const fs = require('fs');

exports.createUser = async (req, res) =>{
    try {
        const {fullName, email, phoneNumber, password} = req.body;
       
       const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)
       
        const User = await userModel.create({
            fullName,
            email,
            phoneNumber,
            password: hashedPassword
        });      
        const users = await userModel.find();
        const newUser = new  userModel(User);
         await newUser.save();
        brevo(newUser.email, newUser.fullName, emailTemplate(newUser.fullName, newUser.otp));
        await newUser.save();

        res.status(201).json({
            message: 'User created successfully',
           data: newUser,
            count: users.length
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
        console.log(error);
        res.status(500).json({
            message: 'Something went wrong'
        });
    }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await userModel.findOne({ email: email })
    console.log(user)
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    };

    if (user.otp !== otp) {
      return res.status(400).json({
        message: 'Invalid OTP Provided'
      })
    };
    if(Date.now() > user.otpExpire){
             return res.status(400).json({
              message:'Otp expired'
             })
        }

    user.isVerified = true;
    await user.save();
    res.status(200).json({
      message: 'OTP Verified successfully',
      data: user
    })
  } catch (error) {
    console.log(error.message),
      res.status(500).json({
        message: `Something went wrong`
      })
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email })

    if (!user) {
      return res.status(404).json({
        message: 'Invalid Credentials'
      })
    };

    const correcrtPassword = await bcrypt.compare(password, user.password);

    if (!correcrtPassword) {
      return res.status(400).json({
        message: 'Invalid Credentials'
      })
    };

    
    if (user.isVerified = false) {
      return res.status(400).json({
        message: 'Please verify your email'
      })
    };

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login sucessfull',
      token,
      user
    })
  } catch (error) {
    console.log(error),
      res.status(500).json({
        message: `Something went wrong`
      })
  }
}