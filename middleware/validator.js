const joi = require('joi');

exports.validateUserSignup = (req, res, next) =>{
    const userSchema = joi.object({
        fullName: joi.string().required().pattern(/^[a-zA-Z]+ [a-zA-Z]+$/).messages({
                         'any.required':"full Name is required",
            'string.pattern.base': 'Full name must contain only letters and a space between first and last name',
            'string.empty':"Fullname cannot be empty",
        }),
        email: joi.string().email().required().messages({
            'any.required':"email is required",
            'string.empty':"email cannot be empty",
            'string.email': "email must be a valid email",
        }),
        phoneNumber: joi.string().pattern(/^\d{11}$/).required().messages({
            'any.required':"phone number is required",
            'string.empty':"phone number cannot be empty",
            'string.pattern.base': "phone number must be 11 digits"
        }),
        password: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/).required().messages({
             'any.required':"password is required",
            'string.empty':"password cannot be empty",
            'string.pattern.base': "password must be at least 8 characters and must include 1 uppercase and 1 lowercase"
        })
    });

    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }
    next();
};
exports.validateUserLogin = (req, res, next) =>{
    const userSchema = joi.object({
        email: joi.string().email().required().messages({
            'any.required':"email is required",
            'string.empty':"email cannot be empty",
            'string.email': "email must be a valid email"
        }),
        password: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/).required().messages({
            'any.required':"password is required",
            'string.empty':"password cannot be empty",
            'string.pattern.base': "password must be at least 8 characters and must include 1 uppercase and 1 lowercase"
        })
    });

    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }
    next();
};


exports.resetPasswordValidator = (req,res, next) =>{
    const schema = joi.object({
        email: joi.string().email().required().messages({
            'any.required':"email is required",
            'string.empty':"email cannot be empty",
            'string.email': "email must be a valid email"
        }),
         otp: joi.string().pattern(/^\d{6}$/).required().messages({
            'any.required':"OTP is required",
            'string.empty':"OTP cannot be empty",
            'string.pattern.base': "OTP must only contain digits and be 6 digits"
        }),
         Password: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/).required().messages({
            'any.required':"password is required",
            'string.empty':"password cannot be empty",
            'string.pattern.base': "password must be at least 8 characters and must include 1 uppercase and 1 lowercase"
        }),
        confirmPassword: joi.string().valid(joi.ref('Password')).required().messages({
            'any.required':"confirm password is required",
            'any.only': "confirm password must match password"
        }),
    })
    const {error} = schema.validate(req.body);

    if (error){
        return res.status(400).json({
            message: error.details[0].message
        })
    }
    next()
}
exports.changePasswordValidator = (req,res, next) =>{
    const schema = joi.object({
            oldPassword: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/).required().messages({
            'any.required':"Old password is required",
            'string.empty':"Old password cannot be empty",
            'string.pattern.base': "Old password must be at least 8 characters and must include 1 uppercase and 1 lowercase"
        }),
        newPassword: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/).required().messages({
            'any.required':"New password is required",
            'string.empty':"New password cannot be empty",
            'string.pattern.base': "New password must be at least 8 characters and must include 1 uppercase and 1 lowercase"
        }),
        confirmPassword: joi.string().valid(joi.ref('newPassword')).required().messages({
            'any.required':"confirm password is required",
            'any.only': "confirm password must match new password"
        }),
    })
    const {error} = schema.validate(req.body);

    if (error){
        return res.status(400).json({
            message: error.details[0].message
        })
    }
    next()
}

