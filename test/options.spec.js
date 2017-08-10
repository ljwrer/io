const sinon = require('sinon')
const io = require('../src')
const assert = require('chai').assert
io.config.baseURL = 'http://localhost:3000/api'
let success, fail, then, error

describe('#options()', function () {
  beforeEach(function () {
    success = sinon.spy()
    fail = sinon.spy()
    then = sinon.spy()
    error = sinon.spy()
  })
  it('should receive options', function (done) {
    io.options('/hero', success, fail).then(function (data) {
      assert.include(data, {'test': 'head'})
      then(data)
      sinon.assert.calledOnce(then)
      sinon.assert.calledWithMatch(then, {'test': 'head'})
      sinon.assert.calledOnce(success)
      sinon.assert.calledWithMatch(success, {'test': 'head'})
      done()
    }).catch()
  })
  it('should receive options with query', function (done) {
    io.options('/hero/pick', {
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
  it('should receive options if business error', function (done) {
    io.options('/hero/error', {
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
  it('should receive options if server throw a string error', function (done) {
    io.options('/server/error', success, fail)
      .then(function (data) {
        assert.include(data, {'test': 'head'})
        then(data)
        sinon.assert.calledOnce(then)
        sinon.assert.calledWithMatch(then, {'test': 'head'})
        sinon.assert.calledOnce(success)
        sinon.assert.calledWithMatch(success, {'test': 'head'})
        done()
      })
  })
  it('should receive options if server throw a string error', function (done) {
    io.options('/server/error/standard', success, fail)
      .then(function (data) {
        assert.include(data, {'test': 'head'})
        then(data)
        sinon.assert.calledOnce(then)
        sinon.assert.calledWithMatch(then, {'test': 'head'})
        sinon.assert.calledOnce(success)
        sinon.assert.calledWithMatch(success, {'test': 'head'})
        done()
      })
  })
})
