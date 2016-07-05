var router = require('koa-router')();
var User = require('../models/user');

router.get('/recommendations', function* () {
  //console.log("user_id = " + this.query.user);

  var user = yield User.findById(parseInt(this.query.user, 10))
                        .populate('_songs')
                        .populate({path: '_followees',
                        populate: {
                          path: '_songs',
                          model: 'Song'
                        }
                      }).exec();

                      //.populate('_followees')

  //console.log("songs = " + user["_songs"]);
  //console.log("followees = " + user["_followees"]);


  var songTagsForUserAndFollowees = {};

  var songs = user['_songs'];
  var followees = user['_followees'];
  // songs.forEach(function(song){
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
  songs.map(song => {
    songTags = song["tags"];
    songTags.map(tag => {
      if (songTagsForUserAndFollowees[tag] === undefined) {
        songTagsForUserAndFollowees[tag] = 1;
      } else {
        songTagsForUserAndFollowees[tag] += 1;
      }
    });
  });

  followees.map(followee => {
    //console.log("followee = " + followee);
    followeeSongs = followee["_songs"];
    followeeSongs.map(song => {
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


  //this.body = 'Recommendations ' + this.query.user;
  this.body = user;
});

module.exports = router;
