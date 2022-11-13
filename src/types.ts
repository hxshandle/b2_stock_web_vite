type DailyPrice = {
  ts_code:    string;
  trade_date: string;
  open:       number;
  high:       number;
  low:        number;
  close:      number;
  pre_close:  number;
  change:     number;
  pct_chg:    number;
  vol:        number;
  amount:     number;
  date:       number;
}

type Stock = {
    CDL_DOJISTAR: number;
    CDL_HAMMER: number;
    CDL_INVERTEDHAMMER: number;
    amount: number;
    area?: null;
    b2_star: number;
    change: number;
    close: number;
    date: string;
    high: number;
    industry?: null;
    list_date: string;
    list_status: string;
    low: number;
    market: string;
    name: string;
    open: number;
    pct_chg: number;
    pre_close: number;
    price_chg_3: number;
    price_gap_pec: number;
    symbol: string;
    trade_date: string;
    trend_3: number;
    ts_code: string;
    vol: number;
    zlkp: number;
    zlkp_desc: string;
}

export {DailyPrice, Stock}