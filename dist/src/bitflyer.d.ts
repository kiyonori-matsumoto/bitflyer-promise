/// <reference types="request-promise-native" />
import * as rp from 'request-promise-native';
export declare class Bitflyer {
    private send_public_request(path, query?);
    markets(): Promise<MarketResponse[]>;
    boards(product_code?: string): Promise<BoardResponse>;
    ticker(product_code?: string): Promise<TickerResponse>;
    executions(product_code?: string, option?: PageFormat): rp.RequestPromise;
}
export interface MarketResponse {
    product_code: string;
    alias?: string;
}
export interface BoardResponse {
    mid_price: number;
    bids: {
        price: number;
        size: number;
    }[];
    asks: {
        price: number;
        size: number;
    }[];
}
export interface TickerResponse {
    product_code: string;
    /**時刻はUTC(協定世界時)で表されます */
    timestamp: string;
    tick_id: number;
    best_bid: number;
    best_ask: number;
    best_bid_size: number;
    best_ask_size: number;
    total_bid_depth: number;
    total_ask_depth: number;
    /**最終取引価格 */
    ltp: number;
    /**24時間の取引量 */
    volume: number;
    volume_by_product: number;
}
export interface PageFormat {
    /**結果の個数を指定します。省略した場合の値は 100 です。 */
    count?: number;
    /**このパラメータに指定した値より小さい id を持つデータを取得します。 */
    before?: string;
    /**このパラメータに指定した値より大きい id を持つデータを取得します。 */
    after?: string;
}
export interface ExecutionResponse {
    id: number;
    /** この約定を発生させた注文（テイカー）の売買種別です。 板寄せによって約定した場合等、空文字列になることがあります。 */
    side: string;
    price: number;
    sizez: number;
    exec_date: string;
    buy_child_order_acceptance_id: string;
    sell_child_order_acceptance_id: string;
}
