var request = require('superagent');
var expect = require('expect.js');
var utilityHelpers = require('../helpers/utilityHelpers');

describe('users', function(){
 it ('gets the user', function(done){
   request.get('localhost:3001/users')
   .set('Accept', 'application/json')
   .end(function(err, res){
    //console.log(res);
    expect(res).to.exist;
    expect(res.status).to.equal(200);
    //expect(res.body).to.contain('world');
    var users = res.body;
    userIndex = utilityHelpers.findWithAttr(users, '_id', 3)
    console.log(users[userIndex]["name"]);
    console.log(users[userIndex]["_songs"]);
    expect(users[userIndex]["name"]).to.contain('u4');
    done();
   });
  });
});
