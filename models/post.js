const mongoose = require("mongoose");
const Comment = require('./comment').schema;
const User = require('./user').schema;

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
  },
  comments: [Comment],
});

module.exports = mongoose.model("Post", postSchema);
