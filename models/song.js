var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var SongSchema = new Schema({
  name: String,
  tags: []
});

module.exports = mongoose.model("Song", SongSchema);
