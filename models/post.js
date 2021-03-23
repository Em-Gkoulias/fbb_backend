const mongoose = require("mongoose");
const Comment = require("./comment").schema;

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
  comments: [Comment],
});

module.exports = mongoose.model("Post", postSchema);
