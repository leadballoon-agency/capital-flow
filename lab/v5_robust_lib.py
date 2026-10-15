"""Shared v5.0 rule for the lab: daily SMA trend entry, vetoed by the equal-weight macro score."""
import engine as en
import setups as su

def macro_score(chart, inputs, a, threshold=0.5):
    cfg = en.Config(chart_tf="1d", ltf_adaptive=False, adaptive=False, threshold=threshold, weighting="equal",
                    smoothing=1, group_mult=su.group_mult(a))
    return en.run(chart, [i for i in inputs if i.group == "macro"], cfg)["score"]

def regime_rule(chart, score, n=50, veto=-0.2):
    c = chart["close"]; ma = c.rolling(n).mean(); up = c > ma
    ok = up & (score.reindex(c.index).fillna(0) > veto) if veto is not None else up
    return ok & ~ok.shift(1, fill_value=False), c < ma
