var router = require('koa-router')();
var User = require('../models/user');

// http://localhost:3001/listen/3/2
router.post('/listen/:user_id/:music_id', function* () {

  //this.body = 'Listen ' + this.params.user_id + " " + this.params.music_id;
  var users = yield User.find({});
  this.body = users;

});

module.exports = router;
