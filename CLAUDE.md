# Capital Flow Filter - Project Documentation

## Overview

This project provides a **free trading signals service** built around the Capital Flow Filter indicator for cryptocurrency trading. It includes a website, Telegram integration, and AI-powered daily report generation.

**Important:** The Capital Flow Filter is a **FREE, independent indicator** created by the project owner. It is inspired by MDX ALGO's Capital Flow Index but is NOT part of the MDX ALGO product suite. The owner is an active MDX ALGO community member (Bot Master, Discord) and affiliate.

---

## Project Structure

```
capital-flow/                   # Next.js 16 (React 19) app on Vercel since 2026-10-15
├── app/                        # Every page is React (App Router); each route has page.jsx + its own CSS file
│   ├── layout.jsx              # Root layout (fonts)
│   ├── page.jsx + osc.css      # / homepage = the CF Osc page (since 2026-10-16; hero art in components/HeroVisual.jsx)
│   ├── signals/                # /signals: the old dashboard homepage (live feed, sentiment, calendar)
│   ├── about/ methodology/ strategies/ reports/ suggest/ privacy/ disclaimer/
│   └── components/             # Client components: HeroVisual, SignalsFeed, LatestReportCard, FearGreedWidget, LongShortWidget,
│                               #   EconomicCalendarWidget, SuggestWidget (floating feedback), ReportsArchive, SuggestionsBoard
├── pages/api/                  # API routes (moved from api/ for Next): webhook, signals, suggestions,
│   └── webhook.js              #   fear-greed, long-short-ratio, economic-calendar, cron/economic-alerts
├── next.config.mjs             # Redirects: old /*.html addresses -> clean routes, /oscillator and /suite.html -> /
├── vercel.json                 # framework: nextjs + the daily economic-alerts cron
├── Indicator script/
│   ├── mdx-capital-flow-filter-v4.6.0.txt   # CURRENT overlay (Pine v6, standalone)
│   ├── mdx-capital-flow-filter-v4.5.x.txt   # Previous versions (4.5.0 - 4.5.2)
│   ├── cf-filter-strategy-v4.6.0.txt        # Backtest (strategy) version of v4.6.0
│   ├── capital-flow-regime-v5.0.pine        # v5.0 Regime (daily SMA50 + macro veto) - PARKED
│   ├── capital-flow-regime-strategy-v5.0.pine  # its backtest strategy - PARKED
│   ├── TRADINGVIEW-DESCRIPTION.md           # Published script description
│   └── INDICATOR-IMPROVEMENTS.md            # Feature wishlist & roadmap
├── Capital Flow Oscillator/
│   ├── capital-flow-oscillator-v3.4.pine    # CURRENT oscillator (Market Cipher B / VuManChu replacement)
│   ├── capital-flow-oscillator-v1.2-v3.3    # Previous versions
│   └── capital-flow-combined-strategy-v1.0.pine  # Backtest of the v2.1 Cloud Edge playbook (retired, off the chart)
├── public/                     # Static assets only (no HTML pages since the React port)
│   ├── reports-data.json       # Archive of daily reports (auto-generated)
│   ├── Daily 4H BTC Screenshots/   # Chart screenshots for reports
│   └── images/                 # Curated indicator screenshots
├── lab/                        # Python test lab: engine port, backtests, TradingView comparisons (see lab/README.md; data/ and .venv/ not in git)
├── scripts/
│   └── generate-report.js      # AI daily report generator
├── .env                        # API keys (not in git)
├── MDX-CAPITAL-FLOW-HANDOVER.md    # Original handover document
└── CLAUDE.md                   # This file
```

---

## Key Components

### 1. TradingView Webhook (`/pages/api/webhook.js`)

Receives alerts from TradingView and forwards to Telegram.

**Endpoint:** `https://capital-flow-filter.vercel.app/api/webhook`

**Since 2026-10-16 the channel is fed by one TradingView alert, "CF Osc 1H Channel"** (BITGET:BTCUSDT.P, 1H, Any alert() function call, webhook on; A-grade only, TP alerts off, Volume Delta money flow). The old overlay alerts (MDX Capital Flow Filter v4.4 and "Capital Flow", 1H/4H) are stopped, not deleted. The user's 5m CF Osc alert has no webhook (private). `lib/parseSignal.js` reads type/direction/ticker/timeframe from both message formats; `/api/signals` re-parses old rows on read. Plain-text alerts are HTML-escaped before Telegram (parse_mode HTML).

**TradingView Alert Setup:**
- Webhook URL: `https://capital-flow-filter.vercel.app/api/webhook`
- Message: The alert message text (supports HTML formatting)

**Telegram Bot:**
- Bot: @capital_flowbot
- Channel: @fivedaytrader (Chat ID: -1001548592148)

### 2. Daily Report Generator (`/scripts/generate-report.js`)

Analyzes BTC 4H chart screenshots using Claude AI and generates formatted reports.

**Usage:**
```bash
node scripts/generate-report.js
```

**Flow:**
1. Finds latest screenshot in `/public/Daily 4H BTC Screenshots/`
2. Sends to Claude (claude-sonnet-4-20250514) for analysis
3. Generates formatted Telegram report
4. Posts image + report to Telegram
5. Saves to `/public/reports-data.json` for website

**Screenshot Naming:** `BTCUSDT_YYYY-MM-DD_HH-MM-SS_xxxxx.png`

**Best Practice:** Run after 4H candle close, ideally after NY open for best signal clarity.

### 3. Website (Vercel)

**URL:** https://capital-flow-filter.vercel.app/

**Framework:** Next.js (App Router pages, `pages/api` for the API). All pages were ported from static HTML to React on 2026-10-15; a side-by-side check showed every element at the same position and size as the old HTML, widgets included. Each page imports its own CSS and links between pages are plain `<a>` tags (full page loads), so page stylesheets never mix; switching to `next/link` would need the CSS scoped first. Run locally with `npm run dev`, check with `npm run build`. Strategies/methodology/about still contain some old manual figures (e.g. "82% Win Rate").

**Pages:**
- `/` - Homepage = the CF Osc page (made the homepage 2026-10-16 at the user's request): Capital Flow signal, reading the pane, money flow test, engine, install, FAQ. No "Cipher", Market Cipher or LuxAlgo wording or comparison table on the site (removed 2026-10-16 when the user said "im not sure we should be mentioning 'Cipher style waves'"); credits name only LazyBear's WaveTrend and VuManChu's open-source oscillator. Has a CF Levels section (#levels, illustration in components/LevelsVisual.jsx, added 2026-10-17; it replaced the old "Capital Flow Filter overlay" companion card), CF Levels in the install step and two CF Levels FAQs. `/oscillator` and `/suite.html` redirect here; old `/x.html` addresses redirect to `/x`
- `/signals` - Live signals page (rewritten 2026-10-16): the 24h-delayed feed of the Telegram channel's alerts, "What the channel posts" (CF Osc 1H: Capital Flow, A-grade, Blue Wave, capital-flow exit, with an example message), Fear & Greed, long/short (OKX), economic calendar. Since 2026-10-17 the feed shows only CF Osc alerts (`/api/signals` keeps rows whose first line has " · "; old overlay posts are left out), long/short compares now with 24 hours ago (OKX's 1H and 1D series start with the same latest reading, so the old 1H/1D bars always matched), the calendar comes from Financial Modeling Prep (paid key `FMP_API_KEY` in .env and Vercel Production/Development, added 2026-10-17; next two weeks, actual results once released, rows of one release grouped under the headline figure, Forex Factory as fallback) and lists recent releases once none are left, and the nav links CF Levels. The old overlay copy ("Institutional-Grade", made-up win-rate table, signal types, roadmap, daily-reports claim) was removed. Linked as "Live signals" from the CF Osc nav and "Live Signals" from the other pages' footers
- `/reports` - Archive of daily reports (Substack-style)
- `/privacy` - Privacy policy
- `/disclaimer` - Trading risk disclaimer

**Branding (2026-10-16):** Dark theme with gold accents (#f3c754, light #f7d77e; CSS tokens `--brand` / `--brand-light` / `--brand-glow`, which replaced orange #ff6b00 / `--orange`). Buttons on gold use dark text (#17130a). The logo is `app/components/Logo.jsx`: an open "C" with the gold signal dot in its mouth wearing a thin ring (the user's pick, "option E"). The ring spins on its vertical axis once on load and again on hover (SMIL `rx` animation, still for reduced motion). Favicon `app/icon.svg` (heavier strokes for 16px) and `app/apple-icon.png`. No MDX ALGO mentions anywhere on the site (removed 2026-10-16, see below).

---

## The Indicator (Capital Flow Filter v4.6.0)

**Versions:** v4.6.0 is current and fully standalone. It fetches its own data with `request.security`, using closed higher-timeframe bars only, so it doesn't repaint. The older v4.4 (live on the owner's "Botpit" TradingView layout) instead reads 4 MDX "Capital Flow Index" panes via `input.source`. That makes it dependent on MDX's paid indicator, so it is being phased out in favour of v4.6.

TradingView script names:
- Overlay: "Capital Flow Filter [v4.6.0]" (legend "CF Filter v4.6")
- Oscillator: "Capital Flow Oscillator [v3.4]" (legend "CF Osc")
- Backtest: "Capital Flow Filter Strategy [v4.6.0]"

### What It Does

Aggregates capital flow data from multiple sources to generate a composite trading signal.

**Market presets** (`Market` input, Auto picks one from the chart's instrument):
- **Crypto:** DXY, VIX, Gold, US10Y | BTC, ETH | BTC.D, TOTAL3
- **Equities:** DXY, VIX, US10Y, HYG | SPY, QQQ | IWM, XLU
- **Metals:** DXY, US10Y, VIX, SPX | Gold, Silver | GDX, TIP
- **Forex:** US10Y, VIX, SPX, Gold | the base & quote currency indexes | AUDJPY, Oil. Signs follow which side the USD is on.
- **Custom:** 8 user symbols

Each input has a preset direction (e.g. DXY rising = bearish for crypto). The accuracy weighting can also flip an input's sign if it has been wrong most of the time.

**Flips:** the score must pass ±0.2 (`Flip Threshold`) for 2 bars (`Flip Confirmation`) to flip direction. This replaced the old ±0.05 crossing, which was very noisy.

**Signal Scoring:** -1.0 to +1.0 normalized score
- `> 0.7` = Full Send (strong conviction)
- `> 0.5` = Bullish/Standard
- `> 0.2` = Lean Bull/Bear
- `-0.2 to 0.2` = Neutral

### Panel Display

The indicator shows a panel with:
- **MACRO:** x/4 aligned (DXY, VIX, Gold, Yields)
- **CRYPTO:** x/2 aligned (BTC, ETH)
- **SECTORS:** x/2 aligned (BTC.D, TOTAL3)
- **Verdict:** BULLISH/BEARISH/NEUTRAL + percentage
- **Confluence:** x/8 total signals aligned

### Trading Modes

Auto-detects based on chart timeframe:
- **Scalp:** 5m/15m/1H data (1m-15m charts). Macro is read as a 1H/4H/1D backdrop at 0.6 weight. On crypto, the leader/sector slots switch to order flow: open interest × price, Coinbase premium, and perp basis (Binance perps).
- **Intraday:** 15m/1H/4H data (30m-4H charts)
- **Swing:** 4H/1D/1W data (Daily+ charts)

**Signal Threshold:** "Auto" uses adaptive (volatility-scaled) thresholds on Scalp only. It uses a fixed ±0.5% flow elsewhere, because adaptive tested worse on 1H-4H.

### Backtest Results (cf-filter-strategy-v4.6.0, BTCUSDT, Jan 2024 - Oct 2026, 0.05% fees + slippage)

- **Shorts lose money on every timeframe.** Trading both directions on every flip underperforms buy-and-hold.
- **Long only + Standard (50%+) entry, exit on the opposite flip.** This is now the strategy default. It beat buy-and-hold over each strategy's own trading window:

| Timeframe | Strategy | Buy & hold | Max drawdown |
|---|---|---|---|
| 1H | +58% | +32% | ~16% |
| 3H | +47% | +31% | ~14% |
| 4H | +125% | +83% | ~16% |

- **Caveats:** only 15-20 trades per timeframe, the setup was chosen from about 10 configurations, and the period was mostly a bull market. Validate on ETH and on 2022 before relying on it.
- **Hidden dependency (found 2026-10-14):** `calcFlowOffset` reads the global `adaptiveThreshold`, which depends on the timeframe. Inside `request.security` Pine re-evaluates it in the *requested* context, so lower-timeframe reads (15m on 1H-4H charts) come back volatility-scaled instead of as raw %. The backtests above depend on this. Every explicit rewrite tried changed the results (3H, same settings):

| Flow rule | 3H result |
|---|---|
| v4.6.0 as written (context-dependent) | +47%, 19 trades, PF 2.35 |
| 15m-and-below adaptive, explicit | +19%, 15 trades |
| No input adaptive | +1%, 14 trades |
| Every input adaptive | -6%, 26 trades |
| Never read below chart TF | +18%, 55 trades |

  So the 3H/4H edge rests on an accidental, fragile interaction. The code is left as written, with a comment warning against "simplifying" it. Treat the 3H/4H numbers as unproven.

## Capital Flow Levels (v1.0, the price-chart companion)

`Indicator script/capital-flow-levels-v1.0.pine`, TradingView "Capital Flow Levels [v1.0]" (legend "CF Levels"), built 2026-10-17 to replace the CF Filter overlay on the chart as the CF Osc's price-chart partner. Modelled on what the user uses in their AI Charting Tools indicator:
- **Volume zones:** supply / demand from swing candles (wick to body, 0.5-1 ATR tall), labelled "$ volume | % share" (dollar volume of the swing candle +/-1 bar, share of the last 500 bars). Overlapping zones stay as separate translucent boxes (overlap shows darker; the user sees overlap as stronger S/R) with one label per cluster plus "x3". Removed when price closes through.
- **Structure:** HH / HL / LH / LL on main swings (structure length 20, zones use 10).
- **Opens:** DO / WO / MO / Q / YO plus optional previous days and PWO. Every open keeps its own line at its exact price (the user: levels are targeted precisely, a close a few dollars either side matters, so never merge nearby levels); only identical prices share a tag ("Q4 MO"); tags within 0.25 ATR are staggered sideways; hovering a tag shows the exact price. Drawn with xloc.bar_time (bar-index drawings failed on 15m: the yearly open was beyond the 1,577-bar drawing buffer).
- **Volume candles (PVSRA):** climax (200% of the previous 10 bars' average, or the highest volume x range) green / red, rising (150%) blue / violet, the rest grey; "Highlight Only" keeps the user's own colours.
- **Regains (2026-10-17, the user asked):** "DO ↑" / "WO MO ↓" tags when a candle closes back across an open after at least 2 closes on the other side (input "Closes on the Other Side First"), opens only (the user chose not to do zones); alert() messages "🟢 Regained the weekly open · BTCUSDT.P 15m". State resets each new period. Tags only for the last 3 days (input "Tag Regains From the Last (days)"), so history stays clean; alerts unaffected. Zone shading is capped (transparency 68 at most solid) so the strongest zone doesn't dominate.
- No plots except the barcolor.

## The Oscillator (Capital Flow Oscillator v3.4)

A Market Cipher B / VuManChu Cipher B replacement, Classic (MC-style) look by default:
- **Waves:** WaveTrend momentum (same maths as Cipher B), or "Cloud Position" inside the Keltner cloud
- **Higher-timeframe wave:** smooth soft-glow lavender line behind (Auto: up to 15m -> 1H, up to 1H -> 4H, up to 4H -> 1D, daily -> 1W); closed bars only
- **Money flow:** buy vs sell volume estimated from lower-timeframe candles (volume delta: each candle's volume x body / range), falling back to candle pressure. Tested 2026-10-15 against Binance's real taker buy/sell volume (BTC + ETH, 15m-4H): body/range tracked real flow best (smoothed correlation ~0.45-0.6, turns agree ~70-75%), the old close-location split worse (~0.25-0.45, ~60-70%) and the Cipher B formula worst (~0.2-0.4, ~55-60%). Even the best estimate is only roughly right; true aggressor data needs TradingView's request.footprint (Premium plans); volume-weighted EMA plus an Ehlers super smoother ("Money Flow Smoothing", default 12) so it draws as a smooth curve, not a sawtooth; normalised to its own typical size. "Money Flow Source → Cipher B" swaps in VuManChu Cipher B's exact formula (60-bar SMA of body/range × 150, minus 2.5) for comparison
- **Yellow momentum area** and an RSI wave-edge cue (no Stoch RSI / RSI lines)
- **Graded dots:** every wave turn is scored on 5 checks (stretched wave, HTF wave, money flow, capital flow, recent divergence). Only turns from a stretched wave grade above C. A = outlined dot with a thin green/red ring (since 2026-10-16; the old pink A-short dot looked the same as a plain red dot and the user couldn't find it), B = outlined dot, C = small dot. Ring language: green/red ring = A grade, gold ring = Capital Flow signal
- **Divergence engine:** price swings vs wave, RSI and money flow; regular and hidden, strength 1-3. Lines only (bold = all three agree), anchored on the wave's own trough/peak near each price swing and drawn only when the wave itself diverges (since 2026-10-16; before, lines started on the wave's slope and RSI/flow-only divergences drew lines that sloped the wrong way); hidden ones count for grading but aren't drawn by default
- **Readout:** compact two-column box (capital flow, wave + HTF arrows, volume delta + latest divergence, last graded signal); alerts carry the grade and reasons
- **Alerts (2026-10-16):** messages are plain-English, multi-line: signal + symbol + timeframe ("🟢 A-grade LONG · BTCUSDT.P 15m"), price with thousands separators, "Why:" in words (turned up from oversold, 1H wave rising, buyers stepping in...), and a capital flow line ("+14% (4 of 8 markets agree)"). All inputs use display.none so the legend and alert names read just "CF Osc" instead of listing ~60 input values
- **Capital flow band** along the bottom (same engine and Market presets as the overlay); continuous, changes shade only when conviction holds 3 bars ("Bars" option keeps the old columns)
- **Capital flow pressure + flip dots (v3.3):** faint green/red pane tint following the score (the overlay's cloud colour, "Pressure Tint Strength"), and green/red dots on the bottom band using the overlay's flip rule (±20% for 2 bars, inputs "Flip Threshold"/"Flip Confirmation" must match the overlay). Verified on BTC 1H: all 9 flips land on the same bars as the overlay's dots. Alerts "Capital Flow Flip Bullish/Bearish"
- **MC B look (v3.4):** clean background (pressure tint off by default; if turned on it follows the confirmed flip state), small green/red dot on every wave cross like MC B (C grade; on by default again since 2026-10-15 after a weekly MC B red dot was missing), status box top right with ages as clock time ("B-grade long  2h ago"), MC-style level lines at 100 / ±60 / ±53, money flow drawn over the yellow momentum at 25% transparency ("Money Flow Transparency"). The Stoch RSI and RSI lines were removed (2026-10-15): the user tried a guessed MC look and then VuManChu's exact K/D ribbon and found both "not useful". RSI survives only as the wave-edge colour cue
- **Capital Flow signal (v3.4, the signature signal):** a gold dot in a thin gold ring, long and short alike (all gold since 2026-10-17 at the user's request; before, the ring sat around the green / red cross dot) (replaced a ✦ star the user found "too cartoonish"). It fires when momentum, money and macro agree on one bar: the wave turns from a stretched level (touched the setup edge), money flow is turning the same way (vs 3 bars ago), and capital flow is on the same side (confirmed flip state and score). Named "Capital Flow" by the user. Status box shows "Capital Flow long/short" in gold; alerts "Capital Flow LONG/SHORT". The capital flow band is thicker (-101 to -115), with stronger shades and a right-edge tag ("CAPITAL FLOW IN / OUT / leaning / neutral"), because capital flow is what no other Cipher-style oscillator has
- **Blue Wave setup (v3.4):** Market Cipher's core strategy. The anchor is the deepest fast-wave dip in the 40 bars before the current dip, and must reach past ±53 ("Anchor Depth"). The current dip (the trigger) must be at most 0.8x as deep, and the bounce between them must stay ≤20 past zero. The signal fires on the trigger's turn (light blue crosses dark blue) if money flow has moved the trade's way over 5 bars. Shown as a blue diamond plus a dashed anchor-trigger line; the status box shows "Blue Wave long/short"; alerts "Blue Wave LONG/SHORT". One signal per anchor (later dips off the same anchor don't fire again). In the lab, before that rule (BTC 1H, last ~6 weeks) it fired 3 longs and 5 shorts; a stricter "no money flow wobble" rule fired zero times, so it was dropped. Making room: series-coloured plotshapes count as 2 plots, and the Setup/Signal Score/Trade State/Money Flow/Wave Value data exports were removed (only Flow Score is left); removing the Stoch RSI freed ~4 plots
- Plot budget is at the 64 limit (v3.4 hit 65 once; a transparent "Cross Dot Outline" plot was removed)
- TP1/TP2 marks and alerts were removed 2026-10-17 (untested targets); the trade tracker still ends a setup at the far band, so the flow exit (x) fires as before. The status box shows the higher timeframe as "4H" (not "240") and only divergences strong enough to draw, prefixed "hidden" when they are

The user wants it to replace Cipher B as a discretionary tool, not to be tuned by backtests. Keep dots small (the user found the big ones too large).

### Alert Types

1. **Full Send** (70%+) - Strongest conviction
2. **Standard** (50%+) - Normal signal
3. **Lean** (20%+) - Early indication
4. **Flip** - Direction change
5. **Macro Aligned** - All 4 macro signals agree
6. **Crypto Leaders** - BTC + ETH aligned
7. **Full Confluence** - All 8 signals aligned
8. **Divergence** - Price/flow divergence
9. **Manipulation Warning** - Unusual market activity

### Plot Budget

**Limit:** 64 plots (TradingView maximum)
**Current Usage (v4.6.0):** exactly 64, AT the limit. Adding 17 data-window plots failed with "The script creates too many plots (73)". Every new plot needs one removed.

**Data Exports (9 plots, reserved for future CRS):**
- Score, Strength, CFI, Regime, Confidence, Sector Tilt, Bull Count, Bear Count, Mode

There is no room for D/W/M opens as plots; use lines/labels or remove other plots first.

---

## Daily Report Format

The AI-generated report includes:

```
📊 CAPITAL FLOW — DAILY BTC REPORT
📅 [Date]

🎯 SIGNAL: [BULLISH/BEARISH/NEUTRAL] [%]

💰 PRICE: $XX,XXX (position description)

🌍 MACRO:
• DXY: [%] — [interpretation]
• VIX: [%] — [interpretation]
• GOLD: [%] — [interpretation]
• YIELDS: [%] — [interpretation]

₿ CRYPTO LEADERS:
• BTC Flow: [%]
• ETH Flow: [%]

📈 SECTORS:
• BTC.D: [%] — [interpretation]
• TOTAL3: [%]

📝 ANALYSIS:
[2-3 sentences on next 24-48 hours]

⚠️ KEY LEVELS:
• Resistance: $XX,XXX (from RED zones)
• Support: $XX,XXX (from GREEN zones)

📍 OPEN LEVELS:
• Daily: $XX,XXX — [✅ Holding / ❌ Lost] — [context]
• Weekly: $XX,XXX — [✅ Holding / ❌ Lost] — [context]
• Monthly: $XX,XXX — [✅ Holding / ❌ Lost] — [context]
```

### Chart Labels Claude Reads

The screenshot should show:
- **DO** = Today's Daily Open
- **WO** = Weekly Open
- **MO** or **Dec** = Monthly Open
- **Q1** = Quarterly Open
- **YO** = Yearly Open
- Light blue lines with brackets **(1) (2)** = Previous daily opens (days back)
- **GREEN zones** = Support levels
- **RED zones** = Resistance levels
- **GREEN price label** = Current price (right axis)

**Key Logic:**
- Price ABOVE level = ✅ Holding (bullish)
- Price BELOW level = ❌ Lost (bearish)

---

## Environment Variables

Required in `.env`:
```
ANTHROPIC_API_KEY=sk-ant-api03-...
TELEGRAM_BOT_TOKEN=8575979492:AAF...
TELEGRAM_CHAT_ID=-1001548592148
FMP_API_KEY=...   # Financial Modeling Prep (paid), economic calendar
```

---

## Deployment

**Platform:** Vercel (auto-deploys from GitHub)
**Repo:** https://github.com/leadballoon-agency/capital-flow

```bash
git add -A && git commit -m "message" && git push
```

Vercel automatically deploys on push to main.

---

## Common Tasks

### Generate Daily Report
```bash
# 1. Take screenshot of BTC 4H chart with indicator
# 2. Save to /public/Daily 4H BTC Screenshots/
# 3. Run:
node scripts/generate-report.js
```

### Test Webhook
```bash
curl -X POST https://capital-flow-filter.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"message": "Test alert message"}'
```

---

## Affiliate & Disclosure

- **2026-10-16: all MDX ALGO mentions and affiliate links were removed from the site, the report generator and the saved reports at the user's request** ("Why are you even mentioning MDX ALGO?"). The CF Osc doesn't depend on MDX in any way. Don't add MDX branding, comparisons or the affiliate link back unless asked.
- Footers now just say "Capital Flow is a free, independent project."
- The affiliate link (https://mdxalgo.com/?ref=CsMGq) still exists; the owner is an MDX ALGO community member and affiliate. If a link is ever re-added, an affiliate disclosure must go with it.

---

## Future Roadmap

### Phase 1: Foundation (Complete)
- Website with landing page
- Telegram webhook integration
- Daily report generator

### Phase 2: Content (In Progress)
- Daily 4H BTC reports
- Report archive page
- Recent signals feed on homepage

### Phase 3: Capital Rotation System (Future)
- Multi-asset dashboard
- Sector rotation tracking
- Uses indicator data exports

### Phase 4: Community (Future)
- Premium features
- Community Discord integration

---

## Indicator Improvements Wishlist

See `/Indicator script/INDICATOR-IMPROVEMENTS.md` for:
- D/W/M Opens (use lines/labels: plot budget is full)
- Flip confirmation (done in v4.5.2: threshold + confirmation bars)
- Volume confirmation on signals
- Adaptive thresholds (done in v4.6.0, used on Scalp)
- Session-weighted signals

---

## Troubleshooting

### Report shows wrong prices
- Check the prompt in `generate-report.js`
- Ensure screenshot has visible price labels
- GREEN label on right axis = current price

### Report shows wrong open levels
- Labels: DO, WO, MO/Dec, Q1, YO
- Price ABOVE = Holding, BELOW = Lost
- MDX Algomaster plots these levels

### Telegram not receiving
- Check bot token in .env
- Verify bot is admin in channel
- Test with curl command above

### Webhook 404
- Check Vercel deployment succeeded
- Verify endpoint URL is correct

---

## Contact

- **Telegram Channel:** https://t.me/fivedaytrader
- **Invite Link:** https://t.me/+j_Edhqf3jxE1OWU0

---

*Last updated: October 15, 2026 (Oscillator v3.4 final passes, gold-ring Capital Flow signal)*
