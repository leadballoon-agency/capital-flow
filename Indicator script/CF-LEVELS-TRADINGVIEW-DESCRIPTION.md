# Capital Flow Levels: TradingView publication

Draft written 2026-10-17. Same House Rules as the CF Osc: explain what it does and how, what is original and how to
use it; no links or promotion, no performance claims, no references to paid products. Publication chart: only this
script on a clean chart (or with the CF Osc in its own pane, since they are designed as a pair).

## Publish settings

| Field | Value |
|---|---|
| Title | `Capital Flow Levels` |
| Short title (legend) | `CF Levels` |
| Visibility | Public, open source (Mozilla Public License 2.0, as in the script header) |
| Category | Support and Resistance (also: Volume, Chart Patterns) |
| Chart | BTCUSDT 1H with a few zones, the opens and a regain tag in view |

## Before publishing

- [x] Public header with licence, title without the version tag (done 2026-10-17)
- [ ] Defaults: PVSRA candles on, zones on, opens on, regain tags for the last 3 days, regain alerts on
- [ ] Publish after the CF Osc (or together), so each description can name the other

## Description (copy into TradingView)

```
Capital Flow Levels (CF Levels) marks where price is likely to react: supply and demand zones with the volume behind them, the opens traders watch, market structure, and the candles that carried real volume. It is the price-chart companion to the Capital Flow Oscillator, and the two together fit the two-indicator limit of TradingView's free plan.

VOLUME ZONES

Supply zones come from swing-high candles and demand zones from swing-low candles, drawn from the wick to the body (between 0.5 and 1 ATR tall). Each is labelled with two numbers:
- the dollar volume traded on the swing candle and the candles either side of it as the swing formed
- that volume's share of all volume over the last 500 bars
Bigger numbers mean more money changed hands at that level. The shade follows the share: stronger zones are more solid.

Overlapping zones stay as separate translucent boxes, so the overlap shows darker, and the cluster gets one label with its total and a count (x2, x3). Overlap usually means a stronger level.

A zone is removed once a candle closes through it.

OPENS

Daily (DO), weekly (WO), monthly (MO), quarterly (Q1-Q4) and yearly (YO) opens, plus optional previous daily opens and the previous weekly open. Every open keeps its own line at its exact price, because a close a few dollars either side can matter. Opens at exactly the same price share a tag (for example "Q4 MO"); tags of opens that sit close together are set side by side so they stay readable. Hover a tag to see the exact price.

REGAINS AND LOSSES

"DO ↑" marks the candle that closes back above the daily open after price had closed below it; "WO ↓" marks a close back below the weekly open, and so on for every open. Price must first close at least 2 candles on the other side (adjustable), so chop around a level does not count. Tags show for the last 3 days by default to keep history clean. Alerts fire through "Any alert() function call", for example: "Regained the weekly open".

STRUCTURE

HH, HL, LH and LL tags on the main swings (a longer swing length than the zones), so the trend reads at a glance.

VOLUME CANDLES (PVSRA)

Candles are coloured by volume, following the PVSRA method:
- green / red: climax, volume at least 200% of the previous 10 candles' average, or the highest volume x range of those 10
- blue / violet: rising, volume at least 150% of the average
- grey: everything else
"Highlight Only" keeps your own candle colours and only colours the high-volume candles; "Off" turns it off.

HOW TO USE IT

Use the zones and opens as locations, not as signals. A simple way with the Capital Flow Oscillator:
1. Let a Capital Flow signal or an A-grade setup on the oscillator set the direction.
2. Wait for price to reach a demand zone (longs) or a supply zone (shorts).
3. Look for a reaction: a close back out of the zone or a regain of the daily open.
4. Put the stop beyond the zone and aim for the next opposite zone or a key open.

NOTES

- Swings are confirmed a set number of bars after they form (the swing length), so zones and structure tags appear with that delay. Nothing is redrawn once confirmed.
- Dollar volume is volume x price from the chart's own data. It is not order book data, and exchanges report volume differently.
- Opens are drawn by time, so higher-timeframe opens work on low timeframes too.

The PVSRA candle colouring follows the publicly described PVSRA method. Everything else is original to this script.

This script is for education and analysis. It is not financial advice.
```
