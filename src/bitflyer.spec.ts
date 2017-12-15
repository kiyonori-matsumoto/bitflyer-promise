import {Bitflyer} from './bitflyer';

import 'mocha';
import { expect } from 'chai';

import * as nock from 'nock';
import { fail } from 'assert';

const base = 'https://api.bitflyer.jp';

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
})
