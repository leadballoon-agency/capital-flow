"""v4.6 (reads 15m/1h on 3H-4H charts) vs v4.6.1 clamp (never below the chart timeframe)."""
import warnings
warnings.filterwarnings("ignore")
import backtest as bt
from run_baseline import engine_for

for tf in ["1h", "3h", "4h"]:
    for clamp in [False, True]:
        chart, eng = engine_for(tf, "intraday", clamp=clamp)
        for start, end in [("2024-07-01", None), ("2024-07-01", "2025-07-01"), ("2025-07-01", None)]:
            for name, rule in [("flip+50", bt.rule_flip_strength(eng)), ("regime ", bt.rule_regime_cross(eng))]:
                r = bt.simulate(chart, *rule, start=start, end=end)
                print(f"{tf} {'clamp' if clamp else 'v4.6 '} {start}->{end or 'now':10s} {name}  {bt.fmt(r)}")
    print()
