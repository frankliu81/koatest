var router = require('koa-router')();
var User = require('../models/user');
var utilityHelpers = require('../helpers/utilityHelpers');

router.get('/users', function* () {
  var users = yield User.find({})
    .populate('_songs');
  userIndex = utilityHelpers.findWithAttr(users, '_id', 3)
  console.log(users[userIndex]["name"]);
  console.log(users[userIndex]["_songs"]);
  this.body = users;
});

module.exports = router;
