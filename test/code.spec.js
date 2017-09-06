const sinon = require('sinon')
const io = require('../src')
const assert = require('chai').assert
io.config.baseURL = 'http://localhost:3000/api'
let success, fail, then, error

describe('#code custom', function () {
  beforeEach(function () {
    success = sinon.spy()
    fail = sinon.spy()
    then = sinon.spy()
    error = sinon.spy()
  })
  it('should invoke success handle', function () {
    return io.get('/code', success, fail).then(function (data) {
      assert.deepEqual(data, {data: 'sven', code: '0', message: 'ok'})
      sinon.assert.calledOnce(success)
      sinon.assert.calledWith(success, {data: 'sven', code: '0', message: 'ok'})
    })
  })
})
