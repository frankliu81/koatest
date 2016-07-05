var request = require('superagent');
var expect = require('expect.js');
var async = require('async');
var User = require('../models/user');
var Song = require('../models/song');
var mongoose = require('mongoose');
mongoose.connect('localhost/TestSongRecommender');

var baseURL = "http://localhost:3001"

// var, let, const
// function () {
//   console.log(potato);
//
//   if (something) {
//     const potato = {};
//
//     // ok
//     potato.potato = 5;
//     // exception
//     potato = 6
//   }
// }
//
// variable hoisting
// function () {
//   // define variable at the beginning, javascript will force it anyway
//   var potato;
//   console.log(potato);
//
//   if (something) {
//     potato = 5;
//   }
// }
// Example from Gabe:
describe('song recommendations', function(){

  it('adds the songs the users listen to', function(done){
        var parsedListenJSON = require('../listen.json')["userIds"];
        const keys = Object.keys(parsedListenJSON);

        // array of key strings => array of promises
        // promises return ??????
        const userSongs = keys.map(userName => {

          const songNames = parsedListenJSON[userName];
          const userPromise = User.findOne({'name': userName}).exec();

          return userPromise.then(user => {
            return Promise.all(songNames.map(songName => {
                return Song.findOne({'name': songName}).exec();
              }))
              .then(songs => {
                return {user: user, songs: songs};
              })
          });
        })


        function makeRequest (user, song) {
          const url = "http://localhost:3001/listen/" + user["_id"] + "/" + song["_id"];

          return new Promise((resolve, reject) => {
            request.post(url)
              .end(function(err, res) {
                if (err) {
                  reject(err);
                } else {
                  resolve(res);
                }
              });
            })
        }

        Promise.all(
          userSongs.map(promise => {
            return promise.then(function (obj) {
              return Promise.all(obj.songs.map(makeRequest.bind(null, obj.user)))
            })
        })
        ).then(function(responses){
          done();
        })
    })
})
