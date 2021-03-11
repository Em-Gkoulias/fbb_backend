const express = require("express");
const multer = require('multer');
const path = require('path');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs')

const router = express.Router();
const Post = require("../models/post");

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
  // console.log(req.file);
  try {
    const fileType = req.file.mimetype.split("/")[1];
    const newFileName = req.file.filename + "." + fileType;
    
    const post = new Post({
      title: req.body.title,
      meme: newFileName,
      user: req.body.user,
    });
    fs.rename(`./uploads/${req.file.filename}`, `./uploads/${newFileName}`, () => {
      console.log('callback')
    })

    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;
