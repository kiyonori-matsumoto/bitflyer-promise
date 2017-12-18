const rp = require('request-promise-native');

public_methods = ['board', 'ticker', 'executions', 'getHealth'].reduce( (a, e) => {
  a[e] = (query = {}) => {
    const path = `/v1/${e.toLowerCase()}`;
    const method = 'GET';

    const options = {
      url: 'https://api.bitflyer.jp' + path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      query: query,
      json: true
    };
    return rp(options);
  }
  return a
}, {})

module.exports = public_methods;
