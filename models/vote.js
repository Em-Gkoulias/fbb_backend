const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  upvote: {
    type: Boolean,
    // default: false,
  },
  downvote: {
    type: Boolean,
    // default: false,
  },
});

module.exports = mongoose.model("Vote", voteSchema);
