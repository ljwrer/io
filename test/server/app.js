const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const formApp = express()
const jsonApp = express()
formApp.use(bodyParser.urlencoded({extended: false}))
jsonApp.use(bodyParser.json())
const gets = express.Router()
const posts = express.Router()
const setHeader = function (req, res, next) {
  res.set('test', 'head')
  cors({
    exposedHeaders: 'test,Content-Type',
    allowedHeaders: 'test,Content-Type',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'
  })(req, res, next)
  // next()
}
app.use(setHeader)
formApp.use(setHeader)
jsonApp.use(setHeader)
const createResponse = function (res, data, code = 0, message = 'ok') {
  res.json({
    data,
    code,
    message
  })
}
gets.all('/hero', function (req, res, next) {
  createResponse(res, [
    'doom',
    'puck',
    'zeus'
  ])
})
gets.all('/hero/pick', function (req, res, next) {
  if (req.query.pos === 'support' && req.query.attr === 'int') {
    createResponse(res, 'chen')
  }
  next()
})
gets.all('/hero/error', function (req, res, next) {
  createResponse(res, 'sven', 1000)
})
gets.all('/server/error', function (req, res, next) {
  res.status(500).end('server error')
})
gets.all('/server/error/standard', function (req, res, next) {
  res.status(501).json({
    code: 502,
    data: 'standard error',
    message: 'standard error message'
  })
})
gets.get('/jsonp', function (req, res, next) {
  res.jsonp({
    code: 0,
    message: 'ok',
    data: 'jsonp'
  })
})
gets.get('/jsonp/query', function (req, res, next) {
  if (req.query.pos === 'support' && req.query.attr === 'int') {
    res.jsonp({
      code: 0,
      message: 'ok',
      data: 'jsonp'
    })
  }
})
gets.get('/jsonp/error', function (req, res, next) {
  res.jsonp({
    code: 1000,
    message: 'ok',
    data: 'jsonp'
  })
})
gets.get('/jsonp/server/error', function (req, res, next) {
  res.status(500).jsonp('server error')
})
gets.get('/jsonp/server/error/standard', function (req, res, next) {
  res.status(501).jsonp({
    code: 502,
    data: 'standard error',
    message: 'standard error message'
  })
})
gets.get('/code', function (req, res, next) {
  createResponse(res, 'sven', '0')
})
app.use('/api', gets)
posts.all('/hero', function (req, res, next) {
  createResponse(res, [
    'doom',
    'puck',
    'zeus'
  ])
})
posts.all('/hero/pick', function (req, res, next) {
  if (req.body.pos === 'support' && req.body.attr === 'int') {
    createResponse(res, 'chen')
  }
  next()
})
posts.all('/hero/error', function (req, res, next) {
  createResponse(res, 'sven', 1000)
})
posts.all('/server/error', function (req, res, next) {
  res.status(500).end('server error')
})
posts.all('/server/error/standard', function (req, res, next) {
  res.status(501).json({
    code: 502,
    data: 'standard error',
    message: 'standard error message'
  })
})
formApp.use('/api', posts)
jsonApp.use('/api', posts)

module.exports = {
  start() {
    app.listen(3000, function () {
      console.log('listen 3000')
    })
    formApp.listen(3001, function () {
      console.log('listen 3001')
    })
    jsonApp.listen(3002, function () {
      console.log('listen 3002')
    })
  }
}
