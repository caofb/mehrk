var app = require('../../app');
var request = require('supertest')(app);
var should = require('should');

describe('controllers/user.js', function(){
  it('checkname should response false', function(done){
    request
      .get('/api/chackname?username=123')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, function(err,res){
      	res.body.isExist.should.equal(false);
      	done(err);
      });
  });
  it('checkemail should response false', function(done){
    request
      .get('/api/chackemail?email=123@1.com')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, function(err,res){
      	res.body.isExist.should.equal(false);
      	done(err);
      });
  });
});