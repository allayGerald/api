const User = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = require('../constants/jwt-secret').secret;

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation error, entered data is incorrect');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;



    bcrypt.hash(password, 12)
        .then(hashedPw => {
            const user = new User({
                email: email,
                name: name,
                password: hashedPw
            });

            return user.save()
        })
        .then(user => {
            res.status(200).json({
                message: 'User created successfully! ',
                userId: user._id
            });
        })
        .catch(err => {
            console.log(err);
            if (!err.statusCode) {
                err.statusCode = 500;
            }

            next(err);
        });

}

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    let returnedUser;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                const error = new Error('Invalid Email or Password');
                error.statusCode = 401;
                throw error;
            }

            returnedUser = user;

            return bcrypt.compare(password, user.password);
        })
        .then(isAuth => {
            if (!isAuth) {
                const error = new Error('Invalid Email or Password');
                error.statusCode = 401;
                throw error;
            }

            const token = jwt.sign(
                {
                    email: returnedUser.email,
                    id: returnedUser._id.toString()
                },
                secret,
                {
                    expiresIn: '1h'
                }
            );

            res.status(200).json({ token: token, id: returnedUser._id.toString() });
        })
        .catch(err => {
            console.log(err);
            if (!err.statusCode) {
                err.statusCode = 500;
            }

            next(err);
        });
}