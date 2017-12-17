/// <reference types="request-promise-native" />
import * as rp from 'request-promise-native';
export declare class Bitflyer {
    private key;
    private secret;
    constructor(key?: string | {
        key: string;
        secret: string;
    }, secret?: string);
    set_credentials(key?: string | {
        key: string;
        secret: string;
    }, secret?: string): void;
    private send_public_request(path, query?);
    markets(): Promise<MarketResponse[]>;
    boards(product_code?: string): Promise<BoardResponse>;
    ticker(product_code?: string): Promise<TickerResponse>;
    executions(product_code?: string, option?: PageFormat): rp.RequestPromise;
    board_state(product_code?: string): Promise<BoardStatusResponse>;
    health(product_code?: string): Promise<HealthResponse>;
    chats(option?: {
        from_date: string;
    }): Promise<ChatResponse[]>;
    private send_private_request(p, query?);
    permissions(): Promise<string[]>;
    balance(): Promise<BalanceResponse[]>;
    collateral(): Promise<CollateralResponse>;
    collateral_accounts(): Promise<CollateralAccountResponse[]>;
    addresses(): Promise<AddressResponse[]>;
    coinins(option: PageFormat): Promise<CoininResponse[]>;
    coinouts(option: PageFormat): Promise<CoinoutResponse[]>;
    bank_accounts(): Promise<BankAccountResponse[]>;
    deposits(): Promise<DepositResponse[]>;
    withdraw(option: WithdrawRequest): Promise<WithdrawResponse>;
    withdrawals(option: WithdrawalRequest): Promise<WithdrawalResponse[]>;
    send_child_order(option: ChildOrderRequest): Promise<ChildOrderResponse>;
    cancel_child_order(option: CancelChildOrderRequest): Promise<void>;
    send_parent_order(option: ParentOrderRequest): Promise<ParentOrderResponse>;
    cancel_parent_order(option: CancelParentOrderRequest): Promise<void>;
    cancel_all_child_orders(option: CancelAllChildOrderRequest): Promise<void>;
    child_orders(option: GetChildOrderRequest): Promise<GetChildOrderResponse[]>;
    parent_orders(option: GetParentOrderRequest): Promise<GetParentOrderResponse[]>;
    parent_order(option: GetParentOrderDetailRequest): Promise<GetParentOrderDetailResponse>;
    get_executions(option: GetExecutionRequest): Promise<GetExecutionResponse[]>;
    get_positions(option: GetPositionRequest): Promise<GetPositionResponse[]>;
    get_collateral_history(option: PageFormat): Promise<CollateralHistoryResponse[]>;
    get_trading_commission(option: GetTradingCommissionRequest): Promise<GetTradingCommissionResponse>;
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
export interface BoardStatusResponse {
    health: 'NORMAL' | 'BUSY' | 'VERY_BUSY' | 'SUPER_BUSY' | 'NO_ORDER' | 'STOP';
    state: 'RUNNING' | 'CLOSED' | 'STARTING' | 'PREOPEN' | 'CIRCUIT BREAK' | 'AWAITING SQ' | 'MATURED';
    data?: {
        special_quotation: number;
    };
}
export interface HealthResponse {
    status: 'NORMAL' | 'BUSY' | 'VERY_BUSY' | 'SUPER_BUSY' | 'NO_ORDER' | 'STOP';
}
export interface ChatResponse {
    nickname: string;
    message: string;
    date: string;
}
export interface BalanceResponse {
    currency_code: string;
    amount: number;
    available: number;
}
export interface CollateralResponse {
    /**預け入れた証拠金の評価額（円）です。 */
    collateral: number;
    /**建玉の評価損益（円）です。 */
    open_position_pnl: number;
    /**現在の必要証拠金（円）です。 */
    require_collateral: number;
    /**現在の証拠金維持率です。 */
    keep_rate: number;
}
export interface CollateralAccountResponse {
    currency_code: string;
    amount: number;
}
export interface AddressResponse {
    type: string;
    currency_code: string;
    address: string;
}
export interface CoininResponse {
    id: number;
    order_id: string;
    currency_code: string;
    amount: number;
    address: string;
    tx_hash: string;
    status: 'PENDING' | 'COMPLETED';
    event_date: string;
}
export interface CoinoutResponse {
    id: number;
    order_id: string;
    currency_code: string;
    amount: number;
    address: string;
    tx_hash: string;
    fee: number;
    additional_fee: number;
    status: 'PENDING' | 'COMPLETED';
    event_date: string;
}
export interface BankAccountResponse {
    id: number;
    is_verified: boolean;
    bank_name: string;
    branch_name: string;
    account_type: string;
    account_number: string;
    account_name: string;
}
export interface DepositResponse {
    id: number;
    order_id: string;
    currency_code: string;
    amount: number;
    status: 'PENDING' | 'COMPLETED';
    event_date: string;
}
export interface WithdrawRequest {
    /**必須。現在は "JPY" のみ対応しています。 */
    currency_code: string;
    /**必須。出金先の口座の id を指定します。 */
    bank_account_id: number;
    /**必須。出金する数量です。 */
    amount: number;
    /**二段階認証の確認コードです。出金時の二段階認証を設定している場合のみ必要となります。 二段階認証の項を参照してください。 */
    code?: string;
}
export interface WithdrawResponse {
    message_id: string;
}
export interface WithdrawalRequest extends PageFormat {
    message_id?: string;
}
export interface WithdrawalResponse {
    id: number;
    order_id: string;
    currency_code: string;
    amount: number;
    status: 'PENDING' | 'COMPLETED';
    event_date: string;
}
export interface ChildOrderRequest {
    product_code: string;
    child_order_type: 'LIMIT' | 'MARKET';
    side: 'BUY' | 'SELL';
    price?: number;
    size: number;
    minute_to_expire?: number;
    time_in_force?: 'GTC' | 'IOC' | 'FOK';
}
export interface ChildOrderResponse {
    child_order_acceptance_id: string;
}
export interface CancelChildOrderRequest {
    /**必須。対象の注文のプロダクトです。マーケットの一覧で取得できる product_code または alias のいずれかを指定してください。 */
    product_code: string;
    /**child_order_id または child_order_acceptance_id のどちらか片方のみを指定してください。
     * child_order_id: キャンセルする注文の ID です。 */
    child_order_id?: string;
    /**child_order_id または child_order_acceptance_id のどちらか片方のみを指定してください。
     * child_order_acceptance_id: 新規注文を出す API の受付 ID です。指定された場合、対応する注文をキャンセルします。
     */
    child_order_acceptance_id?: string;
}
export interface ParentOrderRequest {
    /**注文方法です。以下の値のいずれかを指定してください。省略した場合の値は "SIMPLE" です。
     * "SIMPLE": 1 つの注文を出す特殊注文です。
     * "IFD": IFD 注文を行います。一度に 2 つの注文を出し、最初の注文が約定したら 2 つめの注文が自動的に発注される注文方法です。
     * "OCO": OCO 注文を行います。2 つの注文を同時に出し、一方の注文が成立した際にもう一方の注文が自動的にキャンセルされる注文方法です。
     * "IFDOCO": IFD-OCO 注文を行います。最初の注文が約定した後に自動的に OCO 注文が発注される注文方法です。 */
    order_method?: 'SIMPLE' | 'IFD' | 'OCO' | 'IFDOCO';
    /**期限切れまでの時間を分で指定します。省略した場合の値は 43200 (30 日間) です。 */
    minute_to_expire?: number;
    /**執行数量条件 を "GTC", "IOC", "FOK" のいずれかで指定します。省略した場合の値は "GTC" です。 */
    time_in_force?: 'GTC' | 'IOC' | 'FOK';
    /**必須。発注する注文のパラメータを指定する配列です。 指定した order_method の値によって、必要な配列の長さが異なります。
     * "SIMPLE" の場合、1 つのパラメータを指定します。
     * "IFD" の場合、2 つ指定します。 1 つめのパラメータが、最初に発注される注文のパラメータです。 2 つめは、最初の注文の約定後に発注される注文のパラメータになります。
     * "OCO" の場合、2 つ指定します。 パラメータをもとに 2 つの注文が同時に出されます。
     * "IFDOCO" の場合、3 つ指定します。 1 つめのパラメータが、最初に発注される注文のパラメータです。 その注文が約定した後、2 つめと 3 つめのパラメータをもとに OCO 注文が出されます。 */
    parameters: {
        product_code: string;
        /**必須。注文の執行条件です。以下の値のうちいずれかを指定してください。
         * "LIMIT": 指値注文。
         * "MARKET" 成行注文。
         * "STOP": ストップ注文。
         * "STOP_LIMIT": ストップ・リミット注文。
         * "TRAIL": トレーリング・ストップ注文。 */
        condition_type: 'LIMIT' | 'MARKET' | 'STOP' | 'STOP_LIMIT' | 'TRAIL';
        side: 'BUY' | 'SELL';
        size: number;
        price?: number;
        trigger_price?: number;
        offset?: number;
    }[];
}
export interface ParentOrderResponse {
    parent_order_acceptance_id: string;
}
export interface CancelParentOrderRequest {
    /**必須。対象の注文のプロダクトです。マーケットの一覧で取得できる product_code または alias のいずれかを指定してください。
     * parent_order_id または parent_order_acceptance_id のどちらか片方のみを指定してください。 */
    product_code: string;
    /** キャンセルする親注文の ID です。 */
    parent_order_id?: string;
    /**新規の親注文を出す API の受付 ID です。指定された場合、対応する親注文をキャンセルします。 */
    parent_order_acceptance_id: string;
}
export interface CancelAllChildOrderRequest {
    /**必須。対象の注文のプロダクトです。マーケットの一覧で取得できる product_code または alias のいずれかを指定してください。 */
    roduct_code: string;
}
export interface GetChildOrderRequest extends PageFormat {
    product_code?: string;
    child_order_state?: 'ACTIVE' | 'COMPLETED' | 'CANCELED' | 'EXPIRED' | 'REJECTED';
    child_order_id?: string;
    child_order_acceptance_id?: string;
    parent_order_id?: string;
}
export interface GetChildOrderResponse {
    id: number;
    child_order_id: string;
    product_code: string;
    side: 'BUY' | 'SELL';
    child_order_type: string;
    price: number;
    average_price: number;
    size: number;
    child_order_state: string;
    expire_date: string;
    child_order_date: string;
    child_order_acceptance_id: string;
    outstanding_size: number;
    cancel_size: number;
    executed_size: number;
    total_commission: number;
}
export interface GetParentOrderRequest extends PageFormat {
    product_code: string;
    parent_order_state?: 'ACTIVE' | 'COMPLETED' | 'CANCELED' | 'EXPIRED' | 'REJECTED';
}
export interface GetParentOrderResponse {
    id: number;
    parent_order_id: string;
    product_code: string;
    side: 'BUY' | 'SELL';
    parent_order_type: string;
    price: number;
    average_price: number;
    size: string;
    parent_order_state: string;
    expire_date: string;
    parent_order_date: string;
    parent_order_acceptance_id: string;
    outstanding_size: number;
    cancel_size: number;
    executed_size: number;
    total_commission: number;
}
export interface GetParentOrderDetailRequest {
    parent_order_id?: string;
    parent_order_acceptance_id?: string;
}
export interface GetParentOrderDetailResponse {
    id: number;
    parent_order_id: string;
    order_method?: 'SIMPLE' | 'IFD' | 'OCO' | 'IFDOCO';
    minute_to_expire?: number;
    parameters: {
        product_code: string;
        /**必須。注文の執行条件です。以下の値のうちいずれかを指定してください。
         * "LIMIT": 指値注文。
         * "MARKET" 成行注文。
         * "STOP": ストップ注文。
         * "STOP_LIMIT": ストップ・リミット注文。
         * "TRAIL": トレーリング・ストップ注文。 */
        condition_type: 'LIMIT' | 'MARKET' | 'STOP' | 'STOP_LIMIT' | 'TRAIL';
        side: 'BUY' | 'SELL';
        size: number;
        price?: number;
        trigger_price?: number;
        offset?: number;
    }[];
    parent_order_acceptance_id: string;
}
export interface GetExecutionRequest extends PageFormat {
    product_code: string;
    child_order_id?: string;
    child_order_acceptance_id?: string;
}
export interface GetExecutionResponse {
    id: number;
    child_order_id: string;
    side: 'BUY' | 'SELL';
    price: number;
    size: number;
    commission: number;
    exec_date: string;
    child_order_acceptance_id: string;
}
export interface GetPositionRequest {
    product_code: 'FX_BTC_JPY';
}
export interface GetPositionResponse {
    product_code: "FX_BTC_JPY";
    side: "BUY" | 'SELL';
    price: number;
    size: number;
    commission: number;
    swap_point_accumulate: number;
    require_collateral: number;
    open_date: string;
    leverage: number;
    pnl: number;
}
export interface CollateralHistoryResponse {
    id: number;
    currency_code: string;
    change: number;
    amount: number;
    reason_code: string;
    date: string;
}
export interface GetTradingCommissionRequest {
    product_code: string;
}
export interface GetTradingCommissionResponse {
    commission_rate: number;
}
