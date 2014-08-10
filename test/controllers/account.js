var app = require('../../app');
var request = require('supertest')(app);
var should = require('should');
var Cookies;
describe('controllers/account.js', function(){
describe('not login', function(){
  it('acccount profile should response 404', function(done){
    request
      .get('/api/account/profile/4eb6e7e7e9b7f4194e000001')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, function(err,res){
      	done(err);
      });
  });
  it('acccount profile invalid id should response 404', function(done){
    request
      .get('/api/account/profile/123')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, function(err,res){
        done(err);
      });
  });
  it('acccount edit should response 403', function(done){
    request
      .get('/api/account/edit')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(403, function(err,res){
        done(err);
      });
  });
});

});