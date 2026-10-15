"""Long/short position simulator matching the TradingView strategy settings:
signals evaluated on bar close, orders filled at the NEXT bar's open,
0.05% commission per side, small slippage, 95% of equity per trade, compounding.
"""
from __future__ import annotations

from dataclasses import dataclass

import numpy as np
import pandas as pd


@dataclass
class Costs:
    commission: float = 0.0005   # 0.05% per side
    slippage: float = 0.0001     # ~1 bp per side
    size: float = 0.95           # fraction of equity per trade


def simulate(chart: pd.DataFrame, enter_long: pd.Series, exit_long: pd.Series,
             start: str | None = None, end: str | None = None, costs: Costs = Costs()) -> dict:
    """Long-only. enter/exit are boolean Series on chart bars (decided at bar close)."""
    df = chart.copy()
    df["enter"] = enter_long.reindex(df.index).fillna(False)
    df["exit"] = exit_long.reindex(df.index).fillna(False)
    if start:
        df = df[df.index >= pd.Timestamp(start, tz="UTC")]
    if end:
        df = df[df.index < pd.Timestamp(end, tz="UTC")]

    if len(df) < 2:
        return {"return": np.nan, "buy_hold": np.nan, "max_dd": np.nan, "trades": 0, "closed": 0,
                "win_rate": np.nan, "profit_factor": np.nan, "exposure": 0.0, "equity": pd.Series(dtype=float)}
    o, c = df["open"].to_numpy(), df["close"].to_numpy()
    en, ex = df["enter"].to_numpy(), df["exit"].to_numpy()
    cash, qty = 10_000.0, 0.0
    entry_px = 0.0
    trades, equity = [], np.empty(len(df))
    pending = 0  # +1 buy at next open, -1 sell at next open

    for i in range(len(df)):
        if pending == 1 and qty == 0:
            px = o[i] * (1 + costs.slippage)
            spend = cash * costs.size
            qty = spend / px / (1 + costs.commission)
            cash -= qty * px * (1 + costs.commission)
            entry_px = px
        elif pending == -1 and qty > 0:
            px = o[i] * (1 - costs.slippage)
            cash += qty * px * (1 - costs.commission)
            trades.append(px * (1 - costs.commission) / (entry_px * (1 + costs.commission)) - 1)
            qty = 0.0
        pending = 0
        equity[i] = cash + qty * c[i]
        if qty == 0 and en[i]:
            pending = 1
        elif qty > 0 and ex[i] and not en[i]:
            pending = -1

    eq = pd.Series(equity, index=df.index)
    peak = eq.cummax()
    dd = ((peak - eq) / peak).max()
    tr = np.array(trades)
    wins, losses = tr[tr > 0], tr[tr <= 0]
    pf = wins.sum() / -losses.sum() if len(losses) and losses.sum() < 0 else np.inf
    return {
        "return": eq.iloc[-1] / 10_000 - 1,
        "buy_hold": c[-1] / o[0] - 1,
        "max_dd": dd,
        "trades": len(tr) + (1 if qty > 0 else 0),
        "closed": len(tr),
        "win_rate": len(wins) / len(tr) if len(tr) else np.nan,
        "profit_factor": pf,
        "exposure": float(((eq.diff() != 0) & (eq.shift() != eq)).mean()),
        "equity": eq,
    }


def fmt(r: dict) -> str:
    return (f"ret {r['return']*100:+7.1f}%  B&H {r['buy_hold']*100:+7.1f}%  DD {r['max_dd']*100:5.1f}%  "
            f"trades {r['trades']:3d}  win {r['win_rate']*100 if r['win_rate']==r['win_rate'] else 0:5.1f}%  "
            f"PF {r['profit_factor']:5.2f}")


# Entry / exit rules -----------------------------------------------------------

def rule_flip_strength(eng: pd.DataFrame, level: float = 0.5):
    """v4.6 strategy default: direction from confirmed flips; enter when score crosses
    above `level` while bullish; exit on the bearish flip."""
    s = eng["score"]
    enter = (eng["flow_dir"] == 1) & (s > level) & (s.shift(1) <= level)
    return enter, eng["flip_bear"]


def rule_regime_cross(eng: pd.DataFrame, level: float = 0.5, exit_level: float = 0.2):
    """Combined-strategy 'Regime Cross': enter on score crossing above `level`,
    exit when score drops below -exit_level."""
    s = eng["score"]
    enter = (s >= level) & (s.shift(1) < level)
    return enter, s < -exit_level
