
const { validationResult } = require('express-validator');

const Post = require('../models/posts');

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [{ title: 'First Post', content: 'This is the first post!' }]
  });
};

exports.createPost = (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      mesage: 'Validation error, entered data is incorrect',
      errors: errors.array()
    });
  }

  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.body.imageUrl;

  const post = new Post({
    title: title,
     content: content,
     imageUrl: imageUrl,
     creator: {name: 'Gerald'}
  })

  post.save()
  .then(newPost => {
    console.log(newPost);
    res.status(200).json({
      message: 'Post created successfully! ',
      posts: newPost
    });
  })
.catch(err => console.log(err));
 
}