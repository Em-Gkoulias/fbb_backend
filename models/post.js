const mongoose = require("mongoose");
const Comment = require("./comment").schema;
const Vote = require('./vote').schema;

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  meme: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  comments: [Comment],
  // upvotes: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "User",
  //   },
  // ],
  // downvotes: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "User",
  //   },
  // ],
  votes: [Vote],
});

module.exports = mongoose.model("Post", postSchema);
