"""Baselines v5.0 must beat: buy-and-hold and plain price-trend filters (daily, long-only).

If capital flow can't beat "own price above its 50-day average", it isn't adding information.
"""
import warnings

import numpy as np
import pandas as pd

import backtest as bt
import engine as en
import setups as su
from v5_research import ASSETS, TEST, TRAIN, sharpe

warnings.filterwarnings("ignore")


def trend_rules(chart):
    c = chart["close"]
    out = {}
    for n in (20, 50, 100, 200):
        ma = c.rolling(n).mean()
        out[f"close>SMA{n}"] = (c > ma, c < ma)
    f = en.flow(c, 14, False)
    out["own flow>0"] = (f > 0, f < 0)
    return out


def main():
    rows = []
    for a in ASSETS:
        chart = su.chart(a, "1d")
        for name, (en_, ex) in trend_rules(chart).items():
            enter = en_ & ~en_.shift(1, fill_value=False)
            for split, (s, e) in [("train", TRAIN), ("test", TEST)]:
                r = bt.simulate(chart, enter, ex, start=s, end=e)
                rows.append({"rule": name, "asset": a, "split": split, "ret": r["return"], "dd": r["max_dd"],
                             "sharpe": sharpe(r["equity"]), "trades": r["trades"]})
    df = pd.DataFrame(rows)
    piv = df.pivot_table(index="rule", columns=["split", "asset"], values="sharpe").round(2)
    print("Sharpe by rule / split / asset\n", piv.to_string())
    print("\nworst-asset Sharpe:\n", df.groupby(["rule", "split"])["sharpe"].min().unstack().round(2).to_string())


if __name__ == "__main__":
    main()
