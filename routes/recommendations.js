var router = require('koa-router')();

router.get('/recommendations', function* () {
  this.body = 'Recommendations ' + this.query.user;
});

module.exports = router;
