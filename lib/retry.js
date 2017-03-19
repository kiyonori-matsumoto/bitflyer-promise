const rp = require('request-promise-native')

const history = {}

module.exports = {
  add: (method, request) => {
    history[method] = request;
    return request;
  },
  retry: (method) => {
    if(!history[method])
      return Promise.reject("no method executed")
    return rp(history[method]);
  },
  show: () => consosle.log(history)
}