var request = require('superagent');
var expect = require('expect.js');
var async = require('async');
var User = require('../models/user');
var Song = require('../models/song');
var mongoose = require('mongoose');
mongoose.connect('localhost/TestSongRecommender');

describe('song recommendations', function(){

  // it('finds all the users', function(done){
  //   var query = User.find({});
  //   query.then(function(users){
  //       console.log("users");
  //       console.log(users);
  //       done();
  //     });
  // })
  //
  // it('adds a songs', function(){
  //   request
  //       .post('http://localhost:3001/listen/0/2')
  //       .end(function(err, res){
  //         expect(res.status).to.equal(200);
  //       });
  // });


  it('adds the songs the users listen to', function(done){
    var parsedListenJSON = require('../listen.json')["userIds"];
    //console.log(parsedListenJSON);
    async.forEach(Object.keys(parsedListenJSON), function forAllUsers(userName, callback) {
        var songs = parsedListenJSON[userName];
        //var currentUser;
        //console.log(userName + " -> " + songs);
        var userQuery = User.findOne({'name': userName})
        userQuery.then(function(user){
            //console.log("user_id: " + user["_id"]);
            //console.log(songs);
            //currentUser = user;
            async.forEach(songs, function runSongQuery(songName, smallback) {
              //console.log(songName);
              var songQuery = Song.findOne({'name': songName})
              songQuery.then(function(song){
                //console.log("user_id: " + user["_id"]);
                //console.log("song_id: " + song["_id"]);
                // need to ensure we have both the user_id and song_id
                api_request = "http://localhost:3001/listen/" + user["_id"] + "/" + song["_id"];
                console.log(api_request);
                // listen/user_id/song_id
                //.post('http://localhost:3001/listen/0/1')
                request
                    .post(api_request)
                    .end(function(err, res){
                      expect(res.status).to.equal(200);
                      smallback()
                    });

              });
            }, function allSongs(err) {
              callback();
            })
          });
    }, function allUserNames(err) {
      done()
    })
  })

});
