import './home.css';
import Logo from '../components/Logo';
import ScrollToTop from '../components/ScrollToTop';
import SignalsFeed from '../components/SignalsFeed';
import FearGreedWidget from '../components/FearGreedWidget';
import LongShortWidget from '../components/LongShortWidget';
import EconomicCalendarWidget from '../components/EconomicCalendarWidget';
import SuggestWidget from '../components/SuggestWidget';

export const metadata = {
  title: "Live Signals | Capital Flow",
  description: "Capital Flow Oscillator alerts on BTC 1H, as posted to the free Telegram channel, alongside Fear & Greed, long/short positioning and the economic calendar.",
  openGraph: {
    title: "Capital Flow live signals",
    description: "CF Osc alerts on BTC 1H, plus sentiment, positioning and the economic calendar",
    type: "website"
  }
};

export default function SignalsPage() {
  return (
    <>
      <nav>
        <div className="nav-content">
          <a href="/" className="logo">
            <Logo />
            {' '}Capital Flow
          </a>
          <div className="nav-links">
            <a href="#live-feed">Feed</a>
            {' '}
            <a href="#alerts">Alerts</a>
            {' '}
            <a href="#sentiment">Sentiment</a>
            {' '}
            <a href="#calendar">Calendar</a>
            {' '}
            <a href="/">Oscillator</a>
            {' '}
            <a href="/reports">Reports</a>
            {' '}
            <a href="/about">About</a>
            {' '}
            <a href="https://t.me/fivedaytrader" target="_blank" className="nav-cta">Join Telegram</a>
          </div>
        </div>
      </nav>
      <section className="hero">
        <div className="hero-content">
          <div className="badge">Channel alerts from the CF Osc</div>
          <h1>
            Live signals
            <br />
            {' '}
            <span className="gradient-text">in market context</span>
          </h1>
          <p>
            The Capital Flow Oscillator's alerts on BTC 1H, the same ones the Telegram channel gets, next to the backdrop that moves them: sentiment, positioning and the economic calendar.
          </p>
          <div className="hero-buttons">
            <a href="https://t.me/fivedaytrader" target="_blank" className="btn btn-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"></path>
              </svg>
              {' '}Join the Telegram channel
            </a>
            {' '}
            <a href="/" className="btn btn-secondary">Get the indicator</a>
          </div>
          <div className="stats-bar">
            <div className="stat">
              <div className="stat-value">BTC 1H</div>
              <div className="stat-label">Chart the alerts run on</div>
            </div>
            <div className="stat">
              <div className="stat-value">4</div>
              <div className="stat-label">Alert types posted</div>
            </div>
            <div className="stat">
              <div className="stat-value">8</div>
              <div className="stat-label">Markets in the capital flow score</div>
            </div>
            <div className="stat">
              <div className="stat-value">Free</div>
              <div className="stat-label">Indicator and channel</div>
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
          <p className="feed-subtitle">Every alert the Telegram channel received, shown here 24 hours later. Posts from before 16 October 2026 came from the older Capital Flow Filter overlay.</p>
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
      <section className="signals" id="alerts">
        <div className="container">
          <div className="section-header">
            <h2>What the channel posts</h2>
            <p>
              Alerts come from the Capital Flow Oscillator on the BTC 1H chart, on closed candles only. Only the strongest signals are posted.
            </p>
          </div>
          <div className="signal-grid">
            <div className="signal-card">
              <span className="signal-icon" style={{ color: "var(--brand)" }}>◉</span>
              <div className="signal-info">
                <h4>Capital Flow long / short</h4>
                <p>The signature signal: momentum turns from a stretched level, money flow turns with it, and capital flow is on the same side.</p>
              </div>
            </div>
            <div className="signal-card">
              <span className="signal-icon"><span style={{ color: "var(--green)" }}>▲</span><span style={{ color: "var(--red)" }}>▼</span></span>
              <div className="signal-info">
                <h4>A-grade long / short</h4>
                <p>A wave turn that passes the strongest checks: stretched wave, higher-timeframe wave, money flow, capital flow, recent divergence.</p>
              </div>
            </div>
            <div className="signal-card">
              <span className="signal-icon" style={{ color: "#4aa3ff" }}>◆</span>
              <div className="signal-info">
                <h4>Blue Wave long / short</h4>
                <p>A deep dip, then a shallower second one, with money flow already moving the trade's way.</p>
              </div>
            </div>
            <div className="signal-card">
              <span className="signal-icon" style={{ color: "var(--gray-light)" }}>×</span>
              <div className="signal-info">
                <h4>Capital flow turned against</h4>
                <p>The macro and crypto inputs have flipped against the last long or short. A prompt to review it, not an automatic exit.</p>
              </div>
            </div>
          </div>
          <div className="signal-example">
            <span className="signal-example-label">Example message</span>
            <pre>{"🟢 A-grade LONG · BTCUSDT.P 1H\nPrice 81,689.7\nWhy: turned up from oversold, 4H wave rising, buyers stepping in, capital flow bullish\nCapital flow bullish +14% (4 of 8 markets agree)"}</pre>
          </div>
          <p className="signals-note">
            Signals are information, not advice. There's no track record published yet; read each one against the chart and your own plan.
            {' '}<a href="/">How the oscillator works →</a>
          </p>
        </div>
      </section>
      <section className="sentiment-section" id="sentiment">
        <div className="container">
          <div className="sentiment-header">
            <h2>Market Sentiment</h2>
            <p>What the crowd is doing. Useful as a contrarian check on a signal, not as a signal on its own.</p>
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
                  {' '}= Longs have the crowd on the other side
                </span>
              </div>
              <div className="sentiment-rule">
                <span className="sentiment-rule-icon">✅</span>
                {' '}
                <span>
                  <strong>Bearish + Greed/Retail Long</strong>
                  {' '}= Shorts have the crowd on the other side
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
                  {' '}= Signal and sentiment pointing opposite ways
                </span>
              </div>
            </div>
            <p className="sentiment-source">
              Data:{' '}
              <a href="https://alternative.me/crypto/fear-and-greed-index/" target="_blank">Alternative.me</a>
              {' '}&{' '}
              <a href="https://www.okx.com/trade-market/data" target="_blank">OKX</a> (BTC long/short accounts)
            </p>
          </div>
        </div>
      </section>
      <section className="econ-cal-section" id="calendar">
        <div className="container">
          <div className="econ-cal-header-section">
            <h2>Economic Calendar</h2>
            <p>High-impact events that move every market the capital flow engine reads: rate decisions, CPI, jobs data. The channel gets a heads-up each morning on days with big releases.</p>
          </div>
          <div className="econ-cal-container">
            <EconomicCalendarWidget />
          </div>
        </div>
      </section>
      <section className="cta">
        <div className="cta-box">
          <h2>Get the alerts as they happen</h2>
          <p>
            The Telegram channel gets every CF Osc alert the moment the 1H candle closes. Free, no sign-up.
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
          <a href="/">Oscillator</a>
          {' '}
          <a href="/strategies">Strategies</a>
          {' '}
          <a href="/methodology">Methodology</a>
          {' '}
          <a href="/reports">Reports</a>
          {' '}
          <a href="https://t.me/fivedaytrader" target="_blank">Telegram</a>
          {' '}
          <a href="/privacy">Privacy Policy</a>
          {' '}
          <a href="/disclaimer">Disclaimer</a>
        </div>
        <div style={{ maxWidth: "600px", margin: "0 auto 1.5rem", padding: "1rem", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid var(--dark-border)" }}>
          <p style={{ color: "var(--gray-light)", fontSize: "0.75rem", margin: "0" }}>
            <strong style={{ color: "var(--brand)" }}>Disclosure:</strong>
            {' '}Capital Flow is a free, independent project.
          </p>
        </div>
        <p className="copyright">Built by traders, for traders.</p>
        <p className="copyright" style={{ marginTop: "1rem", fontSize: "0.75rem" }}>
          Trading cryptocurrencies involves substantial risk. Past performance is not indicative of future results.{' '}
          <a href="/disclaimer" className="footer-link">Read full disclaimer</a>
          .
        </p>
      </footer>
      <SuggestWidget />
      <ScrollToTop />
    </>
  );
}
