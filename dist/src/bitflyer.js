"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rp = require("request-promise-native");
const crypto = require("crypto");
const qs = require("querystring");
class Bitflyer {
    constructor(key, secret = '') {
        this.set_credentials(key, secret);
    }
    set_credentials(key, secret = '') {
        if (typeof key === 'string') {
            this.key = key;
            this.secret = secret;
        }
        else {
            this.key = key ? key.key : '';
            this.secret = key ? key.secret : '';
        }
    }
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
        return this.send_public_request('executions');
    }
    board_state(product_code = 'BTC_JPY') {
        return this.send_public_request('getboardstate', { product_code });
    }
    health(product_code = 'BTC_JPY') {
        return this.send_public_request('gethealth', { product_code });
    }
    chats(option) {
        return this.send_public_request('getchats', option);
    }
    send_private_request(p, query) {
        if (!this.key || !this.secret) {
            throw new Error('private method needs key and secret');
        }
        const timestamp = Date.now().toString();
        const method = (/^get/.test(p)) ? 'GET' : 'POST';
        const query_str = (query && method === 'GET') ? `?${qs.stringify(query)}` : '';
        const path = `/v1/me/${p}${query_str}`;
        const body = (query && method === 'POST') ? JSON.stringify(query) : "";
        const text = timestamp + method + path + body;
        const sign = crypto.createHmac('sha256', this.secret).update(text).digest('hex');
        const options = {
            url: 'https://api.bitflyer.jp' + path,
            method: method,
            headers: {
                'ACCESS-KEY': this.key,
                'ACCESS-TIMESTAMP': timestamp,
                'ACCESS-SIGN': sign,
                'Content-Type': 'application/json'
            },
            body: ''
        };
        if (body && body !== "") {
            options.body = body;
        }
        return rp(options).then(data => JSON.parse(data));
    }
    permissions() {
        return this.send_private_request('getpermissions');
    }
    balance() {
        return this.send_private_request('getbalance');
    }
    collateral() {
        return this.send_private_request('getcollateral');
    }
    collateral_accounts() {
        return this.send_private_request('getcollateralaccounts');
    }
    addresses() {
        return this.send_private_request('getaddresses');
    }
    coinins(option) {
        return this.send_private_request('getcoinins', option);
    }
    coinouts(option) {
        return this.send_private_request('getcoinouts', option);
    }
    bank_accounts() {
        return this.send_private_request('getbankaccounts');
    }
    deposits() {
        return this.send_private_request('getdeposits');
    }
    withdraw(option) {
        return this.send_private_request('withdraw', option);
    }
    withdrawals(option) {
        return this.send_private_request('getwithdrawals', option);
    }
    send_child_order(option) {
        return this.send_private_request('sendchildorder', option);
    }
    cancel_child_order(option) {
        return this.send_private_request('cancelchildorder', option);
    }
    send_parent_order(option) {
        return this.send_private_request('sendparentorder', option);
    }
    cancel_parent_order(option) {
        return this.send_private_request('cancelparentorder', option);
    }
    cancel_all_child_orders(option) {
        return this.send_private_request('cancelallchildorders', option);
    }
    child_orders(option) {
        return this.send_private_request('getchildorders', option);
    }
    parent_orders(option) {
        return this.send_private_request('getparentorders', option);
    }
    parent_order(option) {
        return this.send_private_request('getparentorder', option);
    }
    get_executions(option) {
        return this.send_private_request('getexecutions', option);
    }
    get_positions(option) {
        return this.send_private_request('getpositions', option);
    }
    get_collateral_history(option) {
        return this.send_private_request('getcollateralhistory', option);
    }
    get_trading_commission(option) {
        return this.send_private_request('gettradingcommission', option);
    }
}
exports.Bitflyer = Bitflyer;
