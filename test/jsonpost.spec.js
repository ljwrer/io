const sinon = require('sinon')
const io = require('../src').create({
  baseURL: 'http://localhost:3002/api',
  emulateJSON: false
})
const fulfilled = require('./helper').fulfilled
const assert = require('chai').assert
let success, fail, then, error

describe('#json post()', function () {
  beforeEach(function () {
    success = sinon.spy()
    fail = sinon.spy()
    then = sinon.spy()
    error = sinon.spy()
  })
  it('should post data', function () {
    return io.post('/hero', success, fail).then(function (data) {
      assert.deepEqual(data, {data: ['doom', 'puck', 'zeus'], code: 0, message: 'ok'})
      sinon.assert.calledOnce(success)
      sinon.assert.calledWith(success, {data: ['doom', 'puck', 'zeus'], code: 0, message: 'ok'})
    })
  })
  it('should post data with query', function () {
    return io.post('/hero/pick', {
      pos: 'support',
      attr: 'int'
    }, success, fail).then(function (data) {
      assert.deepEqual(data, {data: 'chen', code: 0, message: 'ok'})
      sinon.assert.calledOnce(success)
      sinon.assert.calledWith(success, {data: 'chen', code: 0, message: 'ok'})
    })
  })
  it('should trigger fail if business error', function () {
    return io.post('/hero/error', {
      pos: 'support',
      attr: 'int'
    }, success, fail)
      .then(fulfilled, function (err) {
        assert.deepEqual(err, {data: 'sven', code: 1000, message: 'ok'})
        sinon.assert.calledOnce(fail)
        sinon.assert.calledWith(fail, {data: 'sven', code: 1000, message: 'ok'})
      })
  })
  it('should trigger fail if server throw a string error', function () {
    return io.post('/server/error', success, fail)
      .then(fulfilled, function (err) {
        assert.isOk(err.hasOwnProperty('$'))
        assert.deepEqual(err, {code: 500, data: 'server error', message: 'Request failed with status code 500'})
        sinon.assert.notCalled(fail)
      })
  })
  it('should trigger fail if server throw a standard error', function () {
    return io.post('/server/error/standard', success, fail)
      .then(fulfilled, function (err) {
        assert.deepEqual(err, {code: 502, data: 'standard error', message: 'standard error message'})
        sinon.assert.notCalled(fail)
      })
  })
})
