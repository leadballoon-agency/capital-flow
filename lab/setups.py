"""Builds engine inputs for the lab's two setups.

intraday  - mirrors v4.6 'Intraday' mode on a 4H/3H/1H BTC chart (crypto 15m/1h/4h, macro 1h/1h/4h).
            Hourly macro only exists for ~2 years, so this covers ~Oct 2024 onward.
swing     - mirrors v4.6 'Swing' mode on a DAILY chart (crypto 4h/1d/1w, macro 1d/1d/1w),
            full history from 2018: includes the 2022 bear market.

BTC.D / TOTAL3 aren't freely available, so they're approximated from Binance prices times
(constant) circulating supply, plus the rest of the alt market and a stablecoin cap curve:
  TOTAL3 proxy = alt caps + stables      BTC.D proxy = BTC cap / total cap (%)
"""
from __future__ import annotations

import pandas as pd

import data as d
from engine import Input

ALTS = ["BNBUSDT", "XRPUSDT", "ADAUSDT", "LTCUSDT", "SOLUSDT"]
MACRO = {"dxy": "DX-Y.NYB", "vix": "^VIX", "gold": "GC=F", "yields": "^TNX"}


def crypto_frames(symbol: str, tfs: tuple, start: str = "2018-01-01") -> dict:
    h = d.binance(symbol, "1h", start)
    frames = {}
    for tf in tfs:
        if tf == "1h":
            frames[tf] = h
        elif tf == "15m":
            frames[tf] = d.binance(symbol, "15m", "2024-01-01")
        else:
            frames[tf] = d.resample(h, tf)
    return frames


# Approximate circulating supply (constant) -> market-cap weights for the proxies
SUPPLY = {"BTCUSDT": 19.9e6, "ETHUSDT": 120e6, "BNBUSDT": 140e6, "XRPUSDT": 60e9,
          "ADAUSDT": 36e9, "LTCUSDT": 76e6, "SOLUSDT": 540e6}
OTHER_ALTS = 1.0   # the rest of the alt market, as a multiple of the named alts' cap
# Stablecoin market cap (USD), linearly interpolated. It sits in TOTAL and TOTAL3 and damps both.
STABLES = {"2018-01-01": 3e9, "2020-01-01": 5e9, "2021-01-01": 30e9, "2022-01-01": 150e9,
           "2023-01-01": 140e9, "2024-01-01": 130e9, "2025-01-01": 205e9, "2026-01-01": 300e9,
           "2027-01-01": 330e9}


def _stables(index: pd.DatetimeIndex) -> pd.Series:
    pts = pd.Series({pd.Timestamp(k, tz="UTC"): v for k, v in STABLES.items()})
    x = pts.reindex(pts.index.union(index)).interpolate("time")
    return x.reindex(index)


def proxy_frames(tf: str, start: str = "2018-01-01") -> tuple[pd.DataFrame, pd.DataFrame]:
    """Market-cap proxies: BTC.D = BTC cap / total cap (%), TOTAL3 = alts + stables cap."""
    def tfd(sym):
        h = d.binance(sym, "1h", start)
        return h if tf == "1h" else d.resample(h, tf)
    btc = tfd("BTCUSDT")
    caps = pd.DataFrame({s: tfd(s)["close"] * SUPPLY[s] for s in SUPPLY}).reindex(btc.index)
    alts = caps.drop(columns=["BTCUSDT", "ETHUSDT"]).sum(axis=1, min_count=1) * (1 + OTHER_ALTS)
    stables = _stables(btc.index)
    total3_cap = alts + stables
    total_cap = caps["BTCUSDT"] + caps["ETHUSDT"] + total3_cap

    def frame(series):
        f = btc[["close_time"]].copy()
        for col in ["open", "high", "low", "close"]:
            f[col] = series
        f["volume"] = 0.0
        return f.dropna(subset=["close"])
    return frame(100 * caps["BTCUSDT"] / total_cap), frame(total3_cap / 1e9)


def macro_frames(ticker: str, tfs: tuple) -> dict:
    frames = {}
    for tf in tfs:
        if tf in ("15m", "1h"):
            frames[tf] = d.yahoo(ticker, tf)
        elif tf in ("3h", "4h"):
            h = d.yahoo(ticker, "1h")
            r = h.resample(tf, label="left", closed="left").agg(
                {"open": "first", "high": "max", "low": "min", "close": "last", "volume": "sum"}).dropna(subset=["close"])
            r["close_time"] = r.index + pd.Timedelta(tf)
            frames[tf] = r
        elif tf == "1d":
            frames[tf] = d.yahoo(ticker, "1d")
        elif tf == "1w":
            frames[tf] = d.macro_weekly(d.yahoo(ticker, "1d"))
    return frames


def build(setup: str, macro_15m: bool = False, clamp_to: str | None = None) -> list[Input]:
    """Engine inputs (macro, leaders, sector proxies) for the given setup.
    v4.6 Intraday reads macro on 15m/1h/4h like the crypto leaders. Yahoo only keeps ~60 days
    of 15m data, so long backtests use 1h as the stand-in unless macro_15m=True.
    clamp_to=<chart tf>: never read a timeframe below the chart's (the v4.6.1 fix - TradingView's
    lower-timeframe request.security returned unrealistic macro flows)."""
    if setup == "intraday":
        c_tfs, m_tfs, sec_tf = ("15m", "1h", "4h"), (("15m" if macro_15m else "1h"), "1h", "4h"), "1h"
    elif setup == "swing":
        c_tfs, m_tfs, sec_tf = ("4h", "1d", "1w"), ("1d", "1d", "1w"), "1d"
    else:
        raise ValueError(setup)
    if clamp_to:
        from engine import TF_MINUTES
        up = lambda tf: clamp_to if TF_MINUTES[tf] < TF_MINUTES[clamp_to] else tf
        c_tfs, m_tfs, sec_tf = tuple(map(up, c_tfs)), tuple(map(up, m_tfs)), up(sec_tf)

    inputs = []
    for name, tk in MACRO.items():
        stand_in = (0,) if setup == "intraday" and not macro_15m and m_tfs[0] == "1h" else ()
        inputs.append(Input(name, "macro", macro_frames(tk, m_tfs), invert=True, tfs=m_tfs, adaptive_slots=stand_in))
    inputs.append(Input("btc", "crypto", crypto_frames("BTCUSDT", c_tfs), tfs=c_tfs))
    inputs.append(Input("eth", "crypto", crypto_frames("ETHUSDT", c_tfs), tfs=c_tfs))
    btcd, total3 = proxy_frames(sec_tf)
    inputs.append(Input("btcd", "sector", {sec_tf: btcd}, invert=True, tfs=(sec_tf,)))
    inputs.append(Input("total3", "sector", {sec_tf: total3}, tfs=(sec_tf,)))

    return inputs


def chart(symbol: str, tf: str) -> pd.DataFrame:
    h = d.binance(symbol, "1h", "2018-01-01")
    if tf == "1h":
        return h
    if tf == "3h":
        r = h.resample("3h", label="left", closed="left").agg(
            {"open": "first", "high": "max", "low": "min", "close": "last", "volume": "sum"}).dropna(subset=["close"])
        r["close_time"] = r.index + pd.Timedelta(hours=3)
        return r[r["close_time"] <= h["close_time"].max()]
    return d.resample(h, tf)


def group_mult(symbol: str) -> dict:
    s = symbol.upper()
    if "BTC" in s:
        return {"macro": 1.2, "crypto": 1.0, "sector": 0.8}
    if "ETH" in s:
        return {"macro": 1.1, "crypto": 1.1, "sector": 1.0}
    return {"macro": 0.9, "crypto": 1.0, "sector": 1.3}
