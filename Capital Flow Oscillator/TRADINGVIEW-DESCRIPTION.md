# Capital Flow Oscillator: TradingView publication

Draft written 2026-10-17 for publishing CF Osc v3.4. TradingView's House Rules for script publications apply:
the description must explain what the script does and how, what is original, and how to use it; credit open-source
work it builds on; no links, no promotion (no Telegram, no website), no performance promises, no references to
paid products. The publication chart should show only this script, on a clean chart.

## Publish settings

| Field | Value |
|---|---|
| Title | `Capital Flow Oscillator` |
| Short title (legend) | `CF Osc` |
| Visibility | Public, open source (Mozilla Public License 2.0, as in the script header) |
| Category | Oscillators (also: Volume, Trend Analysis) |
| Chart | BTCUSDT 1H, CF Osc only, Classic style, a Capital Flow signal and an A-grade dot in view |

## Before publishing: script changes

- [ ] Rename the "Cipher B" Money Flow Source option (e.g. "Classic Body Average") and drop Market Cipher / Cipher wording
      from tooltips and comments: no references to a paid product in a public script. The formula stays, credited to
      VuManChu in the description. Charts set to "Cipher B" fall back to Volume Delta after the rename.
- [ ] Title without the version tag: `indicator("Capital Flow Oscillator", shorttitle="CF Osc", ...)`. TradingView keeps
      versions itself; later updates go out as updates to the same publication.
- [ ] Check all defaults are what a new user should see: Classic style, Volume Delta, rolling VWAP off (Yellow Wave =
      Wave Momentum) unless we decide VWAP Distance is the better default.
- [ ] Remove the internal "Flow Score" data-export plot if nobody uses it (frees a plot, tidies the Data Window).

## Description (copy into TradingView)

```
Capital Flow Oscillator (CF Osc) is a wave oscillator with a cross-market capital flow engine built in. The waves tell you when momentum is turning; the capital flow engine tells you whether the money across markets agrees with the turn.

WHAT YOU SEE

Waves: a fast (light) and slow (dark) momentum wave, using LazyBear's open-source WaveTrend formula. Lines at +/-53 and +/-60 mark stretched readings.

Higher-timeframe wave: a soft lavender line behind the waves showing the same wave one timeframe up (1H on 15m charts, 4H on 1H, daily on 4H). It only uses closed higher-timeframe bars.

Money flow: green/red area estimating buying versus selling volume. Each candle on a lower timeframe is split by its body as a share of its range (a full green body counts as all buying), volume-weighted and smoothed into a curve. Checked against real exchange taker buy/sell volume on BTC and ETH, this tracked real flow better than the common candle-body average, though it is still an estimate.

Yellow wave: by default the gap between the fast and slow waves, which turns before the waves cross. Optionally (Yellow Wave = VWAP Distance) it shows how far price is from a rolling or session VWAP, in standard deviations.

Capital flow band: the strip along the bottom. The engine reads eight markets on three timeframes. For crypto: the dollar index, VIX, gold and US 10-year yields (macro), BTC and ETH (leaders), BTC dominance and TOTAL3 (sectors). Each input has a preset direction for the market you are on (a rising dollar counts against crypto), and each is weighted by how well it has tracked price recently. The result is a score from -100% to +100%. The band changes shade only when a reading holds for 3 bars; dots mark confirmed flips (the score past +/-20% for 2 bars). Presets also exist for equities, metals and forex, chosen automatically from the chart's symbol, plus a custom set.

SIGNALS

Graded dots: every wave cross gets a dot, scored on five checks: wave stretched, higher-timeframe wave agrees, money flow agrees, capital flow agrees, recent divergence. Only turns from a stretched wave can grade above C.
- A grade: a dot with a thin green or red ring (4-5 checks)
- B grade: an outlined dot (3 checks)
- C grade: a small dot

Capital Flow signal: a gold dot in a gold ring. It fires when the wave turns from a stretched level, money flow turns the same way, and capital flow is confirmed on the same side, all on one bar. It is rare by design.

Blue Wave: a blue diamond when a shallower second dip (or peak) turns after a deep first one, with money flow already moving the trade's way.

Divergences: lines between wave troughs or peaks when price and the wave disagree (bold when the wave, RSI and money flow all agree). Hidden divergences count towards grades.

Flow exit: a grey x when capital flow turns against the last graded setup.

Status box: capital flow score and how many markets agree, the wave and higher-timeframe direction, money flow and the latest divergence, and the last signal with how long ago it fired.

HOW TO USE IT

Use it to filter your own setups rather than as a buy/sell button. A practical way:
1. Let a Capital Flow signal or an A-grade dot set the direction.
2. Look for an entry at a support or resistance level in that direction instead of chasing.
3. Wait for price to react at the level.
4. Put the stop beyond the level, and step aside if the flow exit (x) appears.
Signals on a higher timeframe with entries on a lower one work well together: for example a 4H signal with a 1H or 15m entry.

ALERTS

Alerts for Capital Flow long/short, graded long/short, Blue Wave, divergences, capital flow flips and flow exits. "Any alert() function call" sends plain-English messages with the price, the reasons and the capital flow reading.

NOTES

- Higher-timeframe and capital flow data use closed bars only, so past signals do not repaint. The current bar's values move until it closes: wait for the close.
- Money flow uses lower-timeframe data where TradingView provides it and falls back to candle shape otherwise.
- Works on any timeframe. Macro inputs trade during their own sessions, so capital flow moves less outside them.

CREDITS

WaveTrend formula: LazyBear (open source). Layout ideas and the optional classic body-average money flow formula: VuManChu's open-source Cipher B. The capital flow engine, grading, Capital Flow signal, Blue Wave detection, divergence engine, money flow method and VWAP option are original to this script.

This script is for education and analysis. It is not financial advice, and no indicator is right every time.
```
