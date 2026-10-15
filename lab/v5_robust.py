"""Robustness of the v5.0 candidate: SMA trend entry vetoed by the equal-weight macro score.
Neighbouring parameters, per year and per asset. Daily, long-only."""
import warnings
import pandas as pd
import backtest as bt
import engine as en
import setups as su
from v5_research import ASSETS, build_daily, sharpe
warnings.filterwarnings("ignore")

def macro_score(chart, inputs, a, threshold=0.5):
    cfg = en.Config(chart_tf="1d", ltf_adaptive=False, adaptive=False, threshold=threshold, weighting="equal",
                    smoothing=1, group_mult=su.group_mult(a))
    return en.run(chart, [i for i in inputs if i.group == "macro"], cfg)["score"]

def run(chart, score, n, veto):
    c = chart["close"]; ma = c.rolling(n).mean(); up = c > ma
    ok = up & (score.reindex(c.index).fillna(0) > veto) if veto is not None else up
    return ok & ~ok.shift(1, fill_value=False), c < ma

inputs = build_daily()
rows = []
for a in ASSETS:
    chart = su.chart(a, "1d")
    for th in (0.3, 0.5, 0.8):
        s = macro_score(chart, inputs, a, th)
        for n in (30, 40, 50, 60, 75):
            for veto in (None, -0.1, -0.2, -0.3, -0.4):
                e, x = run(chart, s, n, veto)
                for y in range(2019, 2027):
                    r = bt.simulate(chart, e, x, start=f"{y}-01-01", end=f"{y+1}-01-01")
                    rows.append(dict(asset=a, th=th, n=n, veto=str(veto), year=y, sharpe=sharpe(r["equity"]), ret=r["return"], dd=r["max_dd"]))
                r = bt.simulate(chart, e, x, start="2019-01-01")
                rows.append(dict(asset=a, th=th, n=n, veto=str(veto), year="all", sharpe=sharpe(r["equity"]), ret=r["return"], dd=r["max_dd"]))
df = pd.DataFrame(rows); df.to_pickle("data/v5_robust.pkl")
pd.set_option("display.width", 250)
full = df[df.year == "all"]
print("Full-period Sharpe, mean over assets  (rows: SMA n, cols: veto) - threshold 0.5")
print(full[full.th == 0.5].pivot_table(index="n", columns="veto", values="sharpe").round(2).to_string())
print("\nsame, threshold 0.3 / 0.8")
for th in (0.3, 0.8):
    print(full[full.th == th].pivot_table(index="n", columns="veto", values="sharpe").round(2).to_string())
yr = df[(df.year != "all") & (df.th == 0.5) & (df.n == 50)]
print("\nSMA50, th 0.5: return by year (mean of assets), none vs veto -0.2")
print(yr[yr.veto.isin(["None", "-0.2"])].pivot_table(index="year", columns="veto", values="ret").round(3).to_string())
print("\nper asset full period, SMA50 th0.5:")
f = full[(full.th == 0.5) & (full.n == 50) & full.veto.isin(["None", "-0.2"])]
print(f.pivot_table(index="asset", columns="veto", values=["ret", "sharpe", "dd"]).round(2).to_string())
