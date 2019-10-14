const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

const Post = require('../models/posts');

exports.getPosts = (req, res, next) => {
  Post.find()
    .then(posts => {
      res.status(200).json({
        posts: posts
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(err);
    })
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation error, entered data is incorrect');
    error.statusCode = 422;
    throw error;
  }

  if (!req.file) {
    const error = new Error('No image provided.');
    error.statusCode = 422;
    throw error;
  }

  let path = req.file.path;

  const imageUrl = path.replace("\\", "/");
  const title = req.body.title;
  const content = req.body.content;

  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: { name: 'Gerald' }
  })

  post.save()
    .then(newPost => {
      res.status(200).json({
        message: 'Post created successfully! ',
        post: newPost
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

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Could not find post');
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({ post: post });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(err);
    });
}

exports.editPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation error, entered data is incorrect');
    error.statusCode = 422;
    throw error;
  }

  let imageUrl = req.body.image;
  if (req.file) {
    file_path = req.file.path;
    imageUrl = file_path.replace("\\", "/");
  }

  if (!imageUrl) {
    const error = new Error('No image selected');
    error.statusCode = 422;
    throw (error);
  }
  // console.log(req); return false;

  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.title;

  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Could not find post');
        error.statusCode = 404;
        throw error;
      }

      if (imageUrl !== post.imageUrl) {
        deleteImage(post.imageUrl);
      }

      post.imageUrl = imageUrl;
      post.title = title;
      post.content = content;

      return post.save();
    })
    .then(post => {
      res.status(200).json({ message: 'image updated', post: post });
    })
    .catch(err => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(err);
    });
}

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  console.log(postId);

  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Could not find post');
        error.statusCode = 404;
        throw error;
      }

      deleteImage(post.imageUrl);

      return Post.findByIdAndRemove(postId);
    })
    .then(result => {
      console.log(result);
      res.status(200).json({message: 'Deleted successfully'});
    })
    .catch(err => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(err);
    });
}

const deleteImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, error => {
    console.log(error);
  })
}