const express = require("express");
const multer = require('multer');
const path = require('path');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs')

const router = express.Router();
const Post = require("../models/post");
const User = require('../models/user');
const Comment = require('../models/comment');

// const imgPath = require('../images/index.png');

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.send(posts);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.post("/", upload.single('file'), async (req, res) => {
  // console.log(req.body.user_id);
  try {
    const fileType = req.file.mimetype.split("/")[1];
    const newFileName = req.file.filename + "." + fileType;
    const user = await User.findById(req.body.user_id);
  
    const post = new Post({
      title: req.body.title,
      meme: newFileName,
      user
    });
    fs.rename(`./uploads/${req.file.filename}`, `./uploads/${newFileName}`, () => {
      console.log('callback')
    })

    const newPost = await post.save();
    const finalPost = await Post.findById(newPost._id).populate('user');
    res.status(201).json(finalPost);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: "post missing" });
    }
    res.send(post);    
  } catch (error) {
    console.log(error);
  }
})

module.exports = router;
