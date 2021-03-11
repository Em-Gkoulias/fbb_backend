const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  meme: {
    type: String,
    required: true
  },
  user: {
    type: Object,
    required: true
  }
})

module.exports = mongoose.model('Post', postSchema);