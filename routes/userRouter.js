const router = require('express').Router();
const { createUser, updateUser, login, verifyEmail, resetPassword,forgetPassword, changePasword } = require('../controller/userController');
const {checkLogin} = require('../middleware/auth');
const {validateUserSignup, resetPasswordValidator, changePasswordValidator} = require('../middleware/validator');

const {upload} = require('../middleware/multer');

router.post('/register', validateUserSignup, createUser);  
router.put('/register/:id', upload.single('profilePicture'), updateUser);
router.post('/login', login);
router.post('/verify',  verifyEmail);

router.post('/forgot-password', forgetPassword);
router.post('/reset-password', resetPasswordValidator, resetPassword);
router.post('/change-password/:id',checkLogin, changePasswordValidator, changePasword);


module.exports = router;