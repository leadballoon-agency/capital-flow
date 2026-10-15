import './home.css';
import ScrollToTop from './components/ScrollToTop';
import SignalsFeed from './components/SignalsFeed';
import LatestReportCard from './components/LatestReportCard';
import FearGreedWidget from './components/FearGreedWidget';
import LongShortWidget from './components/LongShortWidget';
import EconomicCalendarWidget from './components/EconomicCalendarWidget';
import SuggestWidget from './components/SuggestWidget';

export const metadata = {
  title: "MDX Capital Flow | Institutional-Grade Trading Signals",
  description: "Multi-timeframe capital flow analysis for crypto traders. Real-time signals powered by macro, sector rotation, and manipulation detection.",
  openGraph: {
    title: "MDX Capital Flow",
    description: "Institutional-grade capital flow analysis for crypto traders",
    type: "website"
  }
};

export default function HomePage() {
  return (
    <>
      <nav>
        <div className="nav-content">
          <a href="#" className="logo">
            <span className="logo-icon">CF</span>
            {' '}Capital Flow
          </a>
          <div className="nav-links">
            <a href="#live-feed">Live Feed</a>
            {' '}
            <a href="#features">Features</a>
            {' '}
            <a href="#timeframe-scanning">Performance</a>
            {' '}
            <a href="#signals">Signals</a>
            {' '}
            <a href="/oscillator">Oscillator</a>
            {' '}
            <a href="/strategies">Strategies</a>
            {' '}
            <a href="/methodology">Methodology</a>
            {' '}
            <a href="/reports">Reports</a>
            {' '}
            <a href="/about">About</a>
            {' '}
            <a href="https://mdxalgo.com/?ref=CsMGq" target="_blank">MDX ALGO</a>
            {' '}
            <a href="https://t.me/fivedaytrader" target="_blank" className="nav-cta">Join Telegram</a>
          </div>
        </div>
      </nav>
      <section className="hero">
        <div className="hero-content">
          <div className="badge">Live Signals Active</div>
          <h1>
            Institutional-Grade
            <br />
            {' '}
            <span className="gradient-text">Capital Flow Analysis</span>
          </h1>
          <p>
            Multi-timeframe capital flow tracking with macro analysis, sector rotation detection, and real-time manipulation alerts. Built for serious crypto traders.
          </p>
          <div className="hero-buttons">
            <a href="https://t.me/fivedaytrader" target="_blank" className="btn btn-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"></path>
              </svg>
              {' '}Get Free Signals
            </a>
            {' '}
            <a href="https://mdxalgo.com/?ref=CsMGq" target="_blank" className="btn btn-secondary">Learn More</a>
          </div>
          <div className="stats-bar">
            <div className="stat">
              <div className="stat-value">38+</div>
              <div className="stat-label">Alert Conditions</div>
            </div>
            <div className="stat">
              <div className="stat-value">3</div>
              <div className="stat-label">Trading Modes</div>
            </div>
            <div className="stat">
              <div className="stat-value">8</div>
              <div className="stat-label">Data Sources</div>
            </div>
            <div className="stat">
              <div className="stat-value">24/7</div>
              <div className="stat-label">Live Monitoring</div>
            </div>
          </div>
        </div>
      </section>
      <section className="sentiment-section">
        <div className="container">
          <div className="sentiment-header">
            <h2>Market Sentiment</h2>
            <p>Contrarian indicators to confirm Capital Flow signals</p>
          </div>
          <div className="sentiment-widgets">
            <FearGreedWidget />
            <LongShortWidget />
          </div>
          <div className="sentiment-info">
            <h3>How to Read These Signals</h3>
            <div className="sentiment-rules">
              <div className="sentiment-rule">
                <span className="sentiment-rule-icon">✅</span>
                {' '}
                <span>
                  <strong>Bullish + Fear/Retail Short</strong>
                  {' '}= Strong buy (contrarian)
                </span>
              </div>
              <div className="sentiment-rule">
                <span className="sentiment-rule-icon">✅</span>
                {' '}
                <span>
                  <strong>Bearish + Greed/Retail Long</strong>
                  {' '}= Strong sell (distribution)
                </span>
              </div>
              <div className="sentiment-rule">
                <span className="sentiment-rule-icon">⚠️</span>
                {' '}
                <span>
                  <strong>Signal + Crowded Trade</strong>
                  {' '}= Caution, watch for reversal
                </span>
              </div>
              <div className="sentiment-rule">
                <span className="sentiment-rule-icon">💡</span>
                {' '}
                <span>
                  <strong>Best setups</strong>
                  {' '}= When you're positioned opposite to retail
                </span>
              </div>
            </div>
            <p className="sentiment-source">
              Data:{' '}
              <a href="https://alternative.me/crypto/fear-and-greed-index/" target="_blank">Alternative.me</a>
              {' '}&{' '}
              <a href="https://www.binance.com/en/futures/funding-history/perpetual/trading-data" target="_blank">Binance Futures</a>
            </p>
          </div>
        </div>
      </section>
      <section className="econ-cal-section">
        <div className="container">
          <div className="econ-cal-header-section">
            <h2>Economic Calendar</h2>
            <p>High-impact events that move markets - interest rate decisions, CPI, employment data</p>
          </div>
          <div className="econ-cal-container">
            <EconomicCalendarWidget />
          </div>
        </div>
      </section>
      <section className="indicator-panel-section">
        <div className="container">
          <div className="indicator-panel-content">
            <div className="indicator-panel-text">
              <h2>Real-Time Capital Flow Panel</h2>
              <p>
                Our indicator panel gives you instant visibility into market conditions across all dimensions.
              </p>
              <ul className="indicator-features">
                <li>
                  <span className="feature-check">✓</span>
                  {' '}
                  <strong>MACRO</strong>
                  {' '}— DXY, VIX, Gold, Yields alignment
                </li>
                <li>
                  <span className="feature-check">✓</span>
                  {' '}
                  <strong>CRYPTO</strong>
                  {' '}— BTC & ETH institutional flow
                </li>
                <li>
                  <span className="feature-check">✓</span>
                  {' '}
                  <strong>SECTORS</strong>
                  {' '}— Dominance & altcoin rotation
                </li>
                <li>
                  <span className="feature-check">✓</span>
                  {' '}
                  <strong>Signal State</strong>
                  {' '}— Direction, strength & duration
                </li>
                <li>
                  <span className="feature-check">✓</span>
                  {' '}
                  <strong>PERFORMANCE</strong>
                  {' '}— Win rate, last signal & streak
                </li>
              </ul>
              <a href="https://mdxalgo.com/?ref=CsMGq" target="_blank" className="btn btn-secondary" style={{ marginTop: "1rem" }}>Get the Indicator →</a>
            </div>
            <div className="indicator-panel-image">
              <img src="/images/capital-flow-lean-bull.png" alt="Capital Flow Indicator Panel showing LEAN BULL signal at 25%" />
              <div className="panel-badge">
                <span className="panel-signal lean-bull">🟢 LEAN BULL</span>
                {' '}
                <span className="panel-pct">25%</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="live-signals" id="live-feed">
        <div className="container">
          <div className="signals-header">
            <div className="signals-title">
              <h2>Signal Feed</h2>
              <span className="delayed-badge">24h Delayed</span>
            </div>
            <a href="https://t.me/fivedaytrader" target="_blank" className="view-all-link">Want real-time? Join Telegram →</a>
          </div>
          <p className="feed-subtitle">Here's what channel members received yesterday</p>
          <SignalsFeed />
          <div className="feed-cta">
            <p>
              These signals were delivered{' '}
              <strong>24 hours ago</strong>
              {' '}to Telegram members
            </p>
            <a href="https://t.me/fivedaytrader" target="_blank" className="feed-cta-btn">Get Signals Live</a>
          </div>
        </div>
      </section>
      <section className="features" id="features">
        <div className="container">
          <div className="section-header">
            <h2>Powered by Data, Not Guesswork</h2>
            <p>
              Our Capital Flow Filter analyzes multiple market dimensions to give you a clear read on where money is moving.
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Multi-Timeframe Analysis</h3>
              <p>
                Automatically adapts to your trading style with Scalp, Intraday, and Swing modes analyzing 3 timeframes each.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Macro Regime Detection</h3>
              <p>
                Tracks DXY, VIX, Gold, and Yields to identify risk-on/risk-off conditions that drive crypto markets.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">₿</div>
              <h3>Crypto Leaders Tracking</h3>
              <p>Monitors BTC and ETH capital flow to catch major market moves before they happen.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Sector Rotation</h3>
              <p>Analyzes BTC.D and TOTAL3 to detect capital rotation between majors and altcoins.</p>
            </div>
            <div className="feature-card feature-card-image">
              <img src="/images/Lean-Bull-flow-divergence.png" alt="Capital Flow Table showing Lean Bull with Flow Divergence" className="feature-image" />
              <h3>Flow Divergence Detection</h3>
              <p>
                Alerts when price action diverges from capital flow, signaling potential reversals or traps.
              </p>
            </div>
            <div className="feature-card feature-card-image">
              <img src="/images/lean-bear.png" alt="Capital Flow Table showing Lean Bear with Suspicious Activity warning" className="feature-image" />
              <h3>Suspicious Activity Alerts</h3>
              <p>
                Detects unusual market behavior and warns you to "watch your back" when conditions look manipulated.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Instant Alerts</h3>
              <p>
                Real-time Telegram notifications with dynamic messages showing ticker, score, and signal strength.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Performance Tracking</h3>
              <p>
                Real-time win rate display with rolling window analysis. Scan timeframes to find where signals perform best in current market conditions.
              </p>
            </div>
            <div className="feature-card feature-card-image">
              <img src="/images/Neutral-red-manipulation-red-whales-loading.png" alt="Capital Flow Table showing Neutral with Whales Loading manipulation warning" className="feature-image" />
              <h3>Whale Activity Detection</h3>
              <p>
                Spots large player accumulation and distribution patterns. "Whales loading" warns you when big money is positioning.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="timeframe-section" id="timeframe-scanning">
        <div className="container">
          <div className="section-header">
            <h2>Find Your Edge with Timeframe Scanning</h2>
            <p>
              The indicator tracks its own win rate in real-time. Flip through timeframes to find where signals perform best in current market conditions.
            </p>
          </div>
          <div className="timeframe-grid">
            <div className="timeframe-card">
              <img src="/images/5minute-BTC.png" alt="5 Minute BTC Chart showing 23% win rate" className="timeframe-img" />
              <div className="timeframe-stats">
                <span className="tf-label">5m Scalp</span>
                {' '}
                <span className="tf-winrate low">23% Win Rate</span>
              </div>
            </div>
            <div className="timeframe-card">
              <img src="/images/15minute-btc.png" alt="15 Minute BTC Chart showing 30% win rate" className="timeframe-img" />
              <div className="timeframe-stats">
                <span className="tf-label">15m Scalp</span>
                {' '}
                <span className="tf-winrate low">30% Win Rate</span>
              </div>
            </div>
            <div className="timeframe-card best">
              <img src="/images/1HBTC.png" alt="1 Hour BTC Chart showing 44% win rate" className="timeframe-img" />
              <div className="timeframe-stats">
                <span className="tf-label">1H Intraday</span>
                {' '}
                <span className="tf-winrate high">44% Win Rate</span>
                {' '}
                <span className="tf-badge">Best Edge</span>
              </div>
            </div>
            <div className="timeframe-card">
              <img src="/images/4H-BTC.png" alt="4 Hour BTC Chart showing 38% win rate" className="timeframe-img" />
              <div className="timeframe-stats">
                <span className="tf-label">4H Intraday</span>
                {' '}
                <span className="tf-winrate mid">38% Win Rate</span>
              </div>
            </div>
            <div className="timeframe-card">
              <img src="/images/daily-BTC.png" alt="Daily BTC Chart showing 31% win rate" className="timeframe-img" />
              <div className="timeframe-stats">
                <span className="tf-label">Daily Swing</span>
                {' '}
                <span className="tf-winrate low">31% Win Rate</span>
              </div>
            </div>
          </div>
          <div className="timeframe-insight">
            <div className="insight-icon">💡</div>
            <div className="insight-content">
              <strong>Current Insight:</strong>
              {' '}In this example, the 1H timeframe shows the highest win rate (44%). This suggests shorter intraday signals are more reliable than swing signals in the current choppy market conditions.
            </div>
          </div>
          <div className="timeframe-uses">
            <h3 style={{ textAlign: "center", marginBottom: "1.5rem", fontSize: "1.25rem" }}>Different Timeframes, Different Uses</h3>
            <div className="uses-grid">
              <div className="use-card">
                <div className="use-header">
                  <span className="use-icon">⚡</span>
                  {' '}
                  <span className="use-title">1m-5m Scalping</span>
                </div>
                <p>
                  Cloud as{' '}
                  <strong>dynamic support/resistance</strong>
                  . Flip dots mark entry points. Cloud color tells you to{' '}
                  <strong>hold or take profit</strong>
                  . Win rate less important—it's a visual trade management tool.
                </p>
              </div>
              <div className="use-card">
                <div className="use-header">
                  <span className="use-icon">📊</span>
                  {' '}
                  <span className="use-title">15m-1H Intraday</span>
                </div>
                <p>
                  <strong>Win rate matters here.</strong>
                  {' '}Follow signal direction for intraday swings. Cloud thickness shows conviction. Best balance of signal quality and trade frequency.
                </p>
              </div>
              <div className="use-card">
                <div className="use-header">
                  <span className="use-icon">🎯</span>
                  {' '}
                  <span className="use-title">4H Swing</span>
                </div>
                <p>
                  Wait for{' '}
                  <strong>Full Send (70%+)</strong>
                  {' '}or Full Confluence signals. Fewer trades, higher quality. Use for position sizing decisions based on conviction level.
                </p>
              </div>
              <div className="use-card">
                <div className="use-header">
                  <span className="use-icon">🌍</span>
                  {' '}
                  <span className="use-title">Daily+ Macro</span>
                </div>
                <p>
                  Sets the{' '}
                  <strong>directional backdrop</strong>
                  {' '}for lower timeframe trades. Don't overtrade—use for overall bias, not frequent entries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="signals" id="signals">
        <div className="container">
          <div className="section-header">
            <h2>Signal Types</h2>
            <p>From full confluence setups to manipulation warnings, get the alerts that matter.</p>
          </div>
          <div className="signal-grid">
            <div className="signal-card">
              <span className="signal-icon">🚀</span>
              <div className="signal-info">
                <h4>Full Send</h4>
                <p>High conviction signals with 70%+ score</p>
              </div>
            </div>
            <div className="signal-card">
              <span className="signal-icon">🟢</span>
              <div className="signal-info">
                <h4>Standard Long</h4>
                <p>Solid bullish setup above threshold</p>
              </div>
            </div>
            <div className="signal-card">
              <span className="signal-icon">🔴</span>
              <div className="signal-info">
                <h4>Standard Short</h4>
                <p>Confirmed bearish conditions</p>
              </div>
            </div>
            <div className="signal-card">
              <span className="signal-icon">⭐</span>
              <div className="signal-info">
                <h4>Full Confluence</h4>
                <p>All indicators aligned</p>
              </div>
            </div>
            <div className="signal-card">
              <span className="signal-icon">🌍</span>
              <div className="signal-info">
                <h4>Macro Aligned</h4>
                <p>Macro conditions support direction</p>
              </div>
            </div>
            <div className="signal-card">
              <span className="signal-icon">📈</span>
              <div className="signal-info">
                <h4>Divergence</h4>
                <p>Price/flow divergence detected</p>
              </div>
            </div>
            <div className="signal-card">
              <span className="signal-icon">🐋</span>
              <div className="signal-info">
                <h4>Whale Activity</h4>
                <p>Large player movements detected</p>
              </div>
            </div>
            <div className="signal-card">
              <span className="signal-icon">🎯</span>
              <div className="signal-info">
                <h4>Stop Hunt</h4>
                <p>Liquidity grab in progress</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="daily-reports" id="daily-reports">
        <div className="container">
          <div className="section-header">
            <h2>Daily Market Reports</h2>
            <p>In-depth BTC analysis with Capital Flow insights, published daily.</p>
          </div>
          <div className="reports-content">
            <div className="reports-text">
              <h3>Comprehensive 4H Analysis</h3>
              <p>
                Each report combines Capital Flow signals with key price levels, market sentiment, and actionable trade setups. Get the full picture before you trade.
              </p>
              <div className="reports-features">
                <span>Capital Flow Signal</span>
                {' '}
                <span>Key Levels</span>
                {' '}
                <span>Fear & Greed</span>
                {' '}
                <span>L/S Ratio</span>
              </div>
              <a href="/reports" className="view-reports-btn">
                View All Reports{' '}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </a>
            </div>
            <LatestReportCard />
          </div>
        </div>
      </section>
      <section className="roadmap" id="roadmap">
        <div className="container">
          <div className="section-header">
            <h2>Development Roadmap</h2>
            <p>From signals to full portfolio automation.</p>
          </div>
          <div className="roadmap-grid">
            <div className="phase-card complete">
              <div className="phase-number">Phase 1 — Complete</div>
              <h3>Capital Flow Filter</h3>
              <ul>
                <li>Multi-timeframe analysis</li>
                <li>Macro regime detection</li>
                <li>Manipulation alerts</li>
                <li>38 signal conditions</li>
              </ul>
            </div>
            <div className="phase-card active">
              <div className="phase-number">Phase 2 — Active</div>
              <h3>Signal Distribution</h3>
              <ul>
                <li>Telegram bot integration</li>
                <li>Real-time alert delivery</li>
                <li>Public signal channel</li>
                <li>Alert refinement</li>
              </ul>
            </div>
            <div className="phase-card">
              <div className="phase-number">Phase 3 — Upcoming</div>
              <h3>Capital Rotation System</h3>
              <ul>
                <li>Dynamic allocation engine</li>
                <li>Regime-based weighting</li>
                <li>Portfolio rebalance signals</li>
                <li>Multi-asset tracking</li>
              </ul>
            </div>
            <div className="phase-card">
              <div className="phase-number">Phase 4 — Future</div>
              <h3>Full Automation</h3>
              <ul>
                <li>WunderTrading integration</li>
                <li>Automated position sizing</li>
                <li>Auto-rebalancing</li>
                <li>Bot portfolio management</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="cta">
        <div className="cta-box">
          <h2>Get Capital Flow Signals Free</h2>
          <p>
            Join our Telegram channel for real-time trading signals powered by institutional-grade capital flow analysis.
          </p>
          <a href="https://t.me/fivedaytrader" target="_blank" className="telegram-btn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"></path>
            </svg>
            {' '}Join Telegram Channel
          </a>
        </div>
      </section>
      <footer>
        <div className="footer-links">
          <a href="/about">About</a>
          {' '}
          <a href="/oscillator">Oscillator</a>
          {' '}
          <a href="/strategies">Strategies</a>
          {' '}
          <a href="/methodology">Methodology</a>
          {' '}
          <a href="/reports">Reports</a>
          {' '}
          <a href="https://mdxalgo.com/?ref=CsMGq" target="_blank">MDX ALGO</a>
          {' '}
          <a href="https://t.me/fivedaytrader" target="_blank">Telegram</a>
          {' '}
          <a href="https://twitter.com/MDX_ALGO" target="_blank">Twitter</a>
          {' '}
          <a href="/privacy">Privacy Policy</a>
          {' '}
          <a href="/disclaimer">Disclaimer</a>
        </div>
        <div style={{ maxWidth: "600px", margin: "0 auto 1.5rem", padding: "1rem", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid var(--dark-border)" }}>
          <p style={{ color: "var(--gray-light)", fontSize: "0.75rem", margin: "0" }}>
            <strong style={{ color: "var(--orange)" }}>Disclosure:</strong>
            {' '}Capital Flow Filter is a free, independent indicator created by a member of the MDX ALGO community. It is not an official MDX ALGO product. Inspired by the MDX Capital Flow Index methodology. Links to MDX ALGO are affiliate links — I'm a paying member and genuine fan of their platform.
          </p>
        </div>
        <p className="copyright">Built by traders, for traders.</p>
        <p className="copyright" style={{ marginTop: "1rem", fontSize: "0.75rem" }}>
          Trading cryptocurrencies involves substantial risk. Past performance is not indicative of future results.{' '}
          <a href="/disclaimer" className="mdx-link">Read full disclaimer</a>
          .
        </p>
      </footer>
      <SuggestWidget />
      <ScrollToTop />
    </>
  );
}
