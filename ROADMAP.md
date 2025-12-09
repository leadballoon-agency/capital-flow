# Capital Flow Filter — Product Roadmap

## Vision
Build the most useful free trading signals service for crypto traders, powered by institutional-grade capital flow analysis. Create a community-driven feedback loop that continuously improves signal accuracy.

---

## Current Status: Phase 2 Active

### Phase 1: Foundation ✅ Complete
- [x] Capital Flow Filter indicator v4.4 (Pine Script)
- [x] Multi-timeframe analysis (Scalp/Intraday/Swing)
- [x] 8 data sources (DXY, VIX, Gold, Yields, BTC, ETH, BTC.D, TOTAL3)
- [x] Correlation-weighted scoring system
- [x] Beast Mode alert messages
- [x] Manipulation detection (accumulation, wick hunts, spoofing)
- [x] TradingView webhook integration
- [x] Telegram bot + channel delivery
- [x] Website with landing page

### Phase 2: Signal Distribution 🔄 In Progress
- [x] Real-time Telegram alerts
- [x] Daily 4H BTC reports (AI-generated)
- [x] Reports archive page (beautiful card design)
- [x] 24-hour delayed signal feed (FOMO/proof of value)
- [x] Neon database for signal storage
- [ ] Signal accuracy tracking
- [ ] Enhanced webhook data (price, individual scores)
- [ ] User suggestion system
- [ ] About/FAQ page improvements

### Phase 3: Signal Intelligence 📊 Planned
- [ ] Signal performance dashboard
- [ ] Win rate by signal type
- [ ] Win rate by timeframe
- [ ] Win rate by confluence level
- [ ] Macro regime performance analysis
- [ ] Export to CSV for external analysis
- [ ] Automatic price tracking (4h, 24h, 48h after signal)
- [ ] Community leaderboard (signal accuracy)

### Phase 4: Capital Rotation System 🔮 Future
- [ ] Multi-asset tracking dashboard
- [ ] Dynamic allocation recommendations
- [ ] Regime-based portfolio weighting
- [ ] Sector rotation alerts
- [ ] Uses indicator data exports (CFI, Regime, Sector Tilt)
- [ ] Portfolio rebalance signals

### Phase 5: Full Automation 🤖 Future
- [ ] WunderTrading integration
- [ ] Automated position sizing
- [ ] Auto-rebalancing based on signals
- [ ] Risk management automation
- [ ] Bot portfolio management

---

## Indicator Improvements Wishlist

### High Priority (Need Plot Budget)
| Feature | Status | Notes |
|---------|--------|-------|
| D/W/M Open Levels | Wishlist | Needs 3+ plots. Using MDX Algomaster for now |
| Enhanced Webhook JSON | Planned | Add price, individual scores |

### Medium Priority
| Feature | Status | Notes |
|---------|--------|-------|
| Flip Confirmation | Idea | 2-bar confirmation to reduce whipsaws |
| Volume Confirmation | Idea | High volume = higher confidence signals |
| Adaptive Thresholds | Idea | Threshold adjusts to market volatility |

### Lower Priority
| Feature | Status | Notes |
|---------|--------|-------|
| Sector Rotation Speed | Idea | Rate of change in BTC.D/TOTAL3 |
| Macro Regime Classification | Idea | Risk-on/Risk-off/Stagflation labels |
| Session-Weighted Signals | Idea | London/NY weighted higher than Asia |
| HTF Trend Filter | Idea | Only show signals aligned with daily trend |
| Enhanced Divergence | Idea | Use pivot points for detection |
| Asset-Specific Lookbacks | Idea | VIX shorter, BTC.D longer |

### Plot Budget
- **Limit:** 64 plots (TradingView maximum)
- **Current:** 64/64 (at limit)
- **Data Exports:** 9 plots reserved for future CRS integration
- **Strategy:** Build CRS first, move exports there, free up plots for opens

---

## Website Improvements

### Pages Needed
- [ ] Suggestion/feedback submission page
- [ ] Signal performance dashboard (public)
- [ ] FAQ page
- [ ] How to use the indicator guide

### Design Improvements
- [ ] Mobile navigation hamburger menu
- [ ] Loading states for async data
- [ ] Error states for failed fetches
- [ ] Toast notifications

### Technical
- [ ] Service worker for offline support
- [ ] RSS feed for daily reports
- [ ] Email signup integration
- [ ] Analytics (privacy-respecting)

---

## Suggestion System Design

### User Flow
1. User visits `/suggest` page
2. Fills out form: category, title, description
3. Optional: email for updates
4. Submit → saved to database
5. Admin reviews and updates status
6. Public voting on suggestions (future)

### Categories
- Indicator Feature
- Alert Improvement
- Website/UX
- New Signal Type
- Bug Report
- Other

### Statuses
- New
- Under Review
- Planned
- In Progress
- Completed
- Won't Do

### Database Schema
```sql
CREATE TABLE suggestions (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  category VARCHAR(50),
  title VARCHAR(200),
  description TEXT,
  email VARCHAR(255),
  status VARCHAR(50) DEFAULT 'new',
  votes INT DEFAULT 0,
  admin_notes TEXT
);
```

---

## Signal Tracking Enhancement

### Webhook Data (Enhanced)
```json
{
  "action": "LONG",
  "type": "FULL_SEND",
  "ticker": "BTCUSDT",
  "tf": "1H",
  "mode": "Intraday",
  "score": 72,
  "price": 97500,
  "confluence": 7,
  "macro": 4,
  "crypto": 2,
  "sectors": 1,
  "signals": {
    "dxy": -0.8,
    "vix": -0.6,
    "gold": -0.4,
    "yields": -0.7,
    "btc": 0.9,
    "eth": 0.7,
    "btcd": 0.3,
    "total3": 0.5
  }
}
```

### Database Schema (Enhanced Signals)
```sql
CREATE TABLE signals (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL,
  ticker VARCHAR(20),
  timeframe VARCHAR(10),
  mode VARCHAR(20),
  direction VARCHAR(10),
  signal_type VARCHAR(50),
  score INT,
  price_at_signal DECIMAL(20,8),
  confluence INT,
  macro_count INT,
  crypto_count INT,
  sector_count INT,
  -- Individual signals
  sig_dxy DECIMAL(5,2),
  sig_vix DECIMAL(5,2),
  sig_gold DECIMAL(5,2),
  sig_yields DECIMAL(5,2),
  sig_btc DECIMAL(5,2),
  sig_eth DECIMAL(5,2),
  sig_btcd DECIMAL(5,2),
  sig_total3 DECIMAL(5,2),
  -- Outcome tracking (updated later)
  price_4h DECIMAL(20,8),
  price_24h DECIMAL(20,8),
  price_48h DECIMAL(20,8),
  outcome VARCHAR(20),
  pnl_percent DECIMAL(10,4),
  -- Message
  message TEXT
);
```

---

## Community Ideas (To Be Voted On)

*This section will be populated by user suggestions*

1. **Multi-coin alerts** - Run signals on SOL, ETH, etc.
2. **Discord integration** - Alternative to Telegram
3. **Browser notifications** - Web push alerts
4. **Historical signal browser** - See all past signals
5. **Signal replay** - See how signals played out
6. **Custom alert thresholds** - User-defined levels
7. **Quiet hours** - No alerts during sleep
8. **Signal combinations** - Alert when multiple coins align

---

## Metrics to Track

### Signal Quality
- Win rate by type (Full Send, Standard, Lean)
- Win rate by timeframe (5m, 1H, 4H)
- Win rate by mode (Scalp, Intraday, Swing)
- Win rate by confluence level (5/8, 6/8, 7/8, 8/8)
- Average gain on winning signals
- Average loss on losing signals
- Expectancy per signal type

### Engagement
- Telegram member growth
- Website visitors
- Signals delivered per day
- Report views
- Suggestion submissions

---

## Release Notes

### v4.4 (Current)
- Beast Mode alerts
- Manipulation detection
- Multi-timeframe weighted scoring
- Auto mode detection
- Collapsible panel design

### v4.5 (Planned)
- Enhanced webhook JSON with price
- Flip confirmation option
- TBD based on community feedback

---

*Last updated: December 9, 2025*
*Feedback? Submit a suggestion at /suggest*
