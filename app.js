var koa = require('koa');
var co = require('co');
var mongoose = require('mongoose');
// mongoose
//var connection = mongoose.connect('localhost/test');

// models
var Song = require('./models/song');

// Define an example schema
// var Bear = mongoose.model( 'bears', new mongoose.Schema({
//     name:           String,
//     description:    String
// }));


// routes
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

// create a bear and displaying them
app.use(function *(){
    // Create a new bear
    // var bear = new Bear();
    //
    // bear.name = "Great White Bear";
    // bear.description = "A wonderful creature.";
    //
    // // Save the bear
    // yield bear.save();
    //
    // // Query for all bears
    // var bears = yield Bear.find({})
    // Set bears as JSON response
    //this.body = bears;

    var songs = yield Song.find({});
    this.body = songs;
});

app.use(function *() {
  this.body = 'Hello World'
});

function *loadMusicJSONIntoDB() {
  //console.log("loadMusicJSONIntoDB");
  var parsedMusicJSON = require('./music.json');
  //console.log(parsedMusicJSON);
  try {
    songs = yield mongoose.connection.db.listCollections({name: 'songs'}).next();
    console.log(songs);
    // if the song collection doesn't exist
    if (!songs)
    {
      for (var key in parsedMusicJSON) {
        if (parsedMusicJSON.hasOwnProperty(key)) {
          console.log(key + " -> " + parsedMusicJSON[key]);

          //result = yield Song.findOne({name: key});
          //console.log(result);
          //if (!result) { // create record
          var record = { name: key, tags: parsedMusicJSON[key]};
          console.log(record);
          yield Song.create(record);
          //}

        }
      }
    }

  } catch (err) {
    console.log(err);
  }
};

function *loadUsersIntoDB() {

  var parsedUserJSON = require('./users.json');
  try {
    users = yield mongoose.connection.db.listCollections({name: 'users'}).next();
    console.log(users);
    // if the song collection doesn't exist
    if (!users)
    {
      for (var key in parsedUserJSON) {
        if (parsedUserJSON.hasOwnProperty(key)) {
          console.log(key + " -> " + parsedUserJSON[key]);

          //result = yield Song.findOne({name: key});
          //console.log(result);
          //if (!result) { // create record
          var record = { name: key};
          console.log(record);
          yield User.create(record);
          //}

        }
      }
    }

  } catch (err) {
    console.log(err);
  }
};

co(function*() {
  yield mongoose.connect('localhost/TestSongRecommender');
  yield loadMusicJSONIntoDB;
  yield loadUsersIntoDB;
  app.listen(3001, function() { console.log('listening on 3001') });
}).catch(function(err) {
  console.error('Server boot failed:', err, err.stack);
});
