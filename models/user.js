const mongoose = require("mongoose");
const Post = require("./post").schema;
const Comment = require("./comment").schema;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 3,
    maxlenght: 25,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    minlength: 5,
    maxlenght: 255,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 5,
    maxlenght: 1024,
    required: true,
  },
  posts: [Post],
  comments: [Comment],
  // uniqueString: 
  confirmed: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model("User", userSchema);
