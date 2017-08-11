const qs = require('./querystring')
const axios = require('axios')
const jsonp = require('./jsonp')
const _ = require('lodash')
const combineURLs = require('axios/lib/helpers/combineURLs')
const buildURL = require('axios/lib/helpers/buildURL')

const preflightDataMethods = ['post', 'put', 'patch']
const normalizeArgs = (method, url, data, success, fail, config) => {
  if (_.isFunction(data)) {
    config = fail
    fail = success
    success = data
  }
  if (_.isPlainObject(data)) {
    if (!_.includes(preflightDataMethods, method)) {
      config = _.merge({}, config, {params: data})
    } else {
      config = _.merge({}, config, {data})
    }
  } else {
    config = config || {}
  }
  config.method = method
  config.url = url
  return {
    success, fail, config
  }
}

const generalHandle = (data, res, resolve, reject, success, fail) => {
  if (!data.code) {
    success && success(data)
    resolve(data)
  } else {
    fail && fail(data)
    reject(data)
  }
}

const create = (defaultConfig) => {
  const fetch = axios.create(defaultConfig)
  const io = {fetch};
  io.interceptors = io.fetch.interceptors;
  ['get', 'delete', 'head', 'options', 'post', 'put', 'patch'].forEach((method) => {
    io[method] = function (url, requestData, success, fail, config) {
      const configs = normalizeArgs(method, url, requestData, success, fail, config)
      configs.config = _.merge({}, defaults, defaultConfig, configs.config)
      // fallback application/json to application/x-www-form-urlencoded
      if (!_.eq(false, configs.config.emulateJSON)) {
        configs.config.data = qs.stringify(configs.config.data)
      }
      return new Promise((resolve, reject) => {
        fetch.request(configs.config).then((res) => {
          if (method === 'head' || method === 'options') {
            res.data = res.headers
          }
          generalHandle(res.data, res, resolve, reject, configs.success, configs.fail)
        }).catch(error => {
          let ret, code
          /* istanbul ignore else */
          if (error.response && error.response.status) {
            code = error.response.status
          } else {
            code = 500
          }
          if (error.response && (method === 'head' || method === 'options')) {
            error.response.data = error.response.headers
          }
          /* istanbul ignore else */
          if (error.response && error.response.data) {
            if (_.isString(error.response.data)) {
              ret = {
                message: error.message,
                code,
                data: error.response.data
              }
            } else {
              ret = error.response.data
            }
          } else {
            ret = {
              code,
              message: error.message,
              data: null
            }
          }
          Object.defineProperty(ret, '$', {
            value: error
          })
          reject(ret)
        })
      })
    }
  })
  io.jsonp = function (url, requestData, success, fail, config) {
    const configs = normalizeArgs('jsonp', url, requestData, success, fail, config)
    configs.config = _.merge({}, defaults, defaultConfig, configs.config)
    configs.url = buildURL(combineURLs(configs.config.baseURL, configs.config.url), configs.config.params)
    return new Promise((resolve, reject) => {
      jsonp(configs.url, configs.config, (err, data) => {
        if (err) {
          const ret = {
            code: 500,
            message: err.message,
            data: null
          }
          Object.defineProperty(ret, '$', {
            value: err
          })
          reject(ret)
        } else {
          generalHandle(data, data, resolve, reject, configs.success, configs.fail)
        }
      })
    })
  }
  return io
}
const defaults = {}
const io = create()
io.config = defaults
io.create = create
io.axios = axios
module.exports = io
