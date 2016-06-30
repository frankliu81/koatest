var koa = require('koa');
var co = require('co');
var parsedMusicJSON = require('./music.json');
var Song = require('./models/song');

// models
var mongoose = require('mongoose');
// mongoose
//var connection = mongoose.connect(process.env.MONGOLAB_URI || "mongodb://localhost/test");
var connection = mongoose.connect('localhost/test');
// Define an example schema
var Bear = mongoose.model( 'bears', new mongoose.Schema({
    name:           String,
    description:    String
}));


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
    var bear = new Bear();

    bear.name = "Great White Bear";
    bear.description = "A wonderful creature.";

    // Save the bear
    yield bear.save();

    // Query for all bears
    var bears = yield Bear.find({})
    var songs = yield Song.find({});

    // Set bears as JSON response
    //this.body = bears;
    this.body = songs;
});

app.use(function *() {
  this.body = 'Hello World'
});

// var loadMusicJSONIntoDB = function() {
//   console.log("loadMusicJSONIntoDB");
//   //console.log(parsedMusicJSON);
//   for (var key in parsedMusicJSON) {
//     if (parsedMusicJSON.hasOwnProperty(key)) {
//       //console.log(key + " -> " + parsedMusicJSON[key]);
//       //console.log(record);
//       Song.findOne({name: key}, function(err, result) {
//         if (err) { /* handle err */ }
//         // the record exists
//         console.log(result);
//         if (result) {
//           /* do nothing */
//         } else { // create record
//           var record = { name: key, tags: parsedMusicJSON[key]};
//           Song.create(record, function(err, record) {
//             if (err) { console.log(err); }
//             console.log(record);
//           });
//         }
//       });
//     }
//   }
// };
// loadMusicJSONIntoDB();


function *loadMusicJSONIntoDB() {
  console.log("loadMusicJSONIntoDB");
  //console.log(parsedMusicJSON);
  try {

    for (var key in parsedMusicJSON) {
      if (parsedMusicJSON.hasOwnProperty(key)) {
        console.log(key + " -> " + parsedMusicJSON[key]);
        result = yield Song.findOne({name: key});
        // the record exists
        //console.log(result);
        if (result) {
          /* do nothing */
        } else { // create record
          var record = { name: key, tags: parsedMusicJSON[key]};
          console.log(record);
          yield Song.create(record);
        }

      }
    }

  } catch (err) {
    console.log(err);

  }

};

co(function*() {
  yield loadMusicJSONIntoDB;
  app.listen(3001, function() { console.log('listening on 3001') });
}).catch(function(err) {
  console.error('Server boot failed:', err, err.stack);
});

//app.listen(3001);
