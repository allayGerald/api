const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.post('/signup', [
    body('email')
        .isEmail()
        .withMessage('Please enter valid email')
        .custom((value, { req }) => {
            return User.findOne({ email: value }).then(userDoc => {
                if (userDoc) {
                    return Promise.reject('Email address already exist!');
                }
            });
        })
        .normalizeEmail(),
    body('name').trim().not().isEmpty(),
    body('password').trim().isLength({ min: 5 })
], authController.signup);

module.exports = router;