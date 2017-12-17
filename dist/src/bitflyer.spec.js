"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bitflyer_1 = require("./bitflyer");
require("mocha");
const chai_1 = require("chai");
const nock = require("nock");
const assert_1 = require("assert");
const base = 'https://api.bitflyer.jp';
nock.disableNetConnect();
describe('Bitflyer', () => {
    let bf;
    before(() => {
        bf = new bitflyer_1.Bitflyer();
    });
    describe('initialize', () => {
        it('can instanciate', () => {
            chai_1.expect(bf).not.to.be.null;
        });
    });
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
                chai_1.expect(data).to.deep.equal(exp);
                chai_1.expect(data[0].product_code).to.equals('BTC_JPY');
                chai_1.expect(scope.isDone()).to.be.true;
            });
        });
        it('throws error when status is 500', () => {
            const scope = nock(base)
                .get('/v1/markets')
                .reply(500);
            return bf.markets()
                .then(() => assert_1.fail)
                .catch(e => {
                chai_1.expect(e.statusCode).to.equals(500);
            });
        });
    });
    describe('#send_child_order', () => {
        beforeEach(() => {
            bf = new bitflyer_1.Bitflyer('key', 'secret');
        });
        it('can request', () => {
            const req = {
                product_code: "BTC_JPY",
                child_order_type: "LIMIT",
                side: "BUY",
                price: 30000,
                size: 0.1,
                minute_to_expire: 10000,
                time_in_force: "GTC"
            };
            const res = {
                "child_order_acceptance_id": "JRF20150707-050237-639234"
            };
            const scope = nock(base)
                .post('/v1/me/sendchildorder', req, { reqheaders: { 'ACCESS-KEY': 'key' } })
                .reply(200, res);
            return bf.send_child_order(req).then(data => {
                chai_1.expect(data).to.deep.equal(res);
                chai_1.expect(scope.isDone()).is.true;
            });
        });
        it('throws if key is not', () => {
            bf = new bitflyer_1.Bitflyer('key', 'secret');
            const req = {
                product_code: "BTC_JPY",
                child_order_type: "LIMIT",
                side: "BUY",
                price: 30000,
                size: 0.1,
                minute_to_expire: 10000,
                time_in_force: "GTC"
            };
            const res = {
                "child_order_acceptance_id": "JRF20150707-050237-639234"
            };
            const scope = nock(base)
                .post('/v1/me/sendchildorder', req, { reqheaders: { 'ACCESS-KEY': 'key' } })
                .reply(200, res);
            return bf.send_child_order(req)
                .then(() => assert_1.fail)
                .catch((err) => {
                chai_1.expect(err).not.to.be.null;
                chai_1.expect(err.message).to.match(/\skey\s/);
            });
        });
    });
});
