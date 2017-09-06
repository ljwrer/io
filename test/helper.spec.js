const helper = require('./helper')
const assert = require('chai').assert

describe('#helper', function () {
  it('should throw error is invoke', function () {
    assert.throws(function () {
      helper.fulfilled()
    }, Error)
  })
})
