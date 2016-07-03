var request = require('superagent');
var expect = require('expect.js');

describe('users', function(){
  it('should respond to GET',function(){
    request
      .get('http://localhost:3001/users')
      .end(function(res){
        expect(res.status).to.equal(200);
    })
  })
});
