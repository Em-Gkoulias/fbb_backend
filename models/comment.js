const mongoose = require("mongoose");

// const User = require('./user').schema;

const commentSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    // required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
});

module.exports = mongoose.model("Comment", commentSchema);
