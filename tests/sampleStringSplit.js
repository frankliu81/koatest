var assert = require('chai').assert;
describe('String#split', function(){
  it('should return an array', function(){
    assert(Array.isArray('a,b,c'.split(',')));
    //assert.equal(1, 2, "1 is equal to 1");
  });
})
