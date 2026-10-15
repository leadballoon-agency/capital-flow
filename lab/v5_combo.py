"""v5.0: does capital flow improve a plain trend rule? (daily, long-only, BTC/ETH/SOL)

Trend: close vs SMA(n). Capital flow is tested as an entry gate, an extra exit, or a veto,
with a few fixed, simple engine settings (no per-asset tuning). Train 2019-2022, test 2023-2026.
"""
import warnings

import pandas as pd

import backtest as bt
import engine as en
import setups as su
from v5_research import ASSETS, TEST, TRAIN, build_daily, sharpe

warnings.filterwarnings("ignore")

ENGINES = {
    "simple": dict(adaptive=False, threshold=0.5, weighting="equal", smoothing=1),
    "v4.6-style": dict(adaptive=False, threshold=0.5, weighting="same_bar", sign_flip="hard", lookback=50, smoothing=1),
    "adaptive": dict(adaptive=True, adaptive_level=0.5, weighting="equal", smoothing=1),
}
MACRO_ONLY = ("dxy", "vix", "gold", "yields")


def score_variants(chart, inputs, a, eng_kw):
    cfg = en.Config(chart_tf="1d", ltf_adaptive=False, group_mult=su.group_mult(a), **eng_kw)
    full = en.run(chart, inputs, cfg)["score"]
    macro = en.run(chart, [i for i in inputs if i.name in MACRO_ONLY], cfg)["score"]
    return {"all8": full, "macro4": macro}


def rules(chart, score, n=50):
    c = chart["close"]
    ma = c.rolling(n).mean()
    up, dn = c > ma, c < ma
    s = score.reindex(c.index).fillna(0)
    def edge(x):
        return x & ~x.shift(1, fill_value=False)
    return {
        f"SMA{n}": (edge(up), dn),
        f"SMA{n} & score>0": (edge(up & (s > 0)), dn),
        f"SMA{n} & score>-0.2 (veto)": (edge(up & (s > -0.2)), dn),
        f"SMA{n}, exit also score<-0.3": (edge(up & (s > -0.3)), dn | (s < -0.3)),
        f"SMA{n} & score>0, exit either": (edge(up & (s > 0)), dn | (s < 0)),
    }


def main():
    inputs = build_daily()
    rows = []
    for a in ASSETS:
        chart = su.chart(a, "1d")
        for ename, kw in ENGINES.items():
            for sname, score in score_variants(chart, inputs, a, kw).items():
                for n in (50, 100):
                    for rname, (enter, ex) in rules(chart, score, n).items():
                        for split, (s, e) in [("train", TRAIN), ("test", TEST)]:
                            r = bt.simulate(chart, enter, ex, start=s, end=e)
                            rows.append({"engine": ename, "score": sname, "rule": rname, "asset": a, "split": split,
                                         "sharpe": sharpe(r["equity"]), "ret": r["return"], "dd": r["max_dd"],
                                         "trades": r["trades"]})
    df = pd.DataFrame(rows)
    df.to_pickle("data/v5_combo.pkl")
    g = df.groupby(["engine", "score", "rule", "split"]).agg(min_sh=("sharpe", "min"), mean_sh=("sharpe", "mean"),
                                                              mean_dd=("dd", "mean"), trades=("trades", "mean"))
    t = g.unstack("split")
    t.columns = [f"{a}_{b}" for a, b in t.columns]
    t = t.sort_values("min_sh_test", ascending=False)
    pd.set_option("display.width", 250)
    print(t.round(2).to_string())


if __name__ == "__main__":
    main()
