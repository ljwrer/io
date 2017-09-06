const sinon = require('sinon')
const io = require('../src').create({
  baseURL: 'http://localhost:3001/api'
})
const fulfilled = require('./helper').fulfilled
const assert = require('chai').assert
let success, fail, then, error

describe('#patch()', function () {
  beforeEach(function () {
    success = sinon.spy()
    fail = sinon.spy()
    then = sinon.spy()
    error = sinon.spy()
  })
  it('should patch data', function () {
    return io.patch('/hero', success, fail).then(function (data) {
      assert.deepEqual(data, {data: ['doom', 'puck', 'zeus'], code: 0, message: 'ok'})
      sinon.assert.calledOnce(success)
      sinon.assert.calledWith(success, {data: ['doom', 'puck', 'zeus'], code: 0, message: 'ok'})
    })
  })
  it('should patch data with query', function () {
    return io.patch('/hero/pick', {
      pos: 'support',
      attr: 'int'
    }, success, fail).then(function (data) {
      assert.deepEqual(data, {data: 'chen', code: 0, message: 'ok'})
      sinon.assert.calledOnce(success)
      sinon.assert.calledWith(success, {data: 'chen', code: 0, message: 'ok'})
    })
  })
  it('should trigger fail if business error', function () {
    return io.patch('/hero/error', {
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
    return io.patch('/server/error', success, fail)
      .then(fulfilled, function (err) {
        assert.isOk(err.hasOwnProperty('$'))
        assert.deepEqual(err, {code: 500, data: 'server error', message: 'Request failed with status code 500'})
        sinon.assert.notCalled(fail)
      })
  })
  it('should trigger fail if server throw a standard error', function () {
    return io.patch('/server/error/standard', success, fail)
      .then(fulfilled, function (err) {
        assert.deepEqual(err, {code: 502, data: 'standard error', message: 'standard error message'})
        sinon.assert.notCalled(fail)
      })
  })
})
