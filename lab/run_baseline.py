"""Baseline: reproduce v4.6 in the lab.

1. Intraday replica on BTC 1H/3H/4H (Oct 2024 onward - limited by hourly macro history)
2. Swing (daily) on BTC/ETH/SOL from 2018 - includes the 2022 bear market, split by year

Usage:  .venv/bin/python -W ignore run_baseline.py
"""
import warnings

import pandas as pd

import backtest as bt
import engine as en
import setups as su

warnings.filterwarnings("ignore")

INTRADAY = {"1h": (200, 2), "3h": (100, 2), "4h": (100, 2)}   # lookback, smoothing (v4.6 Auto)


def engine_for(chart_tf, setup, symbol="BTCUSDT", macro_15m=False, clamp=False, **overrides):
    chart = su.chart(symbol, chart_tf)
    inputs = su.build(setup, macro_15m, clamp_to=chart_tf if clamp else None)
    if setup == "intraday":
        lb, sm = INTRADAY[chart_tf]
    else:
        lb, sm = 50, 1
    cfg = en.Config(chart_tf=chart_tf, lookback=lb, smoothing=sm, group_mult=su.group_mult(symbol))
    for k, v in overrides.items():
        setattr(cfg, k, v)
    return chart, en.run(chart, inputs, cfg)


def report(title, chart, eng, start, end=None):
    print(f"\n{title}")
    for name, rule in [("flip+50% (v4.6 strat)", bt.rule_flip_strength(eng)),
                       ("regime cross 50/-20  ", bt.rule_regime_cross(eng))]:
        r = bt.simulate(chart, *rule, start=start, end=end)
        print(f"  {name}  {bt.fmt(r)}")


if __name__ == "__main__":
    start = "2024-07-01"
    for tf in ["1h", "3h", "4h"]:
        chart, eng = engine_for(tf, "intraday")
        report(f"INTRADAY replica  BTC {tf}  from {start}", chart, eng, start)

    for sym in ["BTCUSDT", "ETHUSDT", "SOLUSDT"]:
        chart, eng = engine_for("1d", "swing", sym)
        report(f"SWING daily  {sym}  2019-2026", chart, eng, "2019-01-01")
        for y in range(2019, 2027):
            st, ed = f"{y}-01-01", f"{y+1}-01-01"
            if chart.index[-1] < pd.Timestamp(st, tz="UTC"):
                continue
            r = bt.simulate(chart, *bt.rule_regime_cross(eng), start=st, end=ed)
            print(f"    {y} regime-cross  {bt.fmt(r)}")
