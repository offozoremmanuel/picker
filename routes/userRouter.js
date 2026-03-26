const router = require('express').Router();
const { createUser, updateUser } = require('../controller/userController');

const {upload} = require('../middleware/multer');

router.post('/register', upload.single('profilePicture'), createUser);  
router.put('/register/:id', upload.single('profilePicture'), updateUser);

module.exports = router;