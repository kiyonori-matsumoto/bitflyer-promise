import * as rp from 'request-promise-native';
import * as crypto from 'crypto';
import * as qs from 'querystring';

const AsyncLock = require('async-lock');

const lock = new AsyncLock();

export class Bitflyer {
  private key: string;
  private secret: string;

  constructor(key?: string | {key: string, secret: string}, secret: string = '') {
    this.set_credentials(key, secret);
  }
    
  public set_credentials(key?: string | {key: string, secret: string}, secret: string = '') {
    if (!key && !secret) {
      this.key = process.env.BITFLYER_KEY || '';
      this.secret = process.env.BITFLYER_SECRET || '';
    } else if (typeof key === 'string') {
      this.key = key;
      this.secret = secret;
    } else {
      this.key = key ? key.key : '';
      this.secret = key ? key.secret: '';
    }
  }

  private send_public_request(path: string, query?: any) {
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

  public markets(): Promise<MarketResponse[]> {
    return this.send_public_request('markets');
  }

  public boards(product_code: string = 'BTC_JPY'): Promise<BoardResponse> {
    return this.send_public_request('board', {product_code});
  }

  public ticker(product_code: string = 'BTC_JPY'): Promise<TickerResponse> {
    return this.send_public_request('board', {product_code});
  }

  public executions(
    product_code: string = 'BTC_JPY',
    option?: PageFormat
  ) {
    return this.send_public_request('executions', )
  }

  public board_state(product_code: string = 'BTC_JPY'): Promise<BoardStatusResponse> {
    return this.send_public_request('getboardstate', {product_code})
  }

  public health(product_code: string = 'BTC_JPY'): Promise<HealthResponse> {
    return this.send_public_request('gethealth', {product_code});
  }

  public chats(option?: {from_date: string}): Promise<ChatResponse[]> {
    return this.send_public_request('getchats', option);
  }

  private send_private_request(p: string, query?: any) {
    if(!this.key || !this.secret) {
      return Promise.reject(new Error('private method needs key and secret'));
    }
    const timestamp = Date.now().toString();
    const method = (/^get/.test(p)) ? 'GET' : 'POST';
    const query_str = (query && method === 'GET') ? `?${qs.stringify(query)}` : ''
    const path = `/v1/me/${p}${query_str}`;
    const body = (query && method === 'POST') ? JSON.stringify(query): "";
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
    if(body && body !== "") {
      options.body = body;
    }
    return lock.acquire(this.key, () => 
      rp(options).then(data => JSON.parse(data))
    )
  }

  public permissions(): Promise<string[]> {
    return this.send_private_request('getpermissions');
  }

  public balance(): Promise<BalanceResponse[]> {
    return this.send_private_request('getbalance');
  }

  public collateral(): Promise<CollateralResponse> {
    return this.send_private_request('getcollateral');
  }

  public collateral_accounts(): Promise<CollateralAccountResponse[]> {
    return this.send_private_request('getcollateralaccounts');
  }

  public addresses(): Promise<AddressResponse[]> {
    return this.send_private_request('getaddresses');
  }

  public coinins(option: PageFormat): Promise<CoininResponse[]> {
    return this.send_private_request('getcoinins', option);
  }

  public coinouts(option: PageFormat): Promise<CoinoutResponse[]> {
    return this.send_private_request('getcoinouts', option);
  }

  public bank_accounts(): Promise<BankAccountResponse[]> {
    return this.send_private_request('getbankaccounts');
  }

  public deposits(): Promise<DepositResponse[]> {
    return this.send_private_request('getdeposits');
  }

  public withdraw(option: WithdrawRequest): Promise<WithdrawResponse> {
    return this.send_private_request('withdraw', option); 
  }

  public withdrawals(option: WithdrawalRequest): Promise<WithdrawalResponse[]> {
    return this.send_private_request('getwithdrawals', option);
  }

  public send_child_order(option: ChildOrderRequest): Promise<ChildOrderResponse> {
    return this.send_private_request('sendchildorder',  option);
  }

  public cancel_child_order(option: CancelChildOrderRequest): Promise<void> {
    return this.send_private_request('cancelchildorder', option);
  }

  public send_parent_order(option: ParentOrderRequest): Promise<ParentOrderResponse> {
    return this.send_private_request('sendparentorder', option);
  }

  public cancel_parent_order(option: CancelParentOrderRequest): Promise<void> {
    return this.send_private_request('cancelparentorder', option);
  }

  public cancel_all_child_orders(option: CancelAllChildOrderRequest): Promise<void> {
    return this.send_private_request('cancelallchildorders', option);
  }

  public child_orders(option: GetChildOrderRequest): Promise<GetChildOrderResponse[]> {
    return this.send_private_request('getchildorders', option);
  }

  public parent_orders(option: GetParentOrderRequest): Promise<GetParentOrderResponse[]> {
    return this.send_private_request('getparentorders', option);
  }

  public parent_order(option: GetParentOrderDetailRequest): Promise<GetParentOrderDetailResponse> {
    return this.send_private_request('getparentorder', option);
  }

  public get_executions(option: GetExecutionRequest): Promise<GetExecutionResponse[]> {
    return this.send_private_request('getexecutions', option);
  }

  public get_positions(option: GetPositionRequest): Promise<GetPositionResponse[]> {
    return this.send_private_request('getpositions', option);
  }

  public get_collateral_history(option: PageFormat): Promise<CollateralHistoryResponse[]> {
    return this.send_private_request('getcollateralhistory', option);
  }

  public get_trading_commission(option: GetTradingCommissionRequest): Promise<GetTradingCommissionResponse> {
    return this.send_private_request('gettradingcommission', option);
  }

}

export interface MarketResponse {
  product_code: string;
  alias?: string;
}

export interface BoardResponse {
  mid_price: number;
  bids: {price: number, size: number}[];
  asks: {price: number, size: number}[];
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
  health: 'NORMAL'|'BUSY'|'VERY_BUSY'|'SUPER_BUSY'|'NO_ORDER'|'STOP';
  state: 'RUNNING'| // 通常稼働中
         'CLOSED'| // 取引停止中
         'STARTING'| // 再起動中
         'PREOPEN'| // 板寄せ中
         'CIRCUIT BREAK'| // サーキットブレイク発動中
         'AWAITING SQ'| // Lightning Futures の取引終了後 SQ（清算値）の確定前
         'MATURED'; // Lightning Futures の満期に到達
  data?: {special_quotation: number};
}

export interface HealthResponse {
  status: 'NORMAL'|'BUSY'|'VERY_BUSY'|'SUPER_BUSY'|'NO_ORDER'|'STOP'
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
  status: 'PENDING'|'COMPLETED';
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
  status: 'PENDING'|'COMPLETED';
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
  status: 'PENDING'|'COMPLETED';
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
  status: 'PENDING'|'COMPLETED';
  event_date: string;
}

export interface ChildOrderRequest {
  product_code: string;
  child_order_type: 'LIMIT'|'MARKET';
  side: 'BUY'|'SELL';
  price?: number;
  size: number;
  minute_to_expire?: number;
  time_in_force?: 'GTC'|'IOC'|'FOK';
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
  order_method?: 'SIMPLE'|'IFD'|'OCO'|'IFDOCO';
  /**期限切れまでの時間を分で指定します。省略した場合の値は 43200 (30 日間) です。 */
  minute_to_expire?: number;
  /**執行数量条件 を "GTC", "IOC", "FOK" のいずれかで指定します。省略した場合の値は "GTC" です。 */
  time_in_force?:'GTC'|'IOC'|'FOK';
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
    condition_type: 'LIMIT'|'MARKET'|'STOP'|'STOP_LIMIT'|'TRAIL';
    
    side: 'BUY'|'SELL';
    size: number;
    price?: number;
    trigger_price?: number;
    offset?: number;
  }[]
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
  product_code?:string; /// マーケットの一覧で取得できる product_code または alias のいずれかを指定してください。 省略した場合の値は BTC_JPY です。
  child_order_state?: /// 指定された場合、child_order_state がその値に一致する注文のみを返します。 指定されない場合、 ACTIVE な注文とそうでない注文の一覧を連結したものを返します。
  ///次のいずれかを指定します。
  'ACTIVE'| /// オープンな注文の一覧を取得します。
  'COMPLETED'| /// 全額が取引完了した注文の一覧を取得します。
  'CANCELED'| /// お客様がキャンセルした注文です。
  'EXPIRED'| /// 有効期限に到達したため取り消された注文の一覧を取得します。
  'REJECTED' /// 失敗した注文です。
  child_order_id?:string; 
  child_order_acceptance_id?: string; ///指定した ID に一致する注文を取得できます。
  parent_order_id?: string;/// 指定された場合、その親注文に関連付けられている注文の一覧を取得します。
}

export interface GetChildOrderResponse {
  id: number;
  child_order_id: string;
  product_code: string;
  side: 'BUY'|'SELL';
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
  product_code: string;/// マーケットの一覧で取得できる product_code または alias のいずれかを指定してください。
  parent_order_state?: ///指定された場合、parent_order_state がその値に一致する注文のみを返します。次のいずれかを指定します。
  'ACTIVE'| ///オープンな注文の一覧を取得します。
  'COMPLETED'| ///全額が取引完了した注文の一覧を取得します。
  'CANCELED'| ///お客様がキャンセルした注文です。
  'EXPIRED'| ///有効期限に到達したため取り消された注文の一覧を取得します。
  'REJECTED' ///失敗した注文です。
}

export interface GetParentOrderResponse {
  id: number;
  parent_order_id: string;
  product_code: string;
  side: 'BUY'|'SELL';
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
  parent_order_id?: string; ///対象の親注文の ID です。
  parent_order_acceptance_id?: string; ///新規の親注文を出す API の受付 ID です。指定された場合、対応する親注文の詳細を返します。
}

export interface GetParentOrderDetailResponse {
  id: number;
  parent_order_id: string;
  order_method?: 'SIMPLE'|'IFD'|'OCO'|'IFDOCO';
  minute_to_expire?: number;
  parameters: {
    product_code: string;
    /**必須。注文の執行条件です。以下の値のうちいずれかを指定してください。
     * "LIMIT": 指値注文。
     * "MARKET" 成行注文。
     * "STOP": ストップ注文。
     * "STOP_LIMIT": ストップ・リミット注文。
     * "TRAIL": トレーリング・ストップ注文。 */
    condition_type: 'LIMIT'|'MARKET'|'STOP'|'STOP_LIMIT'|'TRAIL';
    
    side: 'BUY'|'SELL';
    size: number;
    price?: number;
    trigger_price?: number;
    offset?: number;
  }[];
  parent_order_acceptance_id: string;
}

export interface GetExecutionRequest extends PageFormat {
  product_code: string; ///マーケットの一覧で取得できる product_code または alias のいずれかを指定してください。
  child_order_id?: string; ///省略可能。指定された場合、その注文に関連する約定の一覧を取得します。
  child_order_acceptance_id?: string; ///省略可能。新規注文を出す API の受付 ID です。指定された場合、対応する注文に関連する約定の一覧を取得します。
}

export interface GetExecutionResponse {
  id: number; // 37233,
  child_order_id: string; // "JOR20150707-060559-021935",
  side: 'BUY'|'SELL'; // "BUY",
  price: number; // 33470,
  size: number; // 0.01,
  commission: number; // 0,
  exec_date: string; // "2015-07-07T09:57:40.397",
  child_order_acceptance_id: string;// "JRF20150707-060559-396699"
}

export interface GetPositionRequest {
  product_code: 'FX_BTC_JPY';
}

export interface GetPositionResponse {
  product_code: "FX_BTC_JPY";
  side: "BUY"|'SELL';
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
