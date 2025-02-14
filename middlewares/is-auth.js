const jwt = require('jsonwebtoken');
const secret = require('../constants/jwt-secret').secret;

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
        const error = new Error('Not Authenticated.');
        error.statusCode = 401;
        throw error;
    }

    const token = req.get('Authorization').split(' ')[1];

    let decodedToken;
    console.log(decodedToken);

    try {
        decodedToken = jwt.verify(token, secret);
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }

    if (!decodedToken) {
        const error = new Error('Not Authenticated.');
        error.statusCode = 401;
        throw error;
    }

    console.log(decodedToken.id);
    req.userId = decodedToken.id;
    next();
}