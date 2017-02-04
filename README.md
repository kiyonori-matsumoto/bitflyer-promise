# bitflyer node
## How to
```javascript
const bitflyer = require('bitflyer-promise');

bitflyer.getBalance()
.then( (data) => {
  console.log(data);
}).catch( (err) => {
  console.log(err.message);
})
```

## With options
```javascript
const bitflyer = require('bitflyer-promise');

bitflyer.sendChildOrder({
  product_code: 'BTC_JPY',
  child_order_type: 'LIMIT',
  side: 'BUY',
  price: 100000,
  size: 0.001,
  minute_to_expire: 30,
})
.then((data) => {
  console.log(data);
}).catch( (err) => {
  console.error(err.message);
})
```
