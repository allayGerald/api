
const { validationResult } = require('express-validator');

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [{ title: 'First Post', content: 'This is the first post!' }]
  });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      mesage: 'Validation error, entered data is incorrect',
      errors: errors.array()
    });
  }

  res.status(200).json({
    message: 'Post created successfully! ',
    posts: [{ title: title, content: content }]
  })
}