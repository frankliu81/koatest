var router = require('koa-router')();
var User = require('../models/user');

// http://localhost:3001/follow/0/1
router.post('/follow/:user_id/:followee_user_id', function* () {

  console.log('Follow ' + this.params.user_id + " " + this.params.followee_user_id);

  try {
    var followeeUserRecord = yield User.findById(parseInt(this.params.followee_user_id, 10));
    console.log(followeeUserRecord);

    if (!followeeUserRecord) {
      throw new Error("Followee user not found");
    }

    var fromUserRecord = yield User.findByIdAndUpdate(parseInt(this.params.user_id, 10),
      { $addToSet: { "_followees": followeeUserRecord }},
      { new: true }
    );

    if (!fromUserRecord) {
      throw new Error("User not found");
    }
    //console.log(followeeUserRecord);
    this.body = "SUCCESS";

  } catch (err) {
    //console.log("ERROR: " + err);
    this.body = "ERROR: " + err;
  }

});

module.exports = router;
