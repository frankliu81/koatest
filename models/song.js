var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var autoIncrement  = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose);

var SongSchema = new Schema({
  name: String,
  tags: []
});

//SongSchema.plugin(autoIncrement.plugin, "Song");
SongSchema.plugin(autoIncrement.plugin, {
  model: "Song",
  startAt: 1
});

module.exports = mongoose.model("Song", SongSchema);
