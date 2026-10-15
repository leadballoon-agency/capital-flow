"""Compare the lab engine with TradingView's per-input signals (CF Lab Export CSV)."""
import sys, warnings
import numpy as np, pandas as pd
warnings.filterwarnings("ignore")
from run_baseline import engine_for

path = sys.argv[1] if len(sys.argv) > 1 else "data/tv_BTCUSDT_240_sigs.csv"
tv = pd.read_csv(path)
tv.index = pd.to_datetime(tv["time"], unit="s", utc=True)
chart, eng = engine_for("4h", "intraday", macro_15m=True)
common = tv.index.intersection(eng.index)
print(f"TV bars {len(tv)}  lab end {eng.index[-1]}  overlap {len(common)}")
t, l = tv.loc[common], eng.loc[common]
print(f"{'input':8s} {'exact':>6s} {'sign':>6s} {'corr':>6s}  tv!=0  lab!=0")
for n in ["dxy", "vix", "gold", "yields", "btc", "eth", "btcd", "total3"]:
    a, b = t[f"Sig {n}"].astype(float), l[f"sig_{n}"]
    print(f"{n:8s} {np.isclose(a,b,atol=1e-3).mean():6.1%} {(np.sign(a)==np.sign(b)).mean():6.1%} "
          f"{a.corr(b):6.2f}  {(a!=0).mean():5.0%}  {(b!=0).mean():5.0%}")
print(f"score corr {t['Score'].corr(l['score']):.3f}  sign agree {(np.sign(t['Score'])==np.sign(l['score'])).mean():.1%}  "
      f"mean abs diff {(t['Score']-l['score']).abs().mean():.3f}")

# Macro 15m only exists for the last ~60 days on Yahoo: compare that window separately
m15 = common[common >= eng[eng["sig_dxy"].notna()].index[0]]
recent = common[common >= common[-1] - pd.Timedelta(days=55)]
t, l = tv.loc[recent], eng.loc[recent]
print(f"\nlast 55 days ({len(recent)} bars, 15m macro available)")
for n in ["dxy", "vix", "gold", "yields", "btc", "eth", "btcd", "total3"]:
    a, b = t[f"Sig {n}"].astype(float), l[f"sig_{n}"]
    print(f"{n:8s} {np.isclose(a,b,atol=1e-3).mean():6.1%} {(np.sign(a)==np.sign(b)).mean():6.1%} "
          f"{a.corr(b):6.2f}  {(a!=0).mean():5.0%}  {(b!=0).mean():5.0%}")
print(f"score corr {t['Score'].corr(l['score']):.3f}")
