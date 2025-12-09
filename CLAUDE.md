# Capital Flow Filter - Project Documentation

## Overview

This project provides a **free trading signals service** built around the Capital Flow Filter indicator for cryptocurrency trading. It includes a website, Telegram integration, and AI-powered daily report generation.

**Important:** The Capital Flow Filter is a **FREE, independent indicator** created by the project owner. It is inspired by MDX ALGO's Capital Flow Index but is NOT part of the MDX ALGO product suite. The owner is an active MDX ALGO community member (Bot Master, Discord) and affiliate.

---

## Project Structure

```
capital-flow/
├── api/
│   └── webhook.js              # TradingView webhook -> Telegram
├── Indicator script/
│   ├── mdx-capital-flow-filter-v4.4_5.txt   # Pine Script source
│   └── INDICATOR-IMPROVEMENTS.md            # Feature wishlist & roadmap
├── public/
│   ├── index.html              # Landing page (MDX branding)
│   ├── reports.html            # Substack-style reports archive
│   ├── privacy.html            # Privacy policy
│   ├── disclaimer.html         # Trading risk disclaimer
│   ├── reports-data.json       # Archive of daily reports (auto-generated)
│   ├── Daily 4H BTC Screenshots/   # Chart screenshots for reports
│   └── images/                 # Curated indicator screenshots
├── scripts/
│   └── generate-report.js      # AI daily report generator
├── .env                        # API keys (not in git)
├── MDX-CAPITAL-FLOW-HANDOVER.md    # Original handover document
└── CLAUDE.md                   # This file
```

---

## Key Components

### 1. TradingView Webhook (`/api/webhook.js`)

Receives alerts from TradingView and forwards to Telegram.

**Endpoint:** `https://capital-flow-filter.vercel.app/api/webhook`

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

**Pages:**
- `/` - Landing page with features, signal types, roadmap, recent signals feed
- `/reports.html` - Archive of daily reports (Substack-style)
- `/privacy.html` - Privacy policy
- `/disclaimer.html` - Trading risk disclaimer

**Branding:** Dark theme with orange accents (#ff6b00) matching MDX ALGO style.

---

## The Indicator (Capital Flow Filter v4.4)

### What It Does

Aggregates capital flow data from multiple sources to generate a composite trading signal:

**Data Sources:**
- **Macro (inverted for crypto):** DXY, VIX, Gold, US 10Y Yields
- **Crypto Leaders:** BTC, ETH
- **Sectors:** BTC.D (dominance), TOTAL3 (altcoin cap)

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
- **Scalp:** 5m/15m/1H data (1m-15m charts)
- **Intraday:** 15m/1H/4H data (30m-4H charts)
- **Swing:** 4H/1D/1W data (Daily+ charts)

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
**Current Usage:** ~64 (at limit)

**Data Exports (9 plots, reserved for future CRS):**
- Score, Strength, CFI, Regime, Confidence, Sector Tilt, Bull Count, Bear Count, Mode

Cannot add D/W/M opens to indicator until CRS is built and exports moved there.

---

## Daily Report Format

The AI-generated report includes:

```
📊 MDX CAPITAL FLOW — DAILY BTC REPORT
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

- **MDX ALGO Affiliate Link:** https://mdxalgo.com/?ref=CsMGq
- The Capital Flow Filter is FREE and independent
- Clear disclosure on website footer and disclaimer page
- Owner is MDX ALGO community member, not affiliated with MDX ALGO product development

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
- D/W/M Opens (blocked by plot limit)
- Flip confirmation (reduce whipsaws)
- Volume confirmation on signals
- Adaptive thresholds
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
- **MDX ALGO:** https://mdxalgo.com/?ref=CsMGq

---

*Last updated: December 9, 2025*
