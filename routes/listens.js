var router = require('koa-router')();
var Song = require('../models/song');
var User = require('../models/user');

// http://localhost:3001/listen/3/2
router.post('/listen/:user_id/:song_id', function* () {

  //this.body = 'Listen ' + this.params.user_id + " " + this.params.song_id;
  //console.log(this.params.user_id);
  //console.log(this.params.song_id);

  try {
    var songRecord = yield Song.findById(this.params.song_id);
    console.log(songRecord);

    if (!songRecord) {
      throw new Error("Song not found");
    }

    var userRecord = yield User.findByIdAndUpdate(this.params.user_id,
      { $addToSet: { "_songs": songRecord }},
      { new: true }
    );

    if (!userRecord) {
      throw new Error("User not found");
    }
    //console.log(userRecord);
    this.body = "SUCCESS";

  } catch (err) {
    //console.log("ERROR: " + err);
    this.body = "ERROR: " + err;
  }

});

module.exports = router;
