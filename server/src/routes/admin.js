const express = require('express');

const adminController = require('../controllers/admin');
// const isAuth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/update-password', adminController.postUpdatePasswordAdmin);
router.post('/delete', adminController.postDeleteAdmin);
router.post('/createdoc', adminController.postCreateDoc);

module.exports = router;
