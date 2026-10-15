"""Data loaders for the Capital Flow test lab.

Every loader returns a DataFrame indexed by bar OPEN time (UTC) with columns
open, high, low, close, volume and close_time (UTC) - close_time is what the
engine uses to decide when a value was actually available (no look-ahead).

Sources (all free, cached under lab/data/):
  - Binance spot klines via data-api.binance.vision (public mirror, no key)
  - Yahoo Finance via yfinance: daily history back to 2000s, hourly ~730 days
  - FRED CSV (no key): weekly/daily macro series such as WALCL
"""
from __future__ import annotations

import io
import time
from pathlib import Path

import numpy as np
import pandas as pd
import requests

DATA_DIR = Path(__file__).parent / "data"
DATA_DIR.mkdir(exist_ok=True)

BINANCE = "https://data-api.binance.vision/api/v3/klines"
INTERVAL_MS = {"15m": 900_000, "1h": 3_600_000, "4h": 14_400_000, "1d": 86_400_000}


def _cache(name: str) -> Path:
    return DATA_DIR / f"{name}.pkl"


def _fresh(path: Path, max_age_h: float) -> bool:
    return path.exists() and (time.time() - path.stat().st_mtime) < max_age_h * 3600


# ─────────────────────────────────────────────────────────────────────────────
# Binance
# ─────────────────────────────────────────────────────────────────────────────

def binance(symbol: str, interval: str = "1h", start: str = "2018-01-01", max_age_h: float = 12) -> pd.DataFrame:
    """Spot klines, paginated, cached. Index = open time (UTC)."""
    path = _cache(f"binance_{symbol}_{interval}")
    if _fresh(path, max_age_h):
        return pd.read_pickle(path)

    start_ms = int(pd.Timestamp(start, tz="UTC").timestamp() * 1000)
    rows = []
    while True:
        r = requests.get(BINANCE, params={"symbol": symbol, "interval": interval,
                                          "startTime": start_ms, "limit": 1000}, timeout=30)
        r.raise_for_status()
        batch = r.json()
        if not batch:
            break
        rows.extend(batch)
        start_ms = batch[-1][0] + INTERVAL_MS[interval]
        if len(batch) < 1000:
            break

    df = pd.DataFrame(rows, columns=["open_time", "open", "high", "low", "close", "volume",
                                     "close_ms", "qv", "n", "tbb", "tbq", "ig"])
    df.index = pd.to_datetime(df["open_time"], unit="ms", utc=True)
    df = df[["open", "high", "low", "close", "volume"]].astype(float)
    df["close_time"] = df.index + pd.Timedelta(milliseconds=INTERVAL_MS[interval])
    # drop the still-forming last bar
    df = df[df["close_time"] <= pd.Timestamp.now(tz="UTC")]
    df.to_pickle(path)
    return df


# ─────────────────────────────────────────────────────────────────────────────
# Yahoo Finance (macro)
# ─────────────────────────────────────────────────────────────────────────────

# Approximate session close (UTC) for daily bars: US cash/futures settle ~21:00-22:00 UTC
DAILY_CLOSE_UTC = pd.Timedelta(hours=22)


def yahoo(ticker: str, interval: str = "1d", max_age_h: float = 12) -> pd.DataFrame:
    """interval '1d' (full history), '1h' (~730 days) or '15m' (~60 days). Index = open time (UTC)."""
    import yfinance as yf

    path = _cache(f"yahoo_{ticker.replace('^', '_').replace('=', '_')}_{interval}")
    if _fresh(path, max_age_h):
        return pd.read_pickle(path)

    period = {"1d": "max", "1h": "730d", "15m": "60d"}[interval]
    raw = yf.download(ticker, interval=interval, period=period, auto_adjust=False,
                      progress=False, threads=False)
    if isinstance(raw.columns, pd.MultiIndex):
        raw.columns = raw.columns.get_level_values(0)
    df = raw.rename(columns=str.lower)[["open", "high", "low", "close", "volume"]].dropna(subset=["close"])

    if interval == "1d":
        # Yahoo daily index is the trading date; treat the bar as closing at ~22:00 UTC that day
        idx = pd.to_datetime(df.index).tz_localize(None).tz_localize("UTC")
        df.index = idx
        df["close_time"] = idx + DAILY_CLOSE_UTC
    else:
        idx = pd.to_datetime(df.index)
        idx = idx.tz_convert("UTC") if idx.tz is not None else idx.tz_localize("UTC")
        df.index = idx
        df["close_time"] = idx + pd.Timedelta(minutes=15 if interval == "15m" else 60)
    df = df[df["close_time"] <= pd.Timestamp.now(tz="UTC")]
    df.to_pickle(path)
    return df


# ─────────────────────────────────────────────────────────────────────────────
# FRED (no key needed for the CSV endpoint)
# ─────────────────────────────────────────────────────────────────────────────

def fred(series: str, max_age_h: float = 24, release_lag_days: int = 1) -> pd.Series:
    """FRED series as a Series indexed by availability time (date + lag), UTC."""
    path = _cache(f"fred_{series}")
    if _fresh(path, max_age_h):
        return pd.read_pickle(path)
    r = requests.get("https://fred.stlouisfed.org/graph/fredgraph.csv", params={"id": series}, timeout=30)
    r.raise_for_status()
    df = pd.read_csv(io.StringIO(r.text))
    df.columns = ["date", "value"]
    df["value"] = pd.to_numeric(df["value"], errors="coerce")
    df = df.dropna()
    s = pd.Series(df["value"].values,
                  index=pd.to_datetime(df["date"]).dt.tz_localize("UTC") + pd.Timedelta(days=release_lag_days),
                  name=series)
    s.to_pickle(path)
    return s


# ─────────────────────────────────────────────────────────────────────────────
# Resampling + derived series
# ─────────────────────────────────────────────────────────────────────────────

RULES = {"3h": "3h", "4h": "4h", "1d": "1D", "1w": "W-MON"}


def resample(df: pd.DataFrame, rule: str) -> pd.DataFrame:
    """Resample OHLCV to a higher timeframe aligned like TradingView crypto bars (UTC).
    rule: '4h', '1d' or '1w' (weeks start Monday 00:00 UTC)."""
    if rule == "1w":
        out = df.resample("W-MON", label="left", closed="left").agg(
            {"open": "first", "high": "max", "low": "min", "close": "last", "volume": "sum"})
        out["close_time"] = out.index + pd.Timedelta(days=7)
    else:
        out = df.resample(RULES[rule], label="left", closed="left").agg(
            {"open": "first", "high": "max", "low": "min", "close": "last", "volume": "sum"})
        out["close_time"] = out.index + pd.Timedelta(RULES[rule])
    out = out.dropna(subset=["close"])
    # only complete bars
    last_src_close = df["close_time"].max()
    return out[out["close_time"] <= last_src_close]


def macro_weekly(df_daily: pd.DataFrame) -> pd.DataFrame:
    """Weekly bars from a daily macro series (week ends Friday close)."""
    out = df_daily.resample("W-FRI", label="right", closed="right").agg(
        {"open": "first", "high": "max", "low": "min", "close": "last", "volume": "sum"}).dropna(subset=["close"])
    out["close_time"] = out.index + DAILY_CLOSE_UTC
    return out


def basket(frames: dict[str, pd.DataFrame], start_value: float = 100.0) -> pd.DataFrame:
    """Equal-weight geometric index of several close series (members join when listed)."""
    closes = pd.DataFrame({k: v["close"] for k, v in frames.items()})
    rets = np.log(closes).diff()
    idx_ret = rets.mean(axis=1, skipna=True).fillna(0.0)
    level = start_value * np.exp(idx_ret.cumsum())
    first = next(iter(frames.values()))
    out = pd.DataFrame({"open": level, "high": level, "low": level, "close": level, "volume": 0.0})
    out["close_time"] = first["close_time"].reindex(out.index)
    return out.dropna(subset=["close_time"])
