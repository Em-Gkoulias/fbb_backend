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
    // const relPost = await Post.findById(req.body.post_id);
    // const relUser = await User.findById(req.body.user_id).populate();
    
    post["comments"].push(newComment);
    user["comments"].push(newComment);
    await post.save();
    await user.save();

    const finalComment = await Comment.findById(newComment._id).populate('user', 'username');
    res.status(201).json(finalComment);
  } catch (error) {
    console.log(error);
  }
});

// router.get('/:id', async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     // console.log(post)
//     const comments = post.comments.map((commentId) => {
//       let comment = await Comment.findById(commentId);
//       return comment;
//     })


//     // const comments = await Comment.find({ post_id: req.params.id })
//     res.send(comments)
//   } catch (error) {
//     console.log(error)
//   }
// });

module.exports = router;