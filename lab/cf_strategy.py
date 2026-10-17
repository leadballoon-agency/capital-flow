"""Capital Flow signal + CF Levels zone entry: does the playbook hold up?

Ports the CF Osc's Capital Flow signal (v3.4) and CF Levels' volume zones (v1.0) to the lab, then
compares entry rules on BTC (Binance spot) 1H and 4H, longs and shorts separately:

  signal      enter at the next open after a Capital Flow signal (no zone)
  zone        after a signal, enter only at a zone: at once if price is already at one, otherwise a
              limit at the nearest zone's edge if price pulls back to it before the signal expires
  zone_only   control: every first touch of a zone, with no signal (does the signal add anything?)

Stops sit just beyond the zone (or 1 ATR for "signal"); the target is the nearest opposite zone, or 2R
when there is none. Results are in R (risk multiples) after fees, so the rules compare fairly.

Usage:  .venv/bin/python -W ignore cf_strategy.py
"""
from __future__ import annotations

import warnings
from dataclasses import dataclass

import numpy as np
import pandas as pd

import data as d
from engine import pine_ema
from run_baseline import engine_for

warnings.filterwarnings("ignore")

FEE = 0.0006          # per side, fee + slippage, as a fraction of price
EXPIRY = {"1h": 24, "4h": 12}   # bars a signal stays valid without an entry
LTF = {"1h": "5m", "4h": "15m"}  # the CF Osc's Auto lower timeframe for money flow


# ── CF Osc: waves, money flow, Capital Flow signal ─────────────────────────────

def sma(x, n):
    return x.rolling(n).mean()


def super_smooth(x: pd.Series, n: int) -> pd.Series:
    a = np.exp(-np.sqrt(2) * np.pi / n)
    c2, c3 = 2 * a * np.cos(np.sqrt(2) * np.pi / n), -a * a
    v = x.to_numpy(float)
    f = np.full_like(v, np.nan)
    for i in range(len(v)):
        if np.isnan(v[i]):
            continue
        p1 = v[i - 1] if i > 0 and not np.isnan(v[i - 1]) else v[i]
        f1 = f[i - 1] if i > 0 and not np.isnan(f[i - 1]) else v[i]
        f2 = f[i - 2] if i > 1 and not np.isnan(f[i - 2]) else v[i]
        f[i] = (1 - c2 - c3) * (v[i] + p1) / 2 + c2 * f1 + c3 * f2
    return pd.Series(f, index=x.index)


def money_flow(chart: pd.DataFrame, tf: str) -> pd.Series:
    ltf = d.binance("BTCUSDT", LTF[tf], "2024-06-01")
    rng = (ltf["high"] - ltf["low"]).replace(0, np.nan)
    delta = (ltf["volume"] * (ltf["close"] - ltf["open"]) / rng).fillna(0.0)
    rule = "1h" if tf == "1h" else "4h"
    g = pd.DataFrame({"delta": delta, "vol": ltf["volume"]}).resample(rule, label="left", closed="left").sum()
    ratio = (g["delta"] / g["vol"].replace(0, np.nan)).reindex(chart.index)
    candle = ((chart["close"] - chart["open"]) / (chart["high"] - chart["low"]).replace(0, np.nan)).fillna(0.0)
    pressure = ratio.fillna(candle)
    rel = sma(chart["volume"], 60)
    w = np.minimum(chart["volume"], 3 * rel).fillna(1.0)
    avg = pine_ema(pressure * w, 60) / pine_ema(w, 60)
    raw = super_smooth(avg, 12)
    typical = sma(raw.abs(), 200)
    return raw / typical


def capital_flow_signals(chart: pd.DataFrame, eng: pd.DataFrame, tf: str) -> pd.DataFrame:
    hlc3 = (chart["high"] + chart["low"] + chart["close"]) / 3
    esa = pine_ema(hlc3, 10)
    dev = pine_ema((hlc3 - esa).abs(), 10)
    ci = ((hlc3 - esa) / (0.015 * dev)).where(dev > 0, 0.0)
    wt1 = pine_ema(ci, 21)
    wt2 = sma(wt1, 4)
    cross_up = (wt1 > wt2) & (wt1.shift() <= wt2.shift())
    cross_dn = (wt1 < wt2) & (wt1.shift() >= wt2.shift())
    touched_lo = wt1.rolling(5).min() <= -53
    touched_hi = wt1.rolling(5).max() >= 53
    mf = money_flow(chart, tf)
    score, fdir = eng["score"], eng["flow_dir"]
    out = pd.DataFrame(index=chart.index)
    out["long"] = cross_up & touched_lo & (mf > mf.shift(3)) & (fdir == 1) & (score > 0)
    out["short"] = cross_dn & touched_hi & (mf < mf.shift(3)) & (fdir == -1) & (score < 0)
    out["flow_dir"] = fdir
    return out


# ── CF Levels: volume zones ────────────────────────────────────────────────────

@dataclass
class Zone:
    side: str      # "demand" | "supply"
    top: float
    bot: float
    born: int      # bar index when confirmed (usable from this bar)
    dead: int = 10**9


def atr(chart: pd.DataFrame, n=14) -> pd.Series:
    pc = chart["close"].shift()
    tr = pd.concat([chart["high"] - chart["low"], (chart["high"] - pc).abs(), (chart["low"] - pc).abs()], axis=1).max(axis=1)
    # Pine ta.atr = RMA
    return tr.ewm(alpha=1 / n, adjust=False).mean()


def zones(chart: pd.DataFrame, swing=10, max_per_side=8) -> list[Zone]:
    h, l, o, c = (chart[k].to_numpy() for k in ("high", "low", "open", "close"))
    a = atr(chart).to_numpy()
    n = len(chart)
    out: list[Zone] = []
    active = {"demand": [], "supply": []}
    for i in range(2 * swing, n):
        p = i - swing
        win_h, win_l = h[p - swing:i + 1], l[p - swing:i + 1]
        if h[p] == win_h.max() and (win_h[:swing] < h[p]).all():
            top = h[p]
            bot = min(min(max(min(o[p], c[p]), top - a[p] * 1.0), top - a[p] * 0.5), top)
            z = Zone("supply", top, bot, i)
            out.append(z)
            active["supply"].append(z)
        if l[p] == win_l.min() and (win_l[:swing] > l[p]).all():
            bot = l[p]
            top = max(max(min(max(o[p], c[p]), bot + a[p] * 1.0), bot + a[p] * 0.5), bot)
            z = Zone("demand", top, bot, i)
            out.append(z)
            active["demand"].append(z)
        for side in active:
            while len(active[side]) > max_per_side:
                active[side].pop(0).dead = i
        for z in list(active["supply"]):
            if c[i] > z.top:
                z.dead = i
                active["supply"].remove(z)
        for z in list(active["demand"]):
            if c[i] < z.bot:
                z.dead = i
                active["demand"].remove(z)
    return out


def live(zs, side, i):
    return [z for z in zs if z.side == side and z.born <= i < z.dead]


# ── Trade simulation (in R) ─────────────────────────────────────────────────────

def run_trade(chart, i_entry, entry, stop, target, is_long, flow_dir=None, max_bars=200):
    """Walk forward from the entry bar. Stop first if a bar hits both. Returns R after fees."""
    h, l, o = chart["high"].to_numpy(), chart["low"].to_numpy(), chart["open"].to_numpy()
    risk = abs(entry - stop)
    if risk <= 0:
        return None
    fee_r = FEE * 2 * entry / risk
    for j in range(i_entry, min(i_entry + max_bars, len(chart))):
        if is_long:
            if l[j] <= stop:
                return -1 - fee_r
            if h[j] >= target:
                return (target - entry) / risk - fee_r
        else:
            if h[j] >= stop:
                return -1 - fee_r
            if l[j] <= target:
                return (entry - target) / risk - fee_r
        if flow_dir is not None and j > i_entry and flow_dir[j - 1] == (-1 if is_long else 1):
            # flow exit: capital flow flipped against the trade, out at this bar's open
            px = o[j]
            return ((px - entry) if is_long else (entry - px)) / risk - fee_r
    px = chart["close"].iloc[min(i_entry + max_bars, len(chart)) - 1]
    return ((px - entry) if is_long else (entry - px)) / risk - fee_r


def target_for(zs, i, entry, is_long, risk):
    if is_long:
        cands = [z.bot for z in live(zs, "supply", i) if z.bot > entry]
        return min(cands) if cands else entry + 2 * risk
    cands = [z.top for z in live(zs, "demand", i) if z.top < entry]
    return max(cands) if cands else entry - 2 * risk


def backtest(chart, sig, zs, tf, rule, side, start, use_flow_exit=True):
    is_long = side == "long"
    o, h, l, c = (chart[k].to_numpy() for k in ("open", "high", "low", "close"))
    a = atr(chart).to_numpy()
    fdir = sig["flow_dir"].to_numpy()
    n = len(chart)
    i0 = chart.index.searchsorted(pd.Timestamp(start, tz="UTC"))
    zside = "demand" if is_long else "supply"
    trades = []
    busy_until = -1
    if rule == "zone_only":
        seen = set()
        for i in range(i0, n - 1):
            if i <= busy_until:
                continue
            for z in live(zs, zside, i):
                if id(z) in seen:
                    continue
                touched = l[i] <= z.top if is_long else h[i] >= z.bot
                if touched and i > z.born:
                    seen.add(id(z))
                    entry = z.top if is_long else z.bot
                    entry = min(entry, o[i]) if is_long else max(entry, o[i])
                    stop = z.bot - 0.1 * a[i] if is_long else z.top + 0.1 * a[i]
                    risk = abs(entry - stop)
                    tgt = target_for(zs, i, entry, is_long, risk)
                    r = run_trade(chart, i, entry, stop, tgt, is_long, fdir if use_flow_exit else None)
                    if r is not None:
                        trades.append((chart.index[i], r))
                        busy_until = i + 1
                    break
        return trades

    sig_col = sig[side].to_numpy()
    for s in range(i0, n - 1):
        if not sig_col[s] or s <= busy_until:
            continue
        if rule == "signal":
            i = s + 1
            entry = o[i]
            stop = entry - a[s] if is_long else entry + a[s]
            tgt = target_for(zs, s, entry, is_long, a[s])
            r = run_trade(chart, i, entry, stop, tgt, is_long, fdir if use_flow_exit else None)
            if r is not None:
                trades.append((chart.index[s], r))
                busy_until = i
            continue
        # rule == "zone": already at a zone (touched in the last 5 bars) -> next open; else limit at the nearest zone
        zs_now = live(zs, zside, s)
        at = [z for z in zs_now if (l[max(0, s - 4):s + 1].min() <= z.top if is_long else h[max(0, s - 4):s + 1].max() >= z.bot)
              and (c[s] >= z.bot if is_long else c[s] <= z.top)]
        if at:
            z = max(at, key=lambda z: z.top) if is_long else min(at, key=lambda z: z.bot)
            i = s + 1
            entry = o[i]
            stop = z.bot - 0.1 * a[s] if is_long else z.top + 0.1 * a[s]
            if (is_long and entry <= stop) or (not is_long and entry >= stop):
                continue
            tgt = target_for(zs, s, entry, is_long, abs(entry - stop))
            r = run_trade(chart, i, entry, stop, tgt, is_long, fdir if use_flow_exit else None)
            if r is not None:
                trades.append((chart.index[s], r))
                busy_until = i
            continue
        below = [z for z in zs_now if (z.top < c[s] if is_long else z.bot > c[s])]
        if not below:
            continue
        z = max(below, key=lambda z: z.top) if is_long else min(below, key=lambda z: z.bot)
        for i in range(s + 1, min(s + 1 + EXPIRY[tf], n)):
            if fdir[i - 1] != (1 if is_long else -1) or i >= z.dead:
                break   # signal void: flow turned, or the zone broke
            hit = l[i] <= z.top if is_long else h[i] >= z.bot
            if hit:
                entry = min(z.top, o[i]) if is_long else max(z.bot, o[i])
                stop = z.bot - 0.1 * a[s] if is_long else z.top + 0.1 * a[s]
                tgt = target_for(zs, i, entry, is_long, abs(entry - stop))
                r = run_trade(chart, i, entry, stop, tgt, is_long, fdir if use_flow_exit else None)
                if r is not None:
                    trades.append((chart.index[s], r))
                    busy_until = i
                break
    return trades


def summary(trades):
    if not trades:
        return "  0 trades"
    r = np.array([t[1] for t in trades])
    wins = r[r > 0]
    pf = wins.sum() / -r[r <= 0].sum() if (r <= 0).any() else float("inf")
    return (f"{len(r):3d} trades  win {100 * len(wins) / len(r):4.0f}%  avg {r.mean():+.2f}R  "
            f"total {r.sum():+6.1f}R  PF {pf:4.2f}  worst run {worst_run(r):d}")


def worst_run(r):
    worst = cur = 0
    for x in r:
        cur = cur + 1 if x <= 0 else 0
        worst = max(worst, cur)
    return worst


if __name__ == "__main__":
    start = "2024-11-01"   # hourly macro history (Yahoo) starts around Oct 2024
    for tf in ["1h", "4h"]:
        chart, eng = engine_for(tf, "intraday")
        sig = capital_flow_signals(chart, eng, tf)
        zs = zones(chart)
        span = chart.index[chart.index.searchsorted(pd.Timestamp(start, tz="UTC"))], chart.index[-1]
        n_l = int(sig.loc[start:, "long"].sum()); n_s = int(sig.loc[start:, "short"].sum())
        print(f"\nBTC {tf}  {span[0]:%Y-%m-%d} -> {span[1]:%Y-%m-%d}   Capital Flow signals: {n_l} long, {n_s} short")
        for side in ["long", "short"]:
            for rule in ["signal", "zone", "zone_only"]:
                t = backtest(chart, sig, zs, tf, rule, side, start)
                print(f"  {side:5s} {rule:9s} {summary(t)}")
        recent = sig.loc["2026-09-25":, ["long", "short"]]
        print("  recent signals:", [f"{ix:%m-%d %H:%M} {'L' if r.long else 'S'}" for ix, r in recent.iterrows() if r.long or r.short])
