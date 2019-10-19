const express = require('express');
const { body } = require('express-validator');

const router = express.Router();
const feedController = require('../controllers/feed');
const isAuth = require('../middlewares/is-auth');

router.get('/posts', isAuth, feedController.getPosts);

router.post('/post', [
    body('content').trim().isLength({ min: 5 }),
    body('title').trim().isLength({ min: 5 })
], isAuth, feedController.createPost);

router.get('/post/:postId', isAuth, feedController.getPost);

router.put('/post/:postId', isAuth, [
    body('content').trim().isLength({ min: 5 }),
    body('title').trim().isLength({ min: 5 })
], feedController.editPost);

router.delete('/post/:postId', isAuth, feedController.deletePost);

module.exports = router;