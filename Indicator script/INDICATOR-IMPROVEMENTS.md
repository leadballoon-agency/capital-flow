# Capital Flow Filter - Improvement Tracker

## Current Version: v4.4 (Beast Mode Edition)

---

## Plot Budget Status
- **Used:** 64/64 (at limit)
- **Need to free up plots before adding new features**

---

## Wishlist (Future Features)

### High Priority

#### 1. D/W/M Open Levels
**Status:** Wishlist (needs plot budget)
**Description:** Add Daily, Weekly, Monthly open detection with regain/loss tracking
**Implementation:**
```pine
// Would require 3+ new request.security calls
d_open = request.security(syminfo.tickerid, "D", open)
w_open = request.security(syminfo.tickerid, "W", open)
m_open = request.security(syminfo.tickerid, "M", open)

// Track regain/loss
aboveDO = close > d_open
aboveWO = close > w_open
aboveMO = close > m_open
```
**Benefit:** Key institutional levels for bias confirmation

---

### Medium Priority

#### 2. Flip Confirmation (Reduce Whipsaws)
**Status:** Idea
**Problem:** Current flip detection is instantaneous, can whipsaw
```pine
// Current (instant)
flipToBullish = normalizedScore > 0.05 and normalizedScore[1] <= 0.05
```
**Proposed:**
```pine
// Confirmed flip - 2 bars above threshold
flipToBullish = normalizedScore > 0.05 and normalizedScore[1] > 0.05 and normalizedScore[2] <= 0.05
```
**Benefit:** Fewer false flip signals

#### 3. Volume Confirmation on Signals
**Status:** Idea
**Problem:** Main signals don't use volume, only manipulation detection does
**Proposed:**
```pine
volumeConfirmed = volume > ta.sma(volume, 20) * 1.2
highConfidenceSignal = math.abs(normalizedScore) > 0.5 and volumeConfirmed
```
**Benefit:** Higher confidence signals when volume backs them up

#### 4. Adaptive Signal Threshold
**Status:** Idea
**Problem:** Signal threshold is hardcoded at 0.5
```pine
getSignal(float flow, bool invert) =>
    threshold = 0.5  // Static
```
**Proposed:**
```pine
// Threshold adapts to recent volatility
flowVol = ta.stdev(flow, 20)
adaptiveThreshold = math.max(0.3, math.min(flowVol * 2, 0.8))
```
**Benefit:** Works better across different market conditions

---

### Lower Priority

#### 5. Sector Rotation Speed
**Status:** Idea
**Description:** Measure rate of change in BTC.D/TOTAL3 rotation
```pine
rotationSpeed = math.abs(sig_btcd - sig_btcd[5])
fastRotation = rotationSpeed > 0.3  // Potential reversal signal
```
**Benefit:** Early warning of trend changes

#### 6. Macro Regime Classification
**Status:** Idea
**Description:** Categorize macro into distinct regimes
```pine
riskOn = sig_dxy < 0 and sig_vix < 0 and sig_gold < 0
riskOff = sig_dxy > 0 and sig_vix > 0 and sig_gold > 0
stagflation = sig_gold > 0 and sig_yields > 0 and sig_vix > 0
```
**Benefit:** Better context for signal interpretation

#### 7. Session-Weighted Signals
**Status:** Idea
**Problem:** Session filter only dims signals, doesn't weight them
**Proposed:**
```pine
sessionWeight = inLondon ? 1.2 : inNewYork ? 1.0 : inAsia ? 0.7 : 0.8
weightedScore = normalizedScore * sessionWeight
```
**Benefit:** London/NY signals weighted higher than Asia

#### 8. Higher Timeframe Trend Filter
**Status:** Idea
**Description:** Only show signals aligned with HTF trend
```pine
htfTrend = request.security(syminfo.tickerid, "1D", ta.ema(close, 20) > ta.ema(close, 50))
trendAligned = (normalizedScore > 0 and htfTrend) or (normalizedScore < 0 and not htfTrend)
```
**Benefit:** Filter out counter-trend signals

#### 9. Enhanced Divergence Detection
**Status:** Idea
**Problem:** Current divergence uses simple lowest() comparison
**Proposed:** Use pivot points for more robust detection
**Benefit:** More accurate divergence signals

#### 10. Asset-Specific Correlation Lookbacks
**Status:** Idea
**Problem:** All assets use same lookback period
**Proposed:**
```pine
// VIX more volatile = shorter lookback
// BTC.D slower moving = longer lookback
corr_vix = calcCorrelation(sig_vix, lookback * 0.7)
corr_btcd = calcCorrelation(sig_btcd, lookback * 1.3)
```
**Benefit:** Better correlation accuracy per asset type

---

## Plot Budget Optimization Ideas

To free up plots for new features:

1. **Combine TF signals before request.security** - Could reduce calls
2. **Composite data exports** - Combine related values into single plot
3. **Remove rarely used exports** - Audit which exports are actually used
4. **Conditional plotting** - Only plot based on user settings

---

## Bug Fixes / Issues

*None reported yet*

---

## Changelog

### v4.4
- Beast Mode alerts
- Manipulation detection
- Multi-timeframe weighted scoring
- Auto mode detection
- Collapsible panel design

### Future v4.5 (Planned)
- TBD based on priorities above

---

## Notes

- Always test changes on multiple timeframes
- Backtest any threshold changes
- Consider alert frequency impact
- Document any breaking changes

---

*Last updated: December 9, 2025*
