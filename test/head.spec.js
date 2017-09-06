const sinon = require('sinon')
const io = require('../src')
const assert = require('chai').assert
const fulfilled = require('./helper').fulfilled
io.config.baseURL = 'http://localhost:3000/api'
let success, fail, then, error

describe('#head()', function () {
  beforeEach(function () {
    success = sinon.spy()
    fail = sinon.spy()
    then = sinon.spy()
    error = sinon.spy()
  })
  it('should get head', function () {
    return io.head('/hero', success, fail).then(function (data) {
      assert.include(data, {'test': 'head'})
      sinon.assert.calledOnce(success)
      sinon.assert.calledWithMatch(success, {'test': 'head'})
    })
  })
  it('should get head with query', function () {
    return io.head('/hero/pick', {
      pos: 'support',
      attr: 'int'
    }, success, fail).then(function (data) {
      assert.include(data, {'test': 'head'})
      sinon.assert.calledOnce(success)
      sinon.assert.calledWithMatch(success, {'test': 'head'})
    })
  })
  it('should get head if business error', function () {
    return io.head('/hero/error', {
      pos: 'support',
      attr: 'int'
    }, success, fail).then(function (data) {
      assert.include(data, {'test': 'head'})
      sinon.assert.calledOnce(success)
      sinon.assert.calledWithMatch(success, {'test': 'head'})
    })
  })
  it('should trigger fail if server throw a string error', function () {
    return io.head('/server/error', success, fail)
      .then(fulfilled, function (err) {
        assert.isOk(err.hasOwnProperty('$'))
        sinon.assert.notCalled(fail)
      })
  })
  it('should trigger fail if server throw a standard error', function () {
    return io.head('/server/error/standard', success, fail)
      .then(fulfilled, function (err) {
        assert.isOk(err.hasOwnProperty('$'))
        sinon.assert.notCalled(fail)
      })
  })
})
