# MDX Capital Flow System — Project Handover

## Overview

This document provides a complete handover of the MDX Capital Flow project for continuation in Claude Code or by another developer.

**Owner:** Mark  
**Platform:** MDX ALGO (trading bot blueprint platform)  
**Primary Goal:** Build a Capital Rotation System (CRS) that dynamically allocates capital across a portfolio of crypto trading bots based on multi-timeframe capital flow analysis.

---

## What Has Been Built

### 1. MDX Capital Flow Filter v4.4 (Pine Script)

A TradingView indicator that analyzes capital flow across multiple dimensions to generate trading signals.

**Status:** ✅ Complete and functional

**File:** `mdx-capital-flow-filter-v4.4.pine`

#### Core Features

| Feature | Description |
|---------|-------------|
| Multi-Timeframe Analysis | 3 timeframes per mode (Scalp/Intraday/Swing) |
| Auto Mode Detection | Automatically selects mode based on chart timeframe |
| Macro Analysis | DXY, VIX, Gold, Yields — all inverted for risk-on/risk-off |
| Crypto Leaders | BTC and ETH flow tracking |
| Sector Rotation | BTC.D and TOTAL3 for major/alt rotation |
| Manipulation Detection | Accumulation/distribution, wick hunting, spoofing, flash moves |
| Dynamic Panel | Collapsed/Expanded view with full market context |
| Beast Mode Alerts | 38 alert conditions with personality-driven messages |
| Data Exports | Hidden plots for CRS integration |

#### Technical Specifications

```
Pine Script Version: 6
Plot Count: 64 (at TradingView limit)
Request.Security Calls: 20
Alert Conditions: 39 (including master "Any Alert")
```

#### Trading Modes

| Mode | TF1 | TF2 | TF3 | Chart Range |
|------|-----|-----|-----|-------------|
| Scalp | 5m | 15m | 1H | 1m-15m |
| Intraday | 15m | 1H | 4H | 30m-4H |
| Swing | 4H | 1D | 1W | Daily+ |

#### Data Sources

```javascript
// Macro (inverted - falling = bullish for crypto)
src_dxy = "TVC:DXY"
src_vix = "CBOE:VIX"
src_gold = "TVC:GOLD"
src_yields = "TVC:US10Y"

// Crypto Leaders
src_btc = "BINANCE:BTCUSDT"
src_eth = "BINANCE:ETHUSDT"

// Sectors
src_btcd = "CRYPTOCAP:BTC.D"
src_total3 = "CRYPTOCAP:TOTAL3"
```

#### Signal Scoring

```
Score Range: -1.0 to +1.0
Thresholds:
  - Full Send: |score| > 0.7
  - Standard: |score| > 0.5
  - Lean: |score| > 0.2
  - Neutral: |score| <= 0.2
```

#### Data Exports (for CRS Integration)

These are plotted with `display=display.none` for external access:

| Export | Description | Scale |
|--------|-------------|-------|
| Score | Normalized score | -1 to +1 |
| Strength | Signal strength | 0-1 |
| CFI | Capital Flow Index | 0-100 (50=neutral) |
| Regime | Market regime | -1/0/+1 |
| Confidence | Signal confidence | 0-100 |
| Sector Tilt | Major vs Alt preference | -1/0/+1 |
| Bull Count | Bullish signals | 0-8 |
| Bear Count | Bearish signals | 0-8 |
| Mode | Trading mode | 1/2/3 |

---

### 2. Telegram Signal Bot

A Vercel serverless function that receives TradingView webhook alerts and forwards them to a Telegram channel.

**Status:** ✅ Code complete, pending deployment

#### Files Structure

```
telegram-webhook/
├── api/
│   └── webhook.js    # Serverless function
├── package.json
└── vercel.json       # Route configuration
```

#### Configuration Required

| Environment Variable | Description |
|---------------------|-------------|
| `TELEGRAM_BOT_TOKEN` | From @BotFather |
| `TELEGRAM_CHAT_ID` | `-1001548592148` (already set as default) |

#### Webhook Endpoint

```
POST https://[project-name].vercel.app/api/webhook
GET  https://[project-name].vercel.app/api/webhook  (health check)
```

#### TradingView Alert Setup

1. Create alert using "⚡ ANY ALERT" condition
2. Enable Webhook URL
3. Paste Vercel function URL
4. Message is sent automatically via `alert()` function

---

## Architecture Vision

```
┌─────────────────────────────────────────────────────────────┐
│                  CAPITAL ROTATION SYSTEM                     │
│                       (Future Brain)                         │
└─────────────────────────────┬───────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│ Capital Flow  │    │    Macro      │    │    Sector     │
│   Filter      │    │   Regime      │    │   Rotation    │
│  (v4.4) ✅    │    │  Detection    │    │   Tracker     │
└───────┬───────┘    └───────────────┘    └───────────────┘
        │
        ▼
┌───────────────┐
│   Telegram    │
│  Signals ✅   │
└───────┬───────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│                      BOT PORTFOLIO                           │
│  PAXG │ ETH │ BGB │ DEEP │ CAKE │ RAY │ AERO │ FXS │ FET   │
│  JUP  │ DBR │ WLD │ WIF  │ ...  │ ... │ ...  │ ... │ ...   │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
                    ┌───────────────┐
                    │ WunderTrading │
                    │   Execution   │
                    └───────────────┘
```

---

## Mark's Bot Portfolio

These are the assets Mark manages through MDX ALGO bot blueprints:

```
PAXG, ETH, BGB, DEEP, CAKE, RAY, AERO, FXS, FET, JUP, DBR, WLD, WIF
```

Approximately 15 assets total.

---

## Key Design Decisions

### 1. Plot Limit Management

TradingView limits indicators to 64 plots. The breakdown:
- ~44 from `request.security()` calls (20 calls × ~2.2 plots each)
- 7 visual plots (Keltner + clouds)
- 9 data export plots
- 2 plotshape
- 2 fill

We removed 4 less-essential exports to stay at exactly 64.

### 2. Multi-Line Ternary Fix

Pine Script v6 doesn't allow line breaks in ternary operators. All multi-line ternaries were collapsed to single lines.

### 3. Alert Architecture

Two alert mechanisms:
1. `alertcondition()` — For TradingView's built-in alert system (static messages)
2. `alert()` — Fires with dynamic message containing actual signal type, ticker, score

The `alert()` function is preferred for webhooks as it includes context.

### 4. Beast Mode

Toggle for "personality" in alert messages. When enabled, alerts are entertaining/aggressive. When disabled, alerts are professional/clean.

---

## Roadmap

### Phase 1 — COMPLETE ✅
- [x] Capital Flow Filter v4.4
- [x] Multi-timeframe analysis
- [x] Manipulation detection
- [x] Beast mode alerts
- [x] Telegram webhook code

### Phase 2 — In Progress
- [ ] Deploy Telegram bot to Vercel
- [ ] Test end-to-end alert flow
- [ ] Refine alert messages

### Phase 3 — Capital Rotation System
- [ ] Build CRS indicator that consumes CFI data exports
- [ ] Dynamic allocation algorithm
- [ ] Regime-based weighting (risk-on → alts, risk-off → PAXG)
- [ ] Portfolio rebalance signals

### Phase 4 — Automation
- [ ] CRS → WunderTrading webhook integration
- [ ] Automated position sizing
- [ ] Auto-rebalancing

### Phase 5 — Signal Service
- [ ] Public Telegram channel
- [ ] MDX ALGO subscriber distribution
- [ ] Monetization

---

## Files Summary

| File | Location | Status |
|------|----------|--------|
| `mdx-capital-flow-filter-v4.4.pine` | TradingView | ✅ Ready |
| `telegram-webhook/api/webhook.js` | Vercel (pending deploy) | ✅ Code complete |
| `telegram-webhook/package.json` | Vercel | ✅ Ready |
| `telegram-webhook/vercel.json` | Vercel | ✅ Ready |

---

## Quick Reference

### Indicator Inputs (Key Ones)

```
Mode Selection: Auto / Scalp / Intraday / Swing
Beast Mode Alerts: true/false
Show Manipulation Warning: true/false
Show Extended Info: true/false (collapsed vs expanded panel)
Table Position: Top Right (default)
Table Size: Normal
```

### Alert Types

```
⚡ ANY ALERT          — Master trigger (recommended for webhooks)
🚀 Full Send LONG/SHORT
🟢 Standard LONG
🔴 Standard SHORT
🟢 Lean LONG
🔴 Lean SHORT
↗️ Flip Bullish
↘️ Flip Bearish
⭐ Full Confluence BULL/BEAR
🌍 Macro Aligned BULL/BEAR
₿ Crypto Leaders BULL/BEAR
📈 Bullish Divergence
📉 Bearish Divergence
🚨 Manipulation HIGH
⚠️ Manipulation MED
🐋 Whale Activity
🎯 Stop Hunt
```

### Dynamic Alert Message Format

```
🚀 FULL SEND LONG | BTCUSDT 4H | Score: 78% | Bulls: 7 Bears: 1
```

---

## Notes for Continuation

1. **Pine Script v6** — Use `import` syntax if adding libraries. Current code is self-contained.

2. **Plot Budget** — At the limit. Adding features requires removing plots or consolidating `request.security()` calls.

3. **Telegram Bot Token** — Mark has the token. Must be added as Vercel environment variable before deployment.

4. **WunderTrading Integration** — Future phase. Will need webhook format compatible with their API.

5. **CRS Development** — The Capital Rotation System should read the data exports from v4.4 and output allocation percentages per asset.

---

## Contact / Context

This project is for **MDX ALGO**, Mark's trading platform providing bot blueprints for cryptocurrency trading. The system is designed to complement existing MDX Capital Flow Index methodology.

Mark has deep expertise in:
- Algorithmic trading systems
- Capital flow analysis
- Portfolio allocation strategies
- Pine Script development
- TradingView indicator architecture

---

*Last Updated: December 2024*
*Handover prepared for Claude Code continuation*
