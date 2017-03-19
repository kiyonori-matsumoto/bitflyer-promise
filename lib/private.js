const rp = require('request-promise-native');
const qs = require('qs');
const crypto = require('crypto');
const retry = require('./retry');

let key = process.env.BITFLYER_KEY;
let secret = process.env.BITFLYER_SECRET;

const METHOD_NAMES = [
  'getPermissions', 'getBalance', 'getCollateral', 'getAddresses',
  'getCoinIns', 'sendCoin', 'getCoinOuts', 'getBankAccounts',
  'getDeposits', 'withDraw', 'getWithdrawals', 'sendChildOrder',
  'cancelChildOrder', 'sendParentOrder', 'cancelParentOrder',
  'calcelAllChildOrders', 'getChildOrders', 'getParentOrders',
  'getParentOrder', 'getExecutions', 'getPositions'
]

private_methods = METHOD_NAMES.reduce( (a, e) => {
  a[e] = (query=null) => {
    if(!key || !secret) {
      return Promise.reject({message: "private method needs key and secret"});
    }
    const timestamp = Date.now().toString();
    const method = (/^get/.test(e)) ? 'GET' : 'POST';
    const query_str = (query && method === 'GET') ? `?${qs.stringify(query)}` : ''
    const path = `/v1/me/${e.toLowerCase()}${query_str}`;
    const body = (query && method === 'POST') ? JSON.stringify(query): "";
    const text = timestamp + method + path + body;
    const sign = crypto.createHmac('sha256', secret).update(text).digest('hex');

    const options = {
      url: 'https://api.bitflyer.jp' + path,
      method: method,
      headers: {
        'ACCESS-KEY': key,
        'ACCESS-TIMESTAMP': timestamp,
        'ACCESS-SIGN': sign,
        'Content-Type': 'application/json'
      },
      json: true
    };
    if(body && body !== "") {
      options.body = body;
    }
    retry.add(e, options)
    return rp(options);
  }
  return a;
}, {});

private_methods._setCredentials = (_key, _secret) => {
  key = _key;
  secret = _secret;
}

module.exports = private_methods;
