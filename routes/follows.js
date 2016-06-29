var router = require('koa-router')();

router.get('/follow/:from_user_id/:to_user_id', function* () {
  this.body = 'Follow ' + this.params.from_user_id + " " + this.params.to_user_id;
});

module.exports = router;
