const express = require('express');

const router = express.Router();
const Comment = require('../models/comment');

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
    const comment = new Comment({
      user_id: req.body.user_id,
      post_id: req.body.post_id,
      body: req.body.body,
      username: req.body.username
    })

    const newComment = await comment.save();
    res.status(201).json(newComment);
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