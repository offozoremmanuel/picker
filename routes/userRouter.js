const router = require('express').Router();
const { createUser, updateUser, login, verifyEmail } = require('../controller/userController');

const {upload} = require('../middleware/multer');

router.post('/register', upload.single(), createUser);  
router.put('/register/:id', upload.single('profilePicture'), updateUser);
router.post('/login', upload.single(), login);
router.post('/verify', upload.single(), verifyEmail);

module.exports = router;