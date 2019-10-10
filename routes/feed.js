const express = require('express');
const { body } = require('express-validator');

const router = express.Router();
const feedController = require('../controllers/feed');

router.get('/posts', feedController.getPosts);
router.post('/post', [
    body('content').trim().isLength({min: 5}),
    body('title').trim().isLength({min: 5})
], feedController.createPost);

module.exports = router;