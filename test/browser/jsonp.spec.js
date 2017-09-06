const sinon = require('sinon')
const io = require('../../src/index')
const fulfilled = require('../helper').fulfilled
const assert = require('chai').assert
io.config.baseURL = 'http://localhost:3000/api'
let success, fail, then, error
describe('#jsonp()', function () {
  beforeEach(function () {
    success = sinon.spy()
    fail = sinon.spy()
    then = sinon.spy()
    error = sinon.spy()
  })
  it('should jsonp data', function () {
    return io.jsonp('/jsonp', success, fail).then(function (data) {
      assert.deepEqual(data, {data: 'jsonp', code: 0, message: 'ok'})
      sinon.assert.calledOnce(success)
      sinon.assert.calledWith(success, {data: 'jsonp', code: 0, message: 'ok'})
    })
  })
  it('should jsonp data with query', function () {
    return io.jsonp('/jsonp/query', {
      pos: 'support',
      attr: 'int'
    }, success, fail).then(function (data) {
      assert.deepEqual(data, {data: 'jsonp', code: 0, message: 'ok'})
      sinon.assert.calledOnce(success)
      sinon.assert.calledWith(success, {data: 'jsonp', code: 0, message: 'ok'})
    })
  })
  it('should trigger fail if business error', function () {
    return io.jsonp('/jsonp/error', {
      pos: 'support',
      attr: 'int'
    }, success, fail)
      .then(fulfilled, function (err) {
        assert.deepEqual(err, {data: 'jsonp', code: 1000, message: 'ok'})
        sinon.assert.calledOnce(fail)
        sinon.assert.calledWith(fail, {data: 'jsonp', code: 1000, message: 'ok'})
      })
  })
  it('should trigger fail if server throw a string error', function () {
    return io.jsonp('/jsonp/server/error', success, fail)
      .then(fulfilled, function (err) {
        assert.isOk(err.hasOwnProperty('$'))
        assert.deepEqual(err, {code: 500, message: 'http error', data: null})
        sinon.assert.notCalled(fail)
      })
  })
  it('should trigger fail if server throw a standard error', function () {
    return io.jsonp('/jsonp/server/error/standard', success, fail)
      .then(fulfilled, function (err) {
        assert.deepEqual(err, {code: 500, message: 'http error', data: null})
        sinon.assert.notCalled(fail)
      })
  })
})
