const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const assert = chai.assert;

chai.use(chaiHttp);

suite('Functional Tests', function() {

  let likesBefore;

  test('1. Viewing one stock: GET request to /api/stock-prices', function(done) {
    chai.request(server)
      .get('/api/stock-prices?stock=GOOG')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body.stockData);
        assert.property(res.body.stockData, 'stock');
        assert.property(res.body.stockData, 'price');
        assert.property(res.body.stockData, 'likes');
        likesBefore = res.body.stockData.likes;
        done();
      });
  });

  test('2. Viewing one stock and liking it: GET request to /api/stock-prices', function(done) {
    chai.request(server)
      .get('/api/stock-prices?stock=GOOG&like=true')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body.stockData);
        assert.property(res.body.stockData, 'stock');
        assert.property(res.body.stockData, 'price');
        assert.property(res.body.stockData, 'likes');
        assert.isAtLeast(res.body.stockData.likes, likesBefore);
        done();
      });
  });

  test('3. Viewing the same stock and liking it again (should not increase): GET request to /api/stock-prices', function(done) {
    chai.request(server)
      .get('/api/stock-prices?stock=GOOG&like=true')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body.stockData);
        assert.property(res.body.stockData, 'stock');
        assert.property(res.body.stockData, 'price');
        assert.property(res.body.stockData, 'likes');
        assert.isAtMost(res.body.stockData.likes, likesBefore + 1);
        done();
      });
  });

  test('4. Viewing two stocks: GET request to /api/stock-prices', function(done) {
    chai.request(server)
      .get('/api/stock-prices?stock=GOOG&stock=MSFT')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body.stockData);
        assert.lengthOf(res.body.stockData, 2);
        assert.exists(res.body.stockData[0].rel_likes);
        assert.exists(res.body.stockData[1].rel_likes);
        done();
      });
  });

  test('5. Viewing two stocks and liking them: GET request to /api/stock-prices', function(done) {
    chai.request(server)
      .get('/api/stock-prices?stock=GOOG&stock=MSFT&like=true')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body.stockData);
        assert.lengthOf(res.body.stockData, 2);
        assert.exists(res.body.stockData[0].rel_likes);
        assert.exists(res.body.stockData[1].rel_likes);
        done();
      });
  });

});
