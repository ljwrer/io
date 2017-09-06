module.exports = {
  fulfilled: function (result) {
    throw new Error('Promise was unexpectedly fulfilled. Result: ' + result);
  }
}
