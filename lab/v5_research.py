"""v5.0 research: explicit engine variants on DAILY bars, BTC/ETH/SOL.

Every variant reads only the chart timeframe and above (1D + 1W), and every flow is computed the
same way in every context - no lower-timeframe reads, no timeframe-dependent globals.

Train 2019-2022 (includes the 2022 bear market), test 2023-2026 (held out).
Metric: Sharpe of the daily equity curve (long-only, 0.05% fees), versus buy-and-hold.

Usage:  .venv/bin/python -W ignore v5_research.py
"""
import itertools
import warnings

import numpy as np
import pandas as pd

import backtest as bt
import engine as en
import setups as su

warnings.filterwarnings("ignore")

ASSETS = ["BTCUSDT", "ETHUSDT", "SOLUSDT"]
TRAIN = ("2019-01-01", "2023-01-01")
TEST = ("2023-01-01", None)


def build_daily() -> list[en.Input]:
    c_tfs, m_tfs = ("1d", "1w"), ("1d", "1w")
    inputs = [en.Input(n, "macro", su.macro_frames(tk, m_tfs), invert=True, tfs=m_tfs) for n, tk in su.MACRO.items()]
    inputs.append(en.Input("btc", "crypto", su.crypto_frames("BTCUSDT", c_tfs), tfs=c_tfs))
    inputs.append(en.Input("eth", "crypto", su.crypto_frames("ETHUSDT", c_tfs), tfs=c_tfs))
    btcd, total3 = su.proxy_frames("1d")
    inputs.append(en.Input("btcd", "sector", {"1d": btcd}, invert=True, tfs=("1d",)))
    inputs.append(en.Input("total3", "sector", {"1d": total3}, tfs=("1d",)))
    return inputs


def sharpe(eq: pd.Series) -> float:
    r = eq.pct_change().dropna()
    return float(r.mean() / r.std() * np.sqrt(365)) if r.std() > 0 else 0.0


def bh_equity(chart, start, end):
    c = chart["close"]
    c = c[(c.index >= pd.Timestamp(start, tz="UTC")) & ((c.index < pd.Timestamp(end, tz="UTC")) if end else True)]
    return c / c.iloc[0]


def evaluate(chart, eng, rule, start, end):
    r = bt.simulate(chart, *rule(eng), start=start, end=end)
    return {"ret": r["return"], "dd": r["max_dd"], "sharpe": sharpe(r["equity"]), "trades": r["trades"]}


RULES = {
    "regime 50/-20": lambda e: bt.rule_regime_cross(e, 0.5, 0.2),
    "regime 30/-10": lambda e: bt.rule_regime_cross(e, 0.3, 0.1),
    "regime 20/0": lambda e: bt.rule_regime_cross(e, 0.2, 0.0),
    "flip+50": lambda e: bt.rule_flip_strength(e, 0.5),
}

GRID = {
    "adaptive": [False, True],
    "level": [0.3, 0.5, 0.8],          # raw %: threshold; adaptive: multiple of typical move
    "weighting": ["equal", "same_bar", "predictive"],
    "sign_flip": ["hard", "none"],
    "smoothing": [1, 3],
    "lookback": [50, 100],
}


def main():
    inputs = build_daily()
    charts = {a: su.chart(a, "1d") for a in ASSETS}
    rows = []
    keys = list(GRID)
    for combo in itertools.product(*GRID.values()):
        p = dict(zip(keys, combo))
        if p["weighting"] == "equal" and (p["sign_flip"] != "hard" or p["lookback"] != 50):
            continue  # weighting off: sign flip / lookback irrelevant
        for a in ASSETS:
            cfg = en.Config(chart_tf="1d", flow_len=14, threshold=p["level"], adaptive=p["adaptive"],
                            adaptive_level=p["level"], lookback=p["lookback"], smoothing=p["smoothing"],
                            weighting=p["weighting"], sign_flip=p["sign_flip"], ltf_adaptive=False,
                            group_mult=su.group_mult(a))
            eng = en.run(charts[a], inputs, cfg)
            for rname, rule in RULES.items():
                for split, (s, e) in [("train", TRAIN), ("test", TEST)]:
                    m = evaluate(charts[a], eng, rule, s, e)
                    rows.append({**p, "asset": a, "rule": rname, "split": split, **m})
    df = pd.DataFrame(rows)
    df.to_pickle("data/v5_grid.pkl")

    bh = []
    for a in ASSETS:
        for split, (s, e) in [("train", TRAIN), ("test", TEST)]:
            eq = bh_equity(charts[a], s, e)
            bh.append({"asset": a, "split": split, "bh_ret": eq.iloc[-1] - 1, "bh_sharpe": sharpe(eq),
                       "bh_dd": float(((eq.cummax() - eq) / eq.cummax()).max())})
    bh = pd.DataFrame(bh)
    print(bh.to_string(index=False))

    # Rank configs on TRAIN by the worst asset's Sharpe (robustness), then show their TEST results
    cfg_cols = keys + ["rule"]
    tr = df[df.split == "train"].groupby(cfg_cols).agg(min_sharpe=("sharpe", "min"), mean_sharpe=("sharpe", "mean"),
                                                         mean_dd=("dd", "mean"), trades=("trades", "mean")).reset_index()
    te = df[df.split == "test"].groupby(cfg_cols).agg(test_min_sharpe=("sharpe", "min"), test_mean_sharpe=("sharpe", "mean"),
                                                        test_mean_dd=("dd", "mean")).reset_index()
    both = tr.merge(te, on=cfg_cols).sort_values("min_sharpe", ascending=False)
    pd.set_option("display.width", 250)
    print("\nTop 20 by TRAIN worst-asset Sharpe:")
    print(both.head(20).round(2).to_string(index=False))
    print("\nTEST rank correlation with TRAIN (all configs):",
          round(both["mean_sharpe"].corr(both["test_mean_sharpe"], method="spearman"), 2))


if __name__ == "__main__":
    main()
