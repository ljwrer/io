const sinon = require('sinon')
const jsonp = require('../../src/jsonp')
const assert = require('chai').assert
describe('#jsonp()', function () {
  it('should jsonp data', function (done) {
    jsonp('http://localhost:3000/api/jsonp')
    setTimeout(done, 2000)
  })
  it('should jsonp data with query', function (done) {
    jsonp('http://localhost:3000/api/jsonp?a=b&c=d', done)
  })
  it('should jsonp data with timeout', function (done) {
    jsonp('http://localhost:3000/api/jsonp?a=b&c=d', {
      timeout: 2000
    }, done)
  })
  it('should cancel jsonp', function (done) {
    const spy = sinon.spy()
    const cancel = jsonp('http://localhost:3000/api/jsonp?a=b&c=d', {
      timeout: 1500
    }, spy)
    cancel()
    setTimeout(function () {
      sinon.assert.notCalled(spy)
      cancel()
      cancel()
      done()
    }, 2000)
  })
})
