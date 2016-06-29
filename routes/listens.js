var router = require('koa-router')();

router.get('/listen/:user_id/:music_id', function* () {
  this.body = 'Listen ' + this.params.user_id + " " + this.params.music_id;
});

module.exports = router;
