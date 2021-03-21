const mongoose = require("mongoose");
const Post = require('./post').schema;
const Comment = require('./comment').schema;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  posts: [Post],
  comments: [Comment]
});

module.exports = mongoose.model("User", userSchema);
