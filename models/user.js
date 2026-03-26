const e = require('express');
const mongoose = require('mongoose')
 
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        unique: true
    },
    role:{
        type: String,
        default: 'user'
    },
    phoneNumber:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    otp:{
        type: String,
        trim: true,
        default: () =>{
            return Math.round(Math.random() * 1e4).toString().padStart(4, '0');
        }
    },
    profilePicture:{
        secureUrl: {
            type: String,
            trim: true
        },
            publicId: {
            type: String,
            trim: true
        }

    },
    isVerified:{
        type: Boolean,
        default: false
    },
    cardType:{
        type: String,
        enum: [ 'mastercard', 'verve'],
        trim: true
    },
    bankName:{
        type: String,
        trim: true
    },
    cardNumber:{
        type: String,
        default: function() {
            return cardNumber.slice(0,4).trim() + ' **** **** ' + cardNumber.slice(-4).trim();
        }
    },
    username:{
        type: String,
        default: function() {
            return this.fullName.slice(0,4).trim()+
            Math.round(Math.random() * 1e3)
            .toString()
            .padStart(3, '0');
        }
    }
 })

 const userModel = mongoose.model('usersignup' , userSchema);

 module.exports = userModel;