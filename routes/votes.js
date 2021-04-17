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
    const user = await User.findById(req.body.user);

    const vote = new Vote({
      post: req.body.post,
      user: req.body.user,
      upvote: req.body.upvote,
      downvote: req.body.downvote,
    });

    const savedVote = await vote.save();

    user["votes"].push(savedVote);
    await user.save();

    post["votes"].push(savedVote);
    await post.save();

    const finalVote = await Vote.findById(savedVote._id).populate('post', 'user');
    console.log(finalVote)
    res.status(201).send(finalVote); 
  } catch (error) {
    console.log(error);
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const vote = await Vote.findById(req.params.id);
    vote.upvote = req.body.upvote;
    vote.downvote = req.body.downvote;
    const editedVote = await vote.save();

    const user = await User.findById(vote.user);
    const post = await Post.findById(vote.post);
    let totalVotes = post.votes.length;
    let userVotes = user.votes.length;
    
    let relatedVoteIndex;
    for (let i = 0; i < totalVotes; i++) {
      if (post.votes[i]._id == req.params.id) {
        relatedVoteIndex = i;
        break;
      }
    }

    for (let i = 0; i < userVotes; i++) {
      if (user.votes[i]._id == req.params.id) {
        userVoteIndex = i;
        break;
      }
    }

    const finalVote = await Vote.findById(editedVote._id).populate('post', 'user');

    post.votes[relatedVoteIndex].upvote = req.body.upvote; 
    post.votes[relatedVoteIndex].downvote = req.body.downvote;
    user.votes[userVoteIndex].upvote = req.body.upvote;
    user.votes[userVoteIndex].downvote = req.body.downvote;

    await user.save();
    await post.save();
    // const finalPost = await Post.findById(post._id).

    res.status(200).send(post.votes[0]);
  } catch (error) {
    console.log(error);
  }
});


// ---------- delete a vote ----------
router.delete('/:voteId/:postId', async (req, res) => {
  try {
    // const user = await User.findById(req.params.userId);
    const post = await Post.findById(req.params.postId);
    const vote = await Vote.findById(req.params.voteId);
    const user = await User.findById(req.user.id);
    console.log(user);

    const userIndex = user["votes"].indexOf(vote);
    user["votes"].splice(userIndex, 1);
    await user.save();

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