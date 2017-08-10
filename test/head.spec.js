const sinon = require('sinon')
const io = require('../src')
const assert = require('chai').assert
io.config.baseURL = 'http://localhost:3000/api'
let success, fail, then, error

describe('#head()', function () {
  beforeEach(function () {
    success = sinon.spy()
    fail = sinon.spy()
    then = sinon.spy()
    error = sinon.spy()
  })
  it('should get head', function (done) {
    io.head('/hero', success, fail).then(function (data) {
      assert.include(data, {'test': 'head'})
      then(data)
      sinon.assert.calledOnce(then)
      sinon.assert.calledWithMatch(then, {'test': 'head'})
      sinon.assert.calledOnce(success)
      sinon.assert.calledWithMatch(success, {'test': 'head'})
      done()
    }).catch()
  })
  it('should get head with query', function (done) {
    io.head('/hero/pick', {
      pos: 'support',
      attr: 'int'
    }, success, fail).then(function (data) {
      assert.include(data, {'test': 'head'})
      then(data)
      sinon.assert.calledOnce(then)
      sinon.assert.calledWithMatch(then, {'test': 'head'})
      sinon.assert.calledOnce(success)
      sinon.assert.calledWithMatch(success, {'test': 'head'})
      done()
    }).catch()
  })
  it('should get head if business error', function (done) {
    io.head('/hero/error', {
      pos: 'support',
      attr: 'int'
    }, success, fail).then(function (data) {
      assert.include(data, {'test': 'head'})
      then(data)
      sinon.assert.calledOnce(then)
      sinon.assert.calledWithMatch(then, {'test': 'head'})
      sinon.assert.calledOnce(success)
      sinon.assert.calledWithMatch(success, {'test': 'head'})
      done()
    }).catch()
  })
  it('should trigger fail if server throw a string error', function (done) {
    io.head('/server/error', success, fail)
      .catch(function (err) {
        assert.isOk(err.hasOwnProperty('$'))
        error(err)
        sinon.assert.calledOnce(error)
        sinon.assert.notCalled(fail)
        done()
      })
  })
  it('should trigger fail if server throw a standard error', function (done) {
    io.head('/server/error/standard', success, fail)
      .catch(function (err) {
        assert.isOk(err.hasOwnProperty('$'))
        error(err)
        sinon.assert.calledOnce(error)
        sinon.assert.notCalled(fail)
        done()
      })
  })
})
