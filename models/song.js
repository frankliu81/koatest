var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var autoIncrement  = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose);

var SongSchema = new Schema({
  name: String,
  tags: []
});

SongSchema.plugin(autoIncrement.plugin, "Song");

module.exports = mongoose.model("Song", SongSchema);
