const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  post_id: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Comment', commentSchema);