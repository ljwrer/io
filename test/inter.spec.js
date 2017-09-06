const sinon = require('sinon')
const io = require('../src')
io.config.baseURL = 'http://localhost:3000/api'
let req, res
let success, fail, errorHandle
describe('#interceptors', function () {
  beforeEach(function () {
    success = sinon.spy()
    fail = sinon.spy()
    req = sinon.stub().returnsArg(0)
    res = sinon.stub().returnsArg(0)
    errorHandle = sinon.spy(function (error) {
      return Promise.reject(error)
    })
  })
  it('should trigger interceptors when success', function () {
    io.interceptors.request.use(req, errorHandle)
    io.interceptors.response.use(res, errorHandle)
    return io.get('/hero', success, fail).then(function () {
      sinon.assert.calledOnce(req)
      sinon.assert.calledOnce(res)
    })
  })
  it('should trigger interceptors when error', function () {
    io.interceptors.request.use(req, errorHandle)
    io.interceptors.response.use(res, errorHandle)
    return io.get('/server/error/standard', success, fail).catch(function () {
      sinon.assert.calledOnce(req)
      sinon.assert.calledOnce(errorHandle)
    })
  })
})
