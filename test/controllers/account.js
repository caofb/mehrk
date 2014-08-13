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
  describe('login first', function(){
    var token;
    it('should get valid token',function(done){
      request
      .get('/api/login')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, function(err,res){
        token=res.body.token;
        Cookies = res.headers['set-cookie']
            .map(function(r){
              return r.replace("; path=/; httponly","") 
            }).join("; ");
        done(err);
      });
    });
    it('should create user session for valid user', function (done) {
       var req=request.post('/login');
        req.cookies = Cookies;    
         
        req.set('Accept','application/json')
        .send({"username": "caofb65", "password": "123456","remember":false,"_csrf":token})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          res.body.code.should.equal(200);
          Cookies = res.headers['set-cookie']
            .map(function(r){
              return r.replace("; path=/; httponly","") 
            }).join("; ");
          done(err);
        });     
    });
    it('should changeProfile success', function (done) {
       var req=request.post('/api/account/changeProfile');
        req.cookies = Cookies;    
         
        req.set('Accept','application/json')
        .send({"location": "beijing", "signature": "test","website":"www.1.com","_csrf":token})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          res.body.code.should.equal(200);
         
          done(err);
        });     
    });
  });
});