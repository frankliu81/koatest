var mongoose = require('mongoose');

var Schema   = mongoose.Schema;
var autoIncrement  = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose);

var UserSchema = new Schema({
  name: String,
  _songs : [{ type: Number, ref: 'Song' }],
  _followees: [{type: Number, ref: 'User'}]
});

UserSchema.plugin(autoIncrement.plugin, {
  model: "User",
  startAt: 1
});

module.exports = mongoose.model("User", UserSchema);
