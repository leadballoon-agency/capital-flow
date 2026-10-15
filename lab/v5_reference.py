"""Lab reference for Capital Flow Regime v5.0 (to compare with the TradingView strategy)."""
import warnings
import backtest as bt
import setups as su
from v5_research import ASSETS, build_daily, sharpe
from v5_robust_lib import macro_score, regime_rule
warnings.filterwarnings("ignore")
inputs = build_daily()
for a in ASSETS:
    chart = su.chart(a, "1d")
    s = macro_score(chart, inputs, a)
    for veto in (None, -0.2):
        e, x = regime_rule(chart, s, 50, veto)
        r = bt.simulate(chart, e, x, start="2019-01-01")
        print(f"{a} {'trend only ' if veto is None else 'v5.0 (veto)'} {bt.fmt(r)}  Sharpe {sharpe(r['equity']):.2f}")
