const express = require('express');
const router = express.Router();
const Post = require("../models/post");
const User = require('../models/user');
const Vote = require("../models/vote");

// ---------- get all the votes ----------
router.get('/', async (req, res) => {
  try {
    const votes = await Vote.find();
    res.status(200).send(votes);
  } catch (error) {
    console.log(error);
  }
});

// ---------- get a vote ----------
router.get('/:id', async (req, res) => {
  try {
    const vote = await Vote.findById(req.params.id);
    res.status(200).send(vote);
  } catch (error) {
    console.log(error);
  }
})

// ---------- create a new vote ----------
router.post('/', async (req, res) => {
  try {
    const post = await Post.findById(req.body.post);

    const vote = new Vote({
      post: req.body.post,
      user: req.body.user,
      upvote: req.body.upvote,
      downvote: req.body.downvote,
    });

    const savedVote = await vote.save();

    post["votes"].push(savedVote);
    await post.save();

    const finalVote = await Vote.findById(savedVote._id).populate('post')
    console.log(finalVote)
    res.status(201).send(finalVote); 
  } catch (error) {
    console.log(error);
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const vote = await Vote.findById(req.params.id);
    vote.upvote = req.body.upvoted;
    vote.downvote = req.body.downvoted;
    const editedVote = await vote.save();

    const post = await Post.findById(vote.post);
    let totalVotes = post.votes.length;
    
    let relatedVoteIndex;
    for (let i = 0; i < totalVotes; i++) {
      if (post.votes[i]._id == req.params.id) {
        relatedVoteIndex = i;
        break;
      }
    }

    post.votes[relatedVoteIndex].upvote = req.params.upvoted; 
    post.votes[relatedVoteIndex].downvote = req.params.downvoted;
    await post.save();

    res.status(200).send(editedVote);
  } catch (error) {
    console.log(error);
  }
});


// ---------- delete a vote ----------
router.delete('/:voteId/:postId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    const vote = await Vote.findById(req.params.voteId);
    const index = post["votes"].indexOf(vote);
    post["votes"].splice(index, 1);
    await post.save();
    await vote.delete();
    res.status(200).send({message: 'vote deleted'})
  } catch (error) {
    console.log(error);
  }
})


module.exports = router;