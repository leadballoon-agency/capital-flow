"""Python replica of the Capital Flow Filter v4.6 engine, plus research switches.

Mirrors the Pine logic:
  flow      = ema(roc(close, n), n) on each input's own timeframe
  signal    = +1 / -1 / 0 when flow passes +/- threshold (inverted inputs flip sign)
  combined  = (tf1*1 + tf2*2 + tf3*3) / 6   (sectors use tf2 only)
  accuracy  = % of active-signal bars where the signal matched the bar's direction
  weight    = 0.2 + 0.8 * |acc - 50| / 50 ;  multiplier = +1 if acc >= 50 else -1
  score     = sum(sig * mult * weight * groupMult) / sum(weight * groupMult), clamped, EMA-smoothed
  flips     = score beyond +/- flip_level for flip_confirm bars

No look-ahead: a higher/equal-timeframe value is used only once its bar has closed
before the chart bar opens; a lower-timeframe value once it closed before the chart bar closes.

Research switches (defaults reproduce v4.6):
  weighting  = "same_bar" (v4.6) | "predictive" (signal at t-1 vs move at t) | "equal"
  sign_flip  = "hard" (v4.6) | "dead_zone" (only flip outside 40-60%) | "none"
"""
from __future__ import annotations

from dataclasses import dataclass, field

import numpy as np
import pandas as pd

TF_MINUTES = {"15m": 15, "1h": 60, "3h": 180, "4h": 240, "1d": 1440, "1w": 10080}


@dataclass
class Input:
    name: str
    group: str                      # "macro" | "crypto" | "sector"
    frames: dict                    # tf -> DataFrame(open..close, close_time), index = open time
    invert: bool = False
    tfs: tuple = ()                 # timeframes to use (1 for sectors, 3 otherwise)
    adaptive_slots: tuple = ()      # slots forced adaptive (e.g. a 1h stand-in for v4.6's adaptive 15m read)


@dataclass
class Config:
    chart_tf: str = "4h"
    flow_len: int = 14
    threshold: float = 0.5          # fixed % threshold (v4.6 Intraday/Swing)
    adaptive: bool = False          # flow / typical move, threshold = adaptive_level
    adaptive_level: float = 0.5
    lookback: int = 100
    smoothing: int = 2
    flip_level: float = 0.2
    flip_confirm: int = 2
    ltf_adaptive: bool = True       # v4.6 quirk: a <=15m request re-detects "Scalp" in its own context -> adaptive flow
    weighting: str = "same_bar"
    sign_flip: str = "hard"
    group_mult: dict = field(default_factory=lambda: {"macro": 1.2, "crypto": 1.0, "sector": 0.8})  # BTC chart


def pine_ema(x: pd.Series, n: int) -> pd.Series:
    """Pine ta.ema: alpha = 2/(n+1), seeded with the first SMA(n)."""
    a = 2.0 / (n + 1)
    v = x.to_numpy(dtype=float)
    out = np.full_like(v, np.nan)
    start = None
    for i in range(len(v)):
        if start is None:
            if i >= n - 1 and not np.isnan(v[i - n + 1:i + 1]).any():
                out[i] = v[i - n + 1:i + 1].mean()
                start = i
        else:
            prev = out[i - 1]
            out[i] = prev if np.isnan(v[i]) else a * v[i] + (1 - a) * prev
    return pd.Series(out, index=x.index)


def flow(close: pd.Series, n: int, adaptive: bool) -> pd.Series:
    roc = 100.0 * (close - close.shift(n)) / close.shift(n)
    f = pine_ema(roc, n)
    if adaptive:
        scale = roc.abs().rolling(100).mean()
        f = (f / scale).where(scale > 0, 0.0)
    return f


def align(values: pd.Series, src_close_time: pd.Series, chart: pd.DataFrame, src_tf: str, chart_tf: str) -> pd.Series:
    """Value of a source-timeframe series as known on each chart bar (no look-ahead)."""
    higher_or_equal = TF_MINUTES[src_tf] >= TF_MINUTES[chart_tf]
    def ns(x):  # compare as UTC nanoseconds (avoids tz-aware vs naive mismatches)
        return pd.DatetimeIndex(x).tz_convert("UTC").asi8 if pd.DatetimeIndex(x).tz is not None else pd.DatetimeIndex(x).asi8

    avail = pd.DataFrame({"t": ns(src_close_time), "v": values.to_numpy()}).dropna().sort_values("t")
    key = chart.index if higher_or_equal else chart["close_time"]
    left = pd.DataFrame({"t": ns(key)})
    merged = pd.merge_asof(left, avail, on="t", direction="backward", allow_exact_matches=True)
    return pd.Series(merged["v"].values, index=chart.index)


def signal_from_flow(f: pd.Series, cfg: Config, invert: bool) -> pd.Series:
    th = cfg.adaptive_level if cfg.adaptive else cfg.threshold   # chart-context threshold, even for adaptive LTF flows
    s = np.where(f > th, 1.0, np.where(f < -th, -1.0, 0.0))
    s = pd.Series(s, index=f.index).where(f.notna(), 0.0)
    return -s if invert else s


def accuracy(sig: pd.Series, chart_close: pd.Series, lookback: int, mode: str) -> pd.Series:
    price_up = chart_close > chart_close.shift(1)
    s = sig.shift(1) if mode == "predictive" else sig
    bull, bear = s > 0.3, s < -0.3
    correct = ((bull & price_up) | (bear & ~price_up)).astype(float)
    active = (bull | bear).astype(float)
    cs, as_ = correct.rolling(lookback, min_periods=1).sum(), active.rolling(lookback, min_periods=1).sum()
    return (100.0 * cs / as_).where(as_ > 10, 50.0)


def run(chart: pd.DataFrame, inputs: list[Input], cfg: Config) -> pd.DataFrame:
    """Returns chart-indexed frame with per-input signals, score and flips."""
    out = pd.DataFrame(index=chart.index)
    tf_w = {0: 1.0, 1: 2.0, 2: 3.0}
    num = pd.Series(0.0, index=chart.index)
    den = pd.Series(0.0, index=chart.index)

    for inp in inputs:
        parts = []
        for i, tf in enumerate(inp.tfs):
            fr = inp.frames[tf]
            ad = cfg.adaptive or (cfg.ltf_adaptive and (TF_MINUTES[tf] <= 15 or i in inp.adaptive_slots))
            f = flow(fr["close"], cfg.flow_len, ad)
            s = signal_from_flow(f, cfg, inp.invert)
            parts.append((tf_w[i] if len(inp.tfs) > 1 else 1.0,
                          align(s, fr["close_time"], chart, tf, cfg.chart_tf).fillna(0.0)))
        wsum = sum(w for w, _ in parts)
        sig = sum(w * p for w, p in parts) / wsum
        out[f"sig_{inp.name}"] = sig

        if cfg.weighting == "equal":
            w = pd.Series(1.0, index=chart.index)
            m = pd.Series(1.0, index=chart.index)
        else:
            acc = accuracy(sig, chart["close"], cfg.lookback, cfg.weighting)
            out[f"acc_{inp.name}"] = acc
            w = 0.2 + 0.8 * (acc - 50).abs() / 50
            if cfg.sign_flip == "hard":
                m = pd.Series(np.where(acc >= 50, 1.0, -1.0), index=chart.index)
            elif cfg.sign_flip == "dead_zone":
                m = pd.Series(np.where(acc < 40, -1.0, 1.0), index=chart.index)
                w = w.where((acc < 40) | (acc >= 50), 0.2)   # weak & wrong-ish: minimum weight, no flip
            else:
                m = pd.Series(1.0, index=chart.index)
        gm = cfg.group_mult[inp.group]
        num += sig * m * w * gm
        den += w * gm

    raw = (num / den).where(den > 0.1, 0.0).clip(-1, 1)
    score = pine_ema(raw, cfg.smoothing) if cfg.smoothing > 1 else raw
    out["raw"] = raw
    out["score"] = score

    # Confirmed flips (hysteresis)
    lvl, k = cfg.flip_level, cfg.flip_confirm
    bull_held = (score > lvl).astype(int).rolling(k).sum() == k
    bear_held = (score < -lvl).astype(int).rolling(k).sum() == k
    flow_dir = np.zeros(len(score), dtype=int)
    flip_bull = np.zeros(len(score), dtype=bool)
    flip_bear = np.zeros(len(score), dtype=bool)
    d = 0
    bh, br = bull_held.to_numpy(), bear_held.to_numpy()
    for i in range(len(score)):
        if bh[i] and d != 1:
            flip_bull[i] = True
            d = 1
        if br[i] and d != -1:
            flip_bear[i] = True
            d = -1
        flow_dir[i] = d
    out["flip_bull"] = flip_bull
    out["flip_bear"] = flip_bear
    out["flow_dir"] = flow_dir
    return out
