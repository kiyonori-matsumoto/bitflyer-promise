"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rp = require("request-promise-native");
class Bitflyer {
    send_public_request(path, query) {
        const p = `/v1/${path}`;
        const method = 'GET';
        const options = {
            url: 'https://api.bitflyer.jp' + p,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            json: true,
            query: query
        };
        return rp(options);
    }
    markets() {
        return this.send_public_request('markets');
    }
    boards(product_code = 'BTC_JPY') {
        return this.send_public_request('board', { product_code });
    }
    ticker(product_code = 'BTC_JPY') {
        return this.send_public_request('board', { product_code });
    }
    executions(product_code = 'BTC_JPY', option) {
        return this.send_public_request('executions', option);
    }
}
exports.Bitflyer = Bitflyer;
