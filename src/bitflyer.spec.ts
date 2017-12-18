import {Bitflyer, ChildOrderRequest} from './bitflyer';

import 'mocha';
import { expect } from 'chai';

import * as nock from 'nock';
import { fail } from 'assert';

const base = 'https://api.bitflyer.jp';
nock.disableNetConnect();

describe('Bitflyer', () => {
  let bf: Bitflyer;
  before(() => {
    bf = new Bitflyer();
  })
  describe('initialize', () => {
    it('can instanciate', () => {
      expect(bf).not.to.be.null;
    })
  })

  describe('#markets', () => {
    it('can get markets', () => {
      const exp = [
        { "product_code": "BTC_JPY" },
        { "product_code": "FX_BTC_JPY" },
        { "product_code": "ETH_BTC" },
        {
          "product_code": "BTCJPY28APR2017",
          "alias": "BTCJPY_MAT1WK"
        },
        {
          "product_code": "BTCJPY05MAY2017",
          "alias": "BTCJPY_MAT2WK"
        }
      ];
      const scope = nock(base)
      .get('/v1/markets')
      .reply(200, exp);
      return bf.markets().then(data => {
        expect(data).to.deep.equal(exp);
        expect(data[0].product_code).to.equals('BTC_JPY');
        expect(scope.isDone()).to.be.true;
      })
    })

    it('throws error when status is 500', () => {
      const scope = nock(base)
      .get('/v1/markets')
      .reply(500);

      return bf.markets()
      .then(() => fail)
      .catch(e => {
        expect(e.statusCode).to.equals(500);
      })
    })
  })

  describe('#send_child_order', () => {
    beforeEach(() => {
      bf = new Bitflyer('key', 'secret');
    })
    it('can request', () => {
      const req: ChildOrderRequest = {
        product_code: "BTC_JPY",
        child_order_type: "LIMIT",
        side: "BUY",
        price: 30000,
        size: 0.1,
        minute_to_expire: 10000,
        time_in_force: "GTC"
      }

      const res = {
        "child_order_acceptance_id": "JRF20150707-050237-639234"
      }
      
      const scope = nock(base)
      .post('/v1/me/sendchildorder', req, {reqheaders: {'ACCESS-KEY': 'key'}})
      .reply(200, res)

      return bf.send_child_order(req).then(data => {
        expect(data).to.deep.equal(res);
        expect(scope.isDone()).is.true;
      })
    })

    it('throws if key is not', () => {
      bf = new Bitflyer();
      const req: ChildOrderRequest = {
        product_code: "BTC_JPY",
        child_order_type: "LIMIT",
        side: "BUY",
        price: 30000,
        size: 0.1,
        minute_to_expire: 10000,
        time_in_force: "GTC"
      }

      return bf.send_child_order(req)
      .then(() => fail('illegal state'), (err) => {
        expect(err).not.to.be.null;
        expect(err.message).to.match(/\skey\s/)
      })
    })

    describe('mock environment', () => {
      let env: any;
      before(() => {
        env = process.env;
        process.env.BITFLYER_KEY = 'test';
        process.env.BITFLYER_SECRET = 'foobar';
      })
      it('can set key if environment is set', () => {
        bf = new Bitflyer();
        const req: ChildOrderRequest = {
          product_code: "BTC_JPY",
          child_order_type: "LIMIT",
          side: "BUY",
          price: 30000,
          size: 0.1,
          minute_to_expire: 10000,
          time_in_force: "GTC"
        }
  
        const res = {
          "child_order_acceptance_id": "JRF20150707-050237-639234"
        }
        
        const scope = nock(base)
        .post('/v1/me/sendchildorder', req, {reqheaders: {'ACCESS-KEY': 'test'}})
        .reply(200, res)
  
        return bf.send_child_order(req).then(data => {
          console.log(data);
          expect(data).to.deep.equal(res);
          expect(scope.isDone()).is.true;
        })
      })
      after(() => {
        process.env = env;
      })
    })
  })
})
