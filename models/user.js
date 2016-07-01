var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var autoIncrement  = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose);

var UserSchema = new Schema({
  name: String,
  _songs : [{ type: Number, ref: 'Song' }]
});

UserSchema.plugin(autoIncrement.plugin, "User");

module.exports = mongoose.model("User", UserSchema);
