const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');
const { auth } = require('../utils');

router.get('/validateUsername/:username',auth(), authController.checkExistingUsername);
router.get('/validateEmail/:email',auth(), authController.checkExistingEmail);


router.get('/profile', auth(), authController.getProfileInfo);
router.put('/editProfile', auth(), authController.editProfileInfo);



module.exports = router