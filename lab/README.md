# Capital Flow Test Lab

A Python replica of the Capital Flow Filter engine, for testing ideas quickly and honestly before they go into the Pine script. TradingView stays the final check: anything that wins here must reproduce in the TradingView Strategy Tester before it ships.

## Setup

```bash
cd lab
python3 -m venv .venv
.venv/bin/pip install pandas numpy yfinance requests
.venv/bin/python -W ignore run_baseline.py
```

Data is downloaded once and cached in `lab/data/`, which git ignores:
- **Crypto:** Binance spot klines via the public `data-api.binance.vision` mirror. No key needed.
- **Macro:** Yahoo Finance via `yfinance`. Full daily history, but only about 730 days of hourly bars.
- **FRED:** CSV endpoint, no key needed. Used for liquidity series such as WALCL.

## Files

| File | What it does |
|---|---|
| `data.py` | Loaders, caching, resampling to TradingView-style UTC bars |
| `engine.py` | v4.6 engine replica (flow, signals, accuracy weighting, score, confirmed flips) plus research switches |
| `setups.py` | Builds the inputs: `intraday` (15m/1h/4h crypto, 1h/1h/4h macro) and `swing` (4h/1d/1w crypto, 1d/1d/1w macro) |
| `backtest.py` | Long-only simulator with next-bar-open fills, 0.05% fees and slippage, 95% sizing, and entry/exit rules |
| `run_baseline.py` | Reproduces v4.6 results and runs the long-history test |

## Rules that keep it honest

- **No look-ahead.** A higher-timeframe value is only used once its bar has closed before the chart bar opens. Orders fill at the next bar's open.
- **Fees on every trade:** 0.05% per side, plus about 1bp of slippage.
- **Fixed held-out period.** Tune on the training years only, then test once on years the tuning never touched.
- **Several assets and regimes.** Results must hold on BTC, ETH and SOL, and through the 2022 bear market, not just one chart.

## Known differences from TradingView

- **BTC.D and TOTAL3** are approximated from a basket of Binance alts (BNB, XRP, ADA, LTC, SOL).
- **Macro symbols differ:** Yahoo's DX-Y.NYB, ^VIX, GC=F and ^TNX replace TVC/OANDA, and bar times are approximate.
- **Intraday 15m macro** is replaced by 1h, and intraday history starts around Oct 2024 because of Yahoo's hourly limit.

## Matching TradingView (2026-10-14)

`compare_tv.py` compares the lab with a "Download chart data" export of `cf-lab-export.pine`
(v4.6 with per-input `Sig` columns). Over the last 700 4H bars:

- BTC / ETH: same sign on ~91% of bars (corr 0.97-0.98)
- BTC.D / TOTAL3 market-cap proxies: 99% / 87-89% exact (the old equal-weight proxies fired ~15x too often)
- Macro (DXY, VIX, Gold, US10Y): 1H and 4H flows match TradingView. The 15m reading is volatility-scaled
  on TradingView: `calcFlowOffset` reads the timeframe-dependent global `adaptiveThreshold`, which Pine
  re-evaluates in the requested 15m context ("Scalp"). `engine.Config.ltf_adaptive` mirrors this (on by
  default) and lifts BTC/ETH agreement from 62-74% to ~94% exact. Feeding TradingView's own per-input
  signals into the lab's scoring reproduces TradingView's Score exactly, so the remaining gaps are data
  (Yahoo VIX / ^TNX hourly vs TVC).

### TradingView: how much the backtest depends on that quirk (3H, Long only + Standard, from 2024-01-01)

| Flow rule | Result |
|---|---|
| v4.6.0 as written | +47%, 19 trades, PF 2.35 |
| 15m-and-below adaptive (explicit) | +19%, 15 trades |
| below-chart-TF adaptive (explicit) | +19%, 15 trades |
| none adaptive | +1%, 14 trades |
| all adaptive | -6%, 26 trades |
| never read below chart TF | +18%, 55 trades (1H: +80% vs +58%, 4H: +17% vs +125%) |

No explicit rule reproduces v4.6.0, so the in-context evaluation does more than "15m is adaptive".
The 3H/4H edge depends on it and should be treated as fragile. `ltf-probe*.pine` are the probes used
(probes with many requests never rendered values).
