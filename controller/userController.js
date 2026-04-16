const userModel = require('../models/user');
const cloudinary = require('../middleware/cloudinary');
const bcrypt = require('bcrypt');
const {brevo} = require('../utils/brevo');
const {emailtemplate} = require('../email');
const {resetPasswordTemplate,resetPasswordSuccessfulTemplate} = require('../email');
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
        brevo(newUser.email, newUser.fullName, emailtemplate(newUser.fullName, newUser.otp));
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
        const {email, password} = req.body;
        const user = await userModel.findOne({ email: email.toLowerCase() })

        if (!user){
            return res.status(404).json({
                message: 'Invalid Credentials'
            })
        }

        const correctPassword = await bcrypt.compare(password, user.password)

        if (!correctPassword) {
            return res.status(400).json({
                message: 'Invalid Credentials'
            })
        }
        if (user.isVerified == false) {
            return res.status(400).json({
                message: 'Please verify your email'
            })
        };

        const token = jwt.sign(
            {id: user._id, role: user.role},
            process.env.SECRET_KEY,
            {expiresIn: '1d'}
        );

        res.status(200).json({
            message: 'Login successfull',
            token,
            user
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: `Something went wrong`
        })
    }
}

exports.forgetPassword = async (req, res) => {
    try {
        const {email} = req.body
        const user = await userModel.findOne({ email: email.toLowerCase() })

        if (user == null){
            return res.status(404).json({
                message: 'invalid credentials'
            })
        }
        // Generate OTP
        const OTP = Math.round(Math.random() * 1e6).toString().padStart(6, "0");
        // Save OTP and expiration time to user document
        user.otp = OTP
        user.otpExpire = Date.now() +( 1000 * 60 * 7) // OTP valid for 7 minutes
    
        const data = {
            name: user.fullName,
            otp:OTP
        }

        // Send OTP via email
        await brevo(email,user.fullName, resetPasswordTemplate(data));
        // save the changes to our database
        await user.save()

        res.status(200).json({
            message: 'OTP sent successfully'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const {email, otp, Password} = req.body
        const user = await userModel.findOne({ email: email.toLowerCase() })
        // Check if user exists
        if (user == null){
            return res.status(404).json({
                message: 'invalid credentials'
            })
        }
        if(Date.now() > user.otpExpire || user.otp !== otp){
            return res.status(400).json({
                message:'invalid OTP'
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(Password, salt)
        user.Password = hashedPassword
        console.log("Password:", Password);
        await user.save();
        const data = {
            name: user.fullName,
            otp:user.otp
        }
        await brevo(email,user.fullName, resetPasswordSuccessfulTemplate(data));
        res.status(200).json({
            message: 'Password reset successfully'
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
}

exports.changePasword = async (req,res) =>{
    try {
        const {id} = req.params
        const {oldPassword, newPassword} = req.body;
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }
        const checkPassword = await bcrypt.compare(oldPassword, user.password)
        if (!checkPassword) {
            return res.status(400).json({
                message: 'old password is Invalid '
            })
        }  
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({
            message: 'Password changed successfully'
        }) 
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
}