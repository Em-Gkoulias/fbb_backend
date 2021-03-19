const express = require('express');

const router = express.Router();
const Comment = require('../models/comment');
const Post = require("../models/post");
const User = require('../models/user');

router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find();
    res.send(comments);
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const post = await Post.findById(req.body.post_id);
    const user = await User.findById(req.body.user_id);

    const comment = new Comment({
      body: req.body.body,
      post,
      user, 
    });

    const newComment = await comment.save();

    // console.log(req.body.post_id);
    const relPost = await Post.findById(req.body.post_id);
    const relUser = await User.findById(req.body.user_id);
    
    relPost["comments"].push(newComment);
    relUser["comments"].push(newComment);
    await relPost.save();
    await relUser.save();

    const finalComment = await Comment.findById(newComment._id).populate('post user');
    res.status(201).json(finalComment);
  } catch (error) {
    console.log(error);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const comments = await Comment.find({ post_id: req.params.id })
    res.send(comments)
  } catch (error) {
    console.log(error)
  }
});

module.exports = router;