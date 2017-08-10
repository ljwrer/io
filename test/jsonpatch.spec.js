const sinon = require('sinon')
const io = require('../src').create({
  baseURL: 'http://localhost:3002/api',
  emulateJSON: false
})
const assert = require('chai').assert
let success, fail, then, error

describe('#json patch()', function () {
  beforeEach(function () {
    success = sinon.spy()
    fail = sinon.spy()
    then = sinon.spy()
    error = sinon.spy()
  })
  it('should patch data', function (done) {
    io.patch('/hero', success, fail).then(function (data) {
      assert.deepEqual(data, {data: ['doom', 'puck', 'zeus'], code: 0, message: 'ok'})
      then(data)
      sinon.assert.calledOnce(then)
      sinon.assert.calledWith(then, {data: ['doom', 'puck', 'zeus'], code: 0, message: 'ok'})
      sinon.assert.calledOnce(success)
      sinon.assert.calledWith(success, {data: ['doom', 'puck', 'zeus'], code: 0, message: 'ok'})
      done()
    }).catch(function (error) {
      console.log(error.$.config)
    })
  })
  it('should patch data with query', function (done) {
    io.patch('/hero/pick', {
      pos: 'support',
      attr: 'int'
    }, success, fail).then(function (data) {
      assert.deepEqual(data, {data: 'chen', code: 0, message: 'ok'})
      then(data)
      sinon.assert.calledOnce(then)
      sinon.assert.calledWith(then, {data: 'chen', code: 0, message: 'ok'})
      sinon.assert.calledOnce(success)
      sinon.assert.calledWith(success, {data: 'chen', code: 0, message: 'ok'})
      done()
    }).catch(function (err) {
      console.log(err.$)
    })
  })
  it('should trigger fail if business error', function (done) {
    io.patch('/hero/error', {
      pos: 'support',
      attr: 'int'
    }, success, fail)
      .catch(function (err) {
        assert.deepEqual(err, {data: 'sven', code: 1000, message: 'ok'})
        error(err)
        sinon.assert.calledOnce(error)
        sinon.assert.calledWith(error, {data: 'sven', code: 1000, message: 'ok'})
        sinon.assert.calledOnce(fail)
        sinon.assert.calledWith(fail, {data: 'sven', code: 1000, message: 'ok'})
        done()
      })
  })
  it('should trigger fail if server throw a string error', function (done) {
    io.patch('/server/error', success, fail)
      .catch(function (err) {
        assert.isOk(err.hasOwnProperty('$'))
        assert.deepEqual(err, {code: 500, data: 'server error', message: 'Request failed with status code 500'})
        error(err)
        sinon.assert.calledOnce(error)
        sinon.assert.calledWith(error, {
          code: 500,
          data: 'server error',
          message: 'Request failed with status code 500'
        })
        sinon.assert.notCalled(fail)
        done()
      })
  })
  it('should trigger fail if server throw a standard error', function (done) {
    io.patch('/server/error/standard', success, fail)
      .catch(function (err) {
        assert.deepEqual(err, {code: 502, data: 'standard error', message: 'standard error message'})
        error(err)
        sinon.assert.calledOnce(error)
        sinon.assert.calledWith(error, {code: 502, data: 'standard error', message: 'standard error message'})
        sinon.assert.notCalled(fail)
        done()
      })
  })
})
