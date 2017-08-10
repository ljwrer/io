module.exports = jsonp

/**
 * Callback index.
 */

var count = 0

/**
 * Noop function.
 */

/* istanbul ignore next */
function noop () {
}

/**
 * JSONP handler
 *
 * Options:
 *  - param {String} qs parameter (`callback`)
 *  - prefix {String} qs parameter (`__jp`)
 *  - name {String} qs parameter (`prefix` + incr)
 *  - timeout {Number} how long after a timeout error is emitted (`60000`)
 *
 * @param {String} url
 * @param {Object|Function} optional options / callback
 * @param {Function} optional callback
 */

function jsonp (url, opts, fn) {
  if (typeof opts === 'function') {
    fn = opts
    opts = {}
  }
  if (!opts) opts = {}

  var prefix = opts.prefix || '__jp'

  // use the callback name that was passed if one was provided.
  // otherwise generate a unique name by incrementing our counter.
  var id = opts.name || (prefix + (count++))

  var param = opts.param || 'callback'
  var timeout = opts.timeout != null ? opts.timeout : 60000
  var enc = encodeURIComponent
  /* istanbul ignore next */
  var target = document.getElementsByTagName('script')[0] || document.head
  var script
  var timer
  /* istanbul ignore else */
  if (timeout) {
    timer = setTimeout(
      /* istanbul ignore next */
      function () {
        cleanup()
        if (fn) fn(new Error('Timeout'))
      }, timeout)
  }

  function cleanup () {
    script.onerror = null
    script.onload = null
    /* istanbul ignore else */
    if (script.parentNode) script.parentNode.removeChild(script)
    window[id] = noop
    /* istanbul ignore else */
    if (timer) clearTimeout(timer)
  }

  function cancel () {
    /* istanbul ignore else */
    if (window[id]) {
      cleanup()
    }
  }

  window[id] = function (data) {
    // debug('jsonp got', data);
    cleanup()
    if (fn) fn(null, data)
  }

  // add qs component
  url += (~url.indexOf('?') ? '&' : '?') + param + '=' + enc(id)
  url = url.replace('?&', '?')

  // debug('jsonp req "%s"', url);
  var handler = ({type}) => {
    /* istanbul ignore else */
    if (type === 'error') {
      cleanup()
      fn(new Error('http error'))
    }
  }
  // create script
  script = document.createElement('script')
  script.src = url
  script.onload = handler
  script.onerror = handler
  target.parentNode.insertBefore(script, target)
  return cancel
}
