// const path = require('path');

const express = require('express');

const authController = require('../controllers/auth');
// const isAuth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/registration', authController.postRegistration);
router.post('/login', authController.postLogin);
router.get('/logout', authController.getLogout);

module.exports = router;
