var router = require('koa-router')();
var User = require('../models/user');
var Song = require('../models/song');
var utilityHelpers = require('../helpers/utilityHelpers');

router.get('/recommendations', function* () {
  //console.log("user_id = " + this.query.user);

  // object containing the sum of the tags used by users and his followees
  // ie. {samba: 1, '60s': 3, ... etc.}
  var songTagsForUserAndFollowees = {};

  // hash containing a songIds the user has not heard and
  // their relevance score according to the tags
  // ie. { '1': 1, '3', 5, '4', 5, ... etc.]
  var notHeardSongIdsWithRelevance = {};

  // query for the user
  var user = yield User.findById(parseInt(this.query.user, 10))
                        .populate('_songs')
                        .populate({path: '_followees',
                          populate: {
                            path: '_songs',
                            model: 'Song'
                          }})
                        .exec();

  var userSongRecords = user['_songs'];
  var followeeRecords = user['_followees'];
  //console.log("userSongs = " + userSongs);
  //console.log("followees = " + followees);
  userSongIds = userSongRecords.map(song => {
    return song['_id'];
  });

  //console.log("userSongIds");
  //console.log(userSongIds);

  // 1) Sum the tags for songs that the user had listened to
  // in songTagsForUserAndFollowees hash (ie. {samba: 1, ... etc})
  //
  // userSongRecords.forEach(function(song){
  //   //songName = song["name"];
  //   songTags = song["tags"];
  //   songTags.forEach(function(tag){
  //     if (songTagsForUserAndFollowees[tag] === undefined) {
  //       songTagsForUserAndFollowees[tag] = 1;
  //     } else {
  //       songTagsForUserAndFollowees[tag] += 1;
  //     }
  //   });
  // });
  userSongRecords.map(song => {
    songTags = song["tags"];
    songTags.map(tag => {
      if (songTagsForUserAndFollowees[tag] === undefined) {
        songTagsForUserAndFollowees[tag] = 1;
      } else {
        songTagsForUserAndFollowees[tag] += 1;
      }
    });
  });


  // 2) Sum the tags for songs that the user's followees had listened to
  // in songTagsForUserAndFollowees hash (ie. {samba: 1, ... etc})
  //
  var allFolloweeSongIds = [];

  followeeRecords.map(followee => {
    followeeSongRecords = followee["_songs"];

    // start get the song ids that the followee listen to
    // followeeSongIds = followeeSongRecords.map(song => {
    //   return song['_id'];
    // });
    // console.log("followeeSongIds");
    // console.log(followeeSongIds);
    // allFolloweeSongIds = allFolloweeSongIds.concat(followeeSongIds);
    // // end get the song ids that the followee listen to

    followeeSongRecords.map(song => {
      songTags = song["tags"];
      songTags.map(tag => {
        if (songTagsForUserAndFollowees[tag] === undefined) {
          songTagsForUserAndFollowees[tag] = 1;
        } else {
          songTagsForUserAndFollowees[tag] += 1;
        }
      });
    });
  });

  console.log("songTagsForUserAndFollowees");
  console.log(songTagsForUserAndFollowees);

  // console.log("allFolloweeSongIds");
  // allFolloweeSongIds = utilityHelpers.arrayUnique(allFolloweeSongIds);
  // console.log(allFolloweeSongIds);

  // 3) Come up with a list of songs that the user has not heard
  //var allSongsRecords = yield Song.find({});
  //console.log("allSongsRecords");
  var allSongsNotHeardRecords = yield Song.find({_id: {$nin: userSongIds} }).exec();
  console.log("allSongsNotHeardRecords");
  console.log(allSongsNotHeardRecords);

  // 4) calculate a relevance score based on tags for the songs not heard

  allSongsNotHeardRecords.map(song => {
    songId = song['_id'];
    notHeardSongIdsWithRelevance[songId] = 0;
    // for each tag in the song, if it matches the tags used by users
    // and his followees then increase the song's relevance
    song.tags.forEach(function(tag){
      if (songTagsForUserAndFollowees[tag]) {
        notHeardSongIdsWithRelevance[songId] +=  songTagsForUserAndFollowees[tag];
      }
    })
  });

  console.log("notHeardSongIdsWithRelevance");
  console.log(notHeardSongIdsWithRelevance);

  // array containing a list of arrays of songIds the user has not heard and
  // their relevance score according to the tags
  // ie. [ [1, 1], [3, 5], [4, 5], ... etc.], where [1, 1] => [songId, score]
  // sorting should be done into an array, instea of object,
  // since object property order is not guaranteed
  // http://stackoverflow.com/questions/1069666/sorting-javascript-object-by-property-value
  var songIdsAndRelevanceSortable = [];
  for (var songId in notHeardSongIdsWithRelevance)
        songIdsAndRelevanceSortable.push([songId, notHeardSongIdsWithRelevance[songId]])
  songIdsAndRelevanceSortable.sort(
      function(a, b) {
        // a[1] and b[1] are the relevance scores
        // sort by highest first
        return b[1] - a[1]
      }
  );
  console.log("notHeardSongIdsWithRelevance sorted by highest");
  console.log(songIdsAndRelevanceSortable);

  // 5) return the top 5 results if there are five available
  // otherwise return as many as possible
  var availableResults = 5;
  var response = {"list" : []}
  var topResults = [];
  if (songIdsAndRelevanceSortable.length < 5) {
    availableResults = songIdsAndRelevanceSortable.length
  }
  for (var i=0; i<availableResults; i++){
    // ith entry of the sorted array, [0] element is the songId
    topResults.push(songIdsAndRelevanceSortable[i][0]);
  }
  response["list"] = topResults;

  //this.body = 'Recommendations ' + this.query.user;
  this.body = response;
});

module.exports = router;
