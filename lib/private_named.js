const pri = require('private');

const trade_base = {
  product_code: 'BTC_JPY',
  child_order_type: 'LIMIT'
}

const api = {
  buy: (options) => {
    op = Object.assign(
      {side: 'BUY'}, trade_base, options);
    pri.sendChildOrder(op);
  },
  sell: (options) => {
    op = Object.assign(
      {side: 'SELL'}, trade_base, options);
    pri.sendChildOrder(op);
  }
}
