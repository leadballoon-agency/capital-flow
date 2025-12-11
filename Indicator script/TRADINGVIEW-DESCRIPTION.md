# Capital Flow Filter [v4.5.1]

## TradingView Publication Details

### Indicator Name
```
Capital Flow Filter [v4.5.1]
```

### Short Title
```
Capital Flow
```

---

## Description (Copy this for TradingView)

### Overview

The Capital Flow Filter is a **multi-asset confluence indicator** that tracks capital rotation across 8 correlated macro and crypto assets to generate a weighted conviction score for directional bias.

Unlike traditional price-following indicators, this tool analyzes the **rate of change** across DXY, VIX, Gold, US10Y Yields, BTC, ETH, BTC Dominance, and TOTAL3 market cap—then dynamically weights each signal based on its historical predictive accuracy using a self-calibrating correlation system.

---

### How It Works (Technical Methodology)

**Step 1: Multi-Timeframe Flow Calculation**

For each of the 8 monitored assets, the indicator calculates a flow value using rate-of-change (ROC) smoothed by an exponential moving average:

```
Flow = EMA(ROC(close, length), length)
```

This is computed across 3 timeframes simultaneously:
- **Swing Mode**: 4H / Daily / Weekly
- **Intraday Mode**: 15m / 1H / 4H
- **Scalp Mode**: 5m / 15m / 1H

Each timeframe is weighted (1x / 2x / 3x) with higher timeframes given more influence.

**Step 2: Signal Generation**

Raw flow values are converted to directional signals (-1, 0, +1) using a threshold system:
- Flow > 0.5 = Bullish signal (+1)
- Flow < -0.5 = Bearish signal (-1)
- Within threshold = Neutral (0)

Risk-off assets (DXY, VIX, Gold, Yields) are inverted—when they fall, that's bullish for crypto.

**Step 3: Self-Calibrating Correlation Weighting (The Core Innovation)**

This is what makes Capital Flow Filter unique. Each asset's signal weight is **dynamically adjusted based on its recent predictive accuracy**:

```
Correlation = (Correct Predictions / Active Signals) × 100
Edge = |Correlation - 50| / 50
Weight = 0.2 + (0.8 × Edge)
```

- The system tracks whether each asset's signal correctly predicted price direction over a configurable lookback period
- If an asset consistently predicts correctly (>50% accuracy), its weight increases
- If an asset becomes unreliable (<50% accuracy), its signal is **inverted** and weight scales with inverse accuracy
- The 20% floor ensures no asset is completely ignored, while the 80% scaling rewards consistent accuracy

**Example**: If DXY signals have been 75% accurate over the lookback period, DXY gets a higher weight in the final score. If Gold signals have only been 40% accurate, Gold's signal is inverted and weighted according to that inverse relationship.

**Step 4: Weighted Score Aggregation**

The final conviction score (-100% to +100%) combines all 8 weighted signals:

```
Macro Score = (DXY × weight + VIX × weight + Gold × weight + Yields × weight)
Crypto Score = (BTC × weight + ETH × weight)
Sector Score = (BTC.D × weight + TOTAL3 × weight)

Final Score = Weighted average with asset-type multipliers
```

Asset-type multipliers adjust based on what you're charting:
- Charting BTC: Macro signals weighted higher (1.2x)
- Charting ETH: Balanced weighting
- Charting Alts: Sector signals weighted higher (1.3x)

**Step 5: Visual Output**

- **Keltner Channel Cloud**: Thickness represents conviction level
- **Color**: Green gradient = bullish capital flow, Red gradient = bearish
- **Info Panel**: Real-time confluence breakdown showing Macro (x/4), Crypto (x/2), Sectors (x/2)

**Step 6: Performance Tracking (New in v4.5.1)**

The indicator now tracks its own signal accuracy in real-time using a rolling window system:

```
Win Rate = (Correct Signals / Total Signals) × 100
```

- **Rolling Window**: Only measures the most recent signals, not all-time history
- **Auto-Scaling**: Window size adjusts based on trading mode:
  - Scalp Mode: Last 20 signals
  - Intraday Mode: Last 50 signals
  - Swing Mode: Last 100 signals
- **Signal Evaluation**: A signal is "correct" if price moved in the predicted direction before the next flip

The Performance row displays:
- **Win Rate**: Percentage of correct signals in the rolling window
- **Last Signal**: Result of most recent signal (✓ = correct, ✗ = wrong) with price change
- **Streak**: Current consecutive wins (W) or losses (L)

---

### Using Performance Tracking to Find Your Edge

One of the most powerful uses of Capital Flow Filter is **timeframe scanning**. Since the indicator tracks win rate per timeframe, you can quickly identify where the capital flow signals are most accurate *right now*:

1. **Flip through timeframes** (3m → 15m → 1H → 4H → Daily)
2. **Compare win rates** across each timeframe
3. **Trade the timeframe with highest win rate** for current market conditions

**Example**: If you see:
- Daily: 31% win rate (below random)
- 4H: 38% win rate
- 1H: 44% win rate
- 15m: 52% win rate

This tells you the shorter timeframes are currently more reliable—perhaps due to choppy macro conditions. Focus your trading on the 15m/1H signals.

**Pro Tip**: Win rates naturally fluctuate as market regimes change. A timeframe that was 60%+ accurate during a trend may drop to 40% during consolidation. Check regularly.

---

### Timeframe Use Cases

The indicator serves **different purposes** depending on timeframe. Don't judge all timeframes by win rate alone:

| Timeframe | Primary Use | What to Focus On |
|-----------|-------------|------------------|
| **1m-3m** | Scalp entries | Cloud as dynamic S/R, flip dots as entry triggers. Win rate less important—use for visual confluence on micro-moves |
| **5m-15m** | Active scalping | Cloud direction + flip signals. Quick sentiment shifts. Good for timing entries within larger setups |
| **1H** | Intraday bias | Win rate matters here. Follow signal direction for intraday swings. Cloud thickness = conviction |
| **4H** | Swing setup | Strong signals for position trades. Look for Full Send (70%+) or Full Confluence |
| **Daily+** | Macro bias | Overall market direction. Don't overtrade—wait for high conviction setups |

**Lower Timeframes (1m-5m):**
- The cloud acts as **dynamic support/resistance**—watch for bounces off cloud edges
- Flip dots mark **inflection points**—potential reversal or continuation spots
- **Trade management**: Cloud color tells you to hold or exit—green cloud keeps you in longs, flip to red signals take profit
- Less about "signal accuracy," more about **visual aid for scalp entries and exits**
- Use alongside higher timeframe bias for confluence

**Higher Timeframes (1H+):**
- Win rate becomes more meaningful—signals have time to play out
- **Full Send** and **Full Confluence** signals are higher probability
- Cloud thickness indicates conviction—thicker = stronger signal
- Better for position sizing decisions based on signal strength

---

### Signal Types

| Signal | Threshold | Visual Marker | Meaning |
|--------|-----------|---------------|---------|
| **FULL SEND** | Score > ±70% | Large Triangle | Maximum conviction—strong directional flow |
| **BULLISH/BEARISH** | Score > ±50% | Medium Triangle | Confirmed directional bias |
| **LEAN** | Score > ±20% | Small indicator | Early signal building |
| **NEUTRAL** | Score < ±20% | None | No clear capital flow direction |
| **FULL CONFLUENCE** | 8/8 aligned | Gold Diamond | Rare—all assets agree |
| **MANIPULATION** | Anomaly detected | Orange Cross | Volume spike or wick pattern |
| **DIVERGENCE** | Price vs Flow | Small Square | Price and capital flow disagree |

---

### What Makes This Original

1. **Self-Calibrating Weights**: Unlike static correlation indicators, the weighting system continuously adapts based on each asset's recent predictive performance. This means the indicator learns which assets are currently reliable and adjusts accordingly.

2. **Multi-Asset Confluence**: Tracks 8 specific assets chosen for their macro and crypto correlation properties, not arbitrary selections.

3. **Three-Timeframe Integration**: Each asset is analyzed across 3 timeframes with hierarchical weighting, providing both responsiveness and stability.

4. **Asset-Type Awareness**: Automatically adjusts signal weights based on whether you're charting BTC, ETH, or altcoins.

---

### Settings Guide

**Mode Settings**
- `Trading Mode`: Auto (recommended), Swing, Intraday, or Scalp
- Auto mode detects your chart timeframe and selects appropriate data timeframes

**Cloud Settings**
- `Keltner Length`: Baseline period for channel (default: 20)
- `Cloud Intensity`: Visual thickness scaling (default: 1.0)
- `Cloud Thickness = Conviction`: Thicker cloud = stronger signal

**Calibration Settings**
- `Flow Calculation Length`: ROC/EMA period (default: 14)
- `Lookback Mode`: Auto scales by timeframe; Manual for fixed value
- The lookback period determines how far back the self-calibrating system measures accuracy

**Performance Settings** (New in v4.5.1)
- `Performance Lookback`: Auto, Last 20, Last 50, Last 100, or All Time
- Auto mode adjusts based on trading mode (Scalp=20, Intraday=50, Swing=100)
- Use manual settings if you want consistent comparison across timeframes

**Alert Settings**
- 38 unique alert conditions across 8 categories
- Webhook-ready JSON output for automation
- Configurable cooldown to prevent alert spam

---

### Best Practices

1. **Use as Confluence**: Combine with your existing strategy—use high conviction signals (>70%) as your "A+ setup" filter

2. **Respect the Flow**: Trading against capital flow is fighting the current

3. **Watch Divergences**: When price makes new highs but capital flow is declining, be cautious

4. **Allow Calibration Time**: The self-calibrating system needs ~100+ bars of history to accurately weight signals

5. **Scan Timeframes for Edge**: Check win rates across timeframes before trading. If Daily shows 31% but 1H shows 52%, focus on 1H signals

6. **Monitor Win Rate Trends**: A dropping win rate may indicate changing market conditions—consider reducing position size or waiting for clearer signals

---

### Limitations

- Optimized for **crypto markets** (BTC, ETH, alts)—may be less effective on other asset classes
- Requires data from 8 external symbols; ensure your data subscription covers these
- Self-calibrating weights need time to establish—early signals on new charts may be less reliable
- Not a standalone trading system—use as confluence with other analysis

---

**Not financial advice. Trade at your own risk.**

---

## Author's Instructions (REQUIRED for Invite-Only Scripts)

```
To request access to Capital Flow Filter:

1. Send a DM to @MarkTaylor on TradingView
2. Include your TradingView username
3. Briefly describe your trading style (Swing/Intraday/Scalp)

Access is typically granted within 24-48 hours.

For support or questions about the indicator, message me on TradingView.
```

---

## Tags (for TradingView)
```
capital-flow, institutional-money, smart-money, btc, crypto, macro, confluence, multi-timeframe, alerts, dxy, vix, gold, manipulation-detection, self-calibrating
```

## Categories
- Trend Analysis
- Volatility
- Crypto

---

## Chart Screenshot Requirements

For a clean, compliant chart screenshot:
1. Use a **dark theme** TradingView chart
2. Show **BTC/USDT** on **4H timeframe**
3. Display only the Capital Flow Filter—**remove all other indicators**
4. Ensure the Keltner cloud is visible with clear color differentiation
5. Include 2-3 visible signal markers (triangles, diamonds)
6. Keep the info panel visible in corner
7. **Do not** include drawings, trendlines, or annotations

---

## Change Log

### v4.5.1
- **NEW: Performance Tracking** - Real-time win rate display in info panel
- Rolling window system: tracks accuracy of last 20/50/100 signals based on trading mode
- Auto-scaling lookback: Scalp=20, Intraday=50, Swing=100 signals
- Last signal result with price change (✓/✗ +X%)
- Win/loss streak counter
- Timeframe scanning capability to find optimal trading conditions
- New setting: `Performance Lookback` with Auto/Manual options

### v4.5.0
- Added elegant signal markers (triangles, diamonds, crosses, squares)
- New input toggle: `Show Signal Markers`
- Visual hierarchy: shape size corresponds to signal strength
- Improved TradingView House Rules compliance

### v4.4.5
- Cleaner naming: "Capital Flow Filter"
- Added shorttitle "Capital Flow" for cleaner chart display
- Improved manipulation detection sensitivity options
- Enhanced Beast Mode alert messages
- Fixed cloud thickness scaling at low conviction levels
- Optimized auto-lookback calculations for Scalp mode
- Added session filter for timezone-aware trading

---

## Originality Justification

This indicator is **original work** based on a novel approach to capital flow analysis:

1. **Self-Calibrating Correlation System**: The `calcCorrelation()` and `calcWeight()` functions implement a dynamic weighting algorithm that measures each asset's predictive accuracy over a lookback period and adjusts influence accordingly. This is not a replication of any existing public indicator.

2. **Multi-Asset Rate-of-Change Aggregation**: While ROC and EMA are standard functions, the specific combination of 8 macro/crypto assets with three-timeframe weighted averaging and asset-type detection is a unique implementation.

3. **Adaptive Signal Inversion**: When an asset's correlation drops below 50% (performing worse than random), the system automatically inverts that signal—a technique not found in standard confluence indicators.

4. **Original Code**: All Pine Script code was written from scratch for this specific purpose. The methodology combines concepts from macro analysis and correlation studies into a single actionable tool.

The indicator draws on established concepts (correlation, ROC, multi-timeframe analysis) but implements them in a novel self-improving system that continuously adapts to market conditions.
