var koa = require('koa');
var follows         = require('./routes/follows');
var listens         = require('./routes/listens');
var recommendations = require('./routes/recommendations');
var app = koa();

app.use(follows.routes());
app.use(listens.routes());
app.use(recommendations.routes());

// logger
app.use(function *(next) {
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms)
});

app.use(function *() {
  this.body = 'Hello World'
});

app.listen(3001);
