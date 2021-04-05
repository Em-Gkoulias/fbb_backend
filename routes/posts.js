const express = require("express");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs')

const router = express.Router();
const Post = require("../models/post");
const User = require('../models/user');
const Vote = require("../models/vote");

// ---------- get all posts ----------
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.send(posts);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// ---------- create a post ----------
router.post("/", upload.single('file'), async (req, res) => {
  try {
    const fileType = req.file.mimetype.split("/")[1];
    const newFileName = req.file.filename + "." + fileType;
    const user = await User.findById(req.body.user_id);
  
    const post = new Post({
      title: req.body.title,
      meme: newFileName,
      user,
      timestamp: Date.now(),

    });
    fs.rename(`./uploads/${req.file.filename}`, `./uploads/${newFileName}`, () => {
      console.log('callback')
    })

    user["posts"].push(post);
    const savedPost = await post.save();
    await user.save();
    const newPost = await Post.findById(savedPost._id).populate('user comment');
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// ---------- show a post ----------
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: "post missing" });
    }
    res.status(200).send(post);    
  } catch (error) {
    console.log(error);
  }
})

// ---------- get all comments of a post ----------
router.get("/:id/comments", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: "post missing" });
    }
    res.status(200).send(post.comments);
  } catch (error) {
    console.log(error);
  }
});

// ---------- add vote at the post ----------
router.patch('/:id/vote/create', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const vote = new Vote({
      user: req.body.user,
      upvote: req.body.upvote,
      downvote: req.body.downvote,
    })
    await vote.save();
    post.votes.push(vote);
    await post.save();
    res.status(200).send({msg: 'post votes deleted'})
  } catch (error) {
    console.log(error)
  }
})

// router.patch("/:postId/vote/edit/:voteId", async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.postId);
//     const vote = await Vote.findById(req.params.voteId);
//     const vote = new Vote({
//       user: req.body.user,
//       upvote: req.body.upvote,
//       downvote: req.body.downvote,
//     });
//     post.votes.push(vote);
//     post.save();
//     res.status(200).send({ msg: "post votes deleted" });
//   } catch (error) {
//     console.log(error);
//   }
// });

module.exports = router;
