const express = require('express');

const router = express.Router();
const Comment = require('../models/comment');
const Post = require("../models/post");
const User = require('../models/user');

// ---------- get all comments ----------
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find();
    res.send(comments);
  } catch (error) {
    console.log(error);
  }
});

// ---------- create a comment ----------
router.post("/", async (req, res) => {
  try {
    const post = await Post.findById(req.body.post_id);
    const user = await User.findById(req.body.user_id);

    const comment = new Comment({
      body: req.body.body,
      post,
      user, 
    });

    const savedComment = await comment.save();
    
    post["comments"].push(savedComment);
    user["comments"].push(savedComment);
    await post.save();
    await user.save();

    const finalComment = await Comment.findById(savedComment._id).populate('user', 'username');
    res.status(201).json(finalComment);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;