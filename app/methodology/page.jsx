import './methodology.css';
import Logo from '../components/Logo';
import SuggestWidget from '../components/SuggestWidget';

export const metadata = {
  title: "Methodology | Capital Flow Filter",
  description: "Deep dive into the Capital Flow Filter methodology. Understand why each input was chosen and how they work together."
};

export default function MethodologyPage() {
  return (
    <>
      <nav>
        <div className="nav-content">
          <a href="/" className="logo">
            <Logo />
            {' '}Capital Flow
          </a>
          {' '}
          <a href="/" className="back-link">← Back to Home</a>
        </div>
      </nav>
      <div className="container">
        <div className="page-header">
          <span className="page-badge">Deep Dive</span>
          <h1>Methodology</h1>
          <p className="subtitle">
            Understanding why each input was chosen and how they work together to track capital rotation
          </p>
        </div>
        <div className="section-card">
          <h3>The Core Philosophy</h3>
          <p>
            Capital Flow Filter is built on a simple premise:{' '}
            <strong>price follows money</strong>
            . Before crypto moves, capital rotates across macro assets, between risk-on and risk-off positions, and within crypto sectors.
          </p>
          <p>
            By tracking these flows across 8 carefully selected inputs, we can identify the direction of capital rotation before it fully manifests in price. Each input was chosen based on:
          </p>
          <ul style={{ color: "var(--gray-light)", paddingLeft: "1.5rem", marginTop: "1rem" }}>
            <li>
              <strong>Correlation</strong>
              {' '}— Does it consistently lead or coincide with crypto moves?
            </li>
            <li>
              <strong>Data availability</strong>
              {' '}— Is it accessible on TradingView across timeframes?
            </li>
            <li>
              <strong>Signal clarity</strong>
              {' '}— Does it provide clear directional information?
            </li>
            <li>
              <strong>Non-redundancy</strong>
              {' '}— Does it add unique information vs other inputs?
            </li>
          </ul>
        </div>
        <h2>Current Inputs (v4.5.1)</h2>
        <p>
          The indicator tracks 8 assets across 3 categories. Each is analyzed for rate-of-change across multiple timeframes, then weighted by its recent predictive accuracy.
        </p>
        <div className="input-category">
          <div className="category-header">
            <div className="category-icon macro">🌍</div>
            <div>
              <div className="category-title">Macro (4 inputs)</div>
              <div className="category-subtitle">Traditional finance risk sentiment</div>
            </div>
          </div>
          <div className="input-grid">
            <div className="input-card">
              <div className="input-header">
                <span className="input-name">DXY (Dollar Index)</span>
                {' '}
                <span className="input-tag risk-off">Risk-Off</span>
              </div>
              <p className="input-description">
                Measures USD strength against a basket of major currencies. Dollar strength typically pressures risk assets including crypto.
              </p>
              <div className="input-signals">
                <span className="signal-pill">
                  <span className="down">↓</span>
                  {' '}DXY falling = Bullish crypto
                </span>
                {' '}
                <span className="signal-pill">
                  <span className="up">↑</span>
                  {' '}DXY rising = Bearish crypto
                </span>
              </div>
            </div>
            <div className="input-card">
              <div className="input-header">
                <span className="input-name">VIX (Volatility Index)</span>
                {' '}
                <span className="input-tag risk-off">Risk-Off</span>
              </div>
              <p className="input-description">
                The "fear gauge" for traditional markets. High VIX indicates market stress and risk-off sentiment that spills into crypto.
              </p>
              <div className="input-signals">
                <span className="signal-pill">
                  <span className="down">↓</span>
                  {' '}VIX falling = Bullish crypto
                </span>
                {' '}
                <span className="signal-pill">
                  <span className="up">↑</span>
                  {' '}VIX spiking = Bearish crypto
                </span>
              </div>
            </div>
            <div className="input-card">
              <div className="input-header">
                <span className="input-name">Gold (XAUUSD)</span>
                {' '}
                <span className="input-tag risk-off">Risk-Off</span>
              </div>
              <p className="input-description">
                Classic safe haven asset. When capital flows to gold, it often flows away from risk assets. Gold and BTC sometimes compete as "digital gold."
              </p>
              <div className="input-signals">
                <span className="signal-pill">
                  <span className="down">↓</span>
                  {' '}Gold falling = Bullish crypto
                </span>
                {' '}
                <span className="signal-pill">
                  <span className="up">↑</span>
                  {' '}Gold rising = Bearish crypto
                </span>
              </div>
            </div>
            <div className="input-card">
              <div className="input-header">
                <span className="input-name">US10Y (10-Year Yields)</span>
                {' '}
                <span className="input-tag risk-off">Risk-Off</span>
              </div>
              <p className="input-description">
                Rising yields increase the opportunity cost of holding non-yielding assets like crypto. Yield spikes often precede risk-off moves.
              </p>
              <div className="input-signals">
                <span className="signal-pill">
                  <span className="down">↓</span>
                  {' '}Yields falling = Bullish crypto
                </span>
                {' '}
                <span className="signal-pill">
                  <span className="up">↑</span>
                  {' '}Yields rising = Bearish crypto
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="input-category">
          <div className="category-header">
            <div className="category-icon crypto">₿</div>
            <div>
              <div className="category-title">Crypto Leaders (2 inputs)</div>
              <div className="category-subtitle">Market leaders that set the tone</div>
            </div>
          </div>
          <div className="input-grid">
            <div className="input-card">
              <div className="input-header">
                <span className="input-name">BTC (Bitcoin)</span>
                {' '}
                <span className="input-tag leader">Leader</span>
              </div>
              <p className="input-description">
                The market leader. BTC sets the overall crypto market direction. Institutional flows typically hit BTC first before rotating elsewhere.
              </p>
              <div className="input-signals">
                <span className="signal-pill">
                  <span className="up">↑</span>
                  {' '}BTC rising = Bullish
                </span>
                {' '}
                <span className="signal-pill">
                  <span className="down">↓</span>
                  {' '}BTC falling = Bearish
                </span>
              </div>
            </div>
            <div className="input-card">
              <div className="input-header">
                <span className="input-name">ETH (Ethereum)</span>
                {' '}
                <span className="input-tag leader">Leader</span>
              </div>
              <p className="input-description">
                The second leader and DeFi backbone. ETH strength often precedes altcoin rotation. ETH/BTC ratio is a key risk-on indicator.
              </p>
              <div className="input-signals">
                <span className="signal-pill">
                  <span className="up">↑</span>
                  {' '}ETH rising = Bullish
                </span>
                {' '}
                <span className="signal-pill">
                  <span className="down">↓</span>
                  {' '}ETH falling = Bearish
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="input-category">
          <div className="category-header">
            <div className="category-icon sector">📊</div>
            <div>
              <div className="category-title">Sector Rotation (2 inputs)</div>
              <div className="category-subtitle">Where is capital sitting within crypto?</div>
            </div>
          </div>
          <div className="input-grid">
            <div className="input-card">
              <div className="input-header">
                <span className="input-name">BTC.D (BTC Dominance)</span>
                {' '}
                <span className="input-tag rotation">Rotation</span>
              </div>
              <p className="input-description">
                Percentage of total crypto market cap in BTC. Rising dominance = flight to safety. Falling dominance = capital rotating to alts.
              </p>
              <div className="input-signals">
                <span className="signal-pill">
                  <span className="down">↓</span>
                  {' '}BTC.D falling = Bullish alts
                </span>
                {' '}
                <span className="signal-pill">
                  <span className="up">↑</span>
                  {' '}BTC.D rising = Risk-off / BTC only
                </span>
              </div>
            </div>
            <div className="input-card">
              <div className="input-header">
                <span className="input-name">TOTAL3 (Alt Market Cap)</span>
                {' '}
                <span className="input-tag rotation">Rotation</span>
              </div>
              <p className="input-description">
                Total altcoin market cap excluding BTC and ETH. Direct measure of capital in the alt sector. Rising TOTAL3 = alt season conditions.
              </p>
              <div className="input-signals">
                <span className="signal-pill">
                  <span className="up">↑</span>
                  {' '}TOTAL3 rising = Bullish alts
                </span>
                {' '}
                <span className="signal-pill">
                  <span className="down">↓</span>
                  {' '}TOTAL3 falling = Bearish alts
                </span>
              </div>
            </div>
          </div>
        </div>
        <h2>Alternative Inputs Under Consideration</h2>
        <p>
          We're continuously evaluating additional inputs that could improve signal accuracy or enable instrument-specific tuning. Here's what's on our radar:
        </p>
        <h3>Macro Alternatives</h3>
        <table className="alt-table">
          <thead>
            <tr>
              <th>Input</th>
              <th>Use Case</th>
              <th>Trade-off vs Current</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="ticker">USDT.D</td>
              <td>Stablecoin dominance as crypto-native fear gauge</td>
              <td>More reactive than DXY but noisier on lower TFs</td>
              <td>
                <span className="status testing">Testing</span>
              </td>
            </tr>
            <tr>
              <td className="ticker">MOVE</td>
              <td>Bond market volatility (like VIX for bonds)</td>
              <td>May lead crypto better during rate-driven moves</td>
              <td>
                <span className="status planned">Planned</span>
              </td>
            </tr>
            <tr>
              <td className="ticker">TLT</td>
              <td>Long-term treasury ETF as risk-off proxy</td>
              <td>More direct yield play; Gold has inflation angle</td>
              <td>
                <span className="status planned">Planned</span>
              </td>
            </tr>
            <tr>
              <td className="ticker">US02Y</td>
              <td>2-year yields (more Fed sensitive)</td>
              <td>Faster reaction to Fed; 10Y shows structural trends</td>
              <td>
                <span className="status planned">Planned</span>
              </td>
            </tr>
            <tr>
              <td className="ticker">SPX / NDX</td>
              <td>Direct equity correlation</td>
              <td>Crypto increasingly trades like tech stocks</td>
              <td>
                <span className="status testing">Testing</span>
              </td>
            </tr>
          </tbody>
        </table>
        <h3>Crypto Alternatives</h3>
        <table className="alt-table">
          <thead>
            <tr>
              <th>Input</th>
              <th>Use Case</th>
              <th>Trade-off vs Current</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="ticker">SOL</td>
              <td>L1 rotation leader, retail activity proxy</td>
              <td>Could complement ETH for alt rotation signals</td>
              <td>
                <span className="status testing">Testing</span>
              </td>
            </tr>
            <tr>
              <td className="ticker">TOTAL2</td>
              <td>All alts including ETH</td>
              <td>Better when ETH leads rotation vs TOTAL3</td>
              <td>
                <span className="status planned">Planned</span>
              </td>
            </tr>
            <tr>
              <td className="ticker">OTHERS.D</td>
              <td>Non-top-10 dominance</td>
              <td>Better for small cap alt season detection</td>
              <td>
                <span className="status planned">Planned</span>
              </td>
            </tr>
          </tbody>
        </table>
        <h3>On-Chain / Derivatives (Future)</h3>
        <table className="alt-table">
          <thead>
            <tr>
              <th>Input</th>
              <th>Use Case</th>
              <th>Trade-off</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="ticker">Funding Rates</td>
              <td>Leverage sentiment, crypto-native fear gauge</td>
              <td>Could replace VIX for pure crypto analysis</td>
              <td>
                <span className="status planned">Planned</span>
              </td>
            </tr>
            <tr>
              <td className="ticker">Open Interest</td>
              <td>Positioning and conviction levels</td>
              <td>Shows leverage buildup before liquidation cascades</td>
              <td>
                <span className="status planned">Planned</span>
              </td>
            </tr>
            <tr>
              <td className="ticker">Exchange Flows</td>
              <td>Direct accumulation/distribution</td>
              <td>Most direct signal but data availability varies</td>
              <td>
                <span className="status planned">Planned</span>
              </td>
            </tr>
          </tbody>
        </table>
        <h2>Instrument-Specific Presets (Roadmap)</h2>
        <p>
          Different assets respond to different inputs. A BTC-focused trader needs heavy macro weighting, while an alt trader cares more about sector rotation. We're building presets for this:
        </p>
        <div className="presets-grid">
          <div className="preset-card">
            <div className="preset-icon">₿</div>
            <div className="preset-name">BTC Macro</div>
            <p className="preset-desc">Heavy macro weighting for BTC trading</p>
            <div className="preset-inputs">
              <span className="preset-input">DXY 1.5x</span>
              {' '}
              <span className="preset-input">VIX 1.5x</span>
              {' '}
              <span className="preset-input">US10Y 1.2x</span>
              {' '}
              <span className="preset-input">SPX</span>
            </div>
            <span className="preset-badge">Coming Soon</span>
          </div>
          <div className="preset-card">
            <div className="preset-icon">⟠</div>
            <div className="preset-name">ETH Balanced</div>
            <p className="preset-desc">Balanced macro + DeFi rotation signals</p>
            <div className="preset-inputs">
              <span className="preset-input">BTC</span>
              {' '}
              <span className="preset-input">BTC.D</span>
              {' '}
              <span className="preset-input">DXY</span>
              {' '}
              <span className="preset-input">TOTAL3</span>
            </div>
            <span className="preset-badge">Coming Soon</span>
          </div>
          <div className="preset-card">
            <div className="preset-icon">🚀</div>
            <div className="preset-name">Alt Season</div>
            <p className="preset-desc">Sector rotation focus for altcoin trading</p>
            <div className="preset-inputs">
              <span className="preset-input">BTC.D 1.5x</span>
              {' '}
              <span className="preset-input">TOTAL3 1.5x</span>
              {' '}
              <span className="preset-input">ETH</span>
              {' '}
              <span className="preset-input">OTHERS.D</span>
            </div>
            <span className="preset-badge">Coming Soon</span>
          </div>
          <div className="preset-card">
            <div className="preset-icon">◎</div>
            <div className="preset-name">L1 Rotation</div>
            <p className="preset-desc">Track capital flow between L1 chains</p>
            <div className="preset-inputs">
              <span className="preset-input">ETH</span>
              {' '}
              <span className="preset-input">SOL</span>
              {' '}
              <span className="preset-input">BTC.D</span>
              {' '}
              <span className="preset-input">TOTAL3</span>
            </div>
            <span className="preset-badge">Coming Soon</span>
          </div>
          <div className="preset-card">
            <div className="preset-icon">🎰</div>
            <div className="preset-name">Degen Mode</div>
            <p className="preset-desc">Max sensitivity for meme/small cap trading</p>
            <div className="preset-inputs">
              <span className="preset-input">OTHERS.D</span>
              {' '}
              <span className="preset-input">Funding</span>
              {' '}
              <span className="preset-input">TOTAL3</span>
              {' '}
              <span className="preset-input">USDT.D</span>
            </div>
            <span className="preset-badge">Coming Soon</span>
          </div>
          <div className="preset-card">
            <div className="preset-icon">🏛️</div>
            <div className="preset-name">TradFi Correlated</div>
            <p className="preset-desc">For when crypto trades like tech stocks</p>
            <div className="preset-inputs">
              <span className="preset-input">SPX 1.5x</span>
              {' '}
              <span className="preset-input">NDX</span>
              {' '}
              <span className="preset-input">VIX</span>
              {' '}
              <span className="preset-input">DXY</span>
            </div>
            <span className="preset-badge">Coming Soon</span>
          </div>
        </div>
        <div className="framework-box">
          <div className="framework-title">Input Evaluation Framework</div>
          <p style={{ marginBottom: "1rem" }}>When evaluating new inputs, we ask:</p>
          <ul className="framework-list">
            <li>
              <strong>Predictive value:</strong>
              {' '}Does it lead crypto price action or just coincide?
            </li>
            <li>
              <strong>Consistency:</strong>
              {' '}Does it work across different market regimes?
            </li>
            <li>
              <strong>Timeframe stability:</strong>
              {' '}Is it reliable on both scalp and swing timeframes?
            </li>
            <li>
              <strong>Data quality:</strong>
              {' '}Is it available on TradingView with clean, continuous data?
            </li>
            <li>
              <strong>Uniqueness:</strong>
              {' '}Does it add information not captured by existing inputs?
            </li>
            <li>
              <strong>Interpretability:</strong>
              {' '}Is the signal logic clear and explainable?
            </li>
          </ul>
        </div>
        <h2>Development Roadmap</h2>
        <div className="section-card">
          <div className="roadmap-item">
            <div className="roadmap-phase">
              <span className="phase-badge now">Now</span>
            </div>
            <div className="roadmap-content">
              <h4>v4.5.x — Performance Tracking</h4>
              <p>
                Built-in win rate tracking, timeframe scanning, and self-calibrating correlation weights. Currently live.
              </p>
            </div>
          </div>
          <div className="roadmap-item">
            <div className="roadmap-phase">
              <span className="phase-badge next">Next</span>
            </div>
            <div className="roadmap-content">
              <h4>v4.6 — Alternative Input Testing</h4>
              <p>
                Add USDT.D, SOL, and SPX as optional inputs. Compare performance against current set. User-selectable inputs.
              </p>
            </div>
          </div>
          <div className="roadmap-item">
            <div className="roadmap-phase">
              <span className="phase-badge next">Next</span>
            </div>
            <div className="roadmap-content">
              <h4>v4.7 — Instrument Presets</h4>
              <p>
                Pre-configured input combinations optimized for BTC, ETH, alts, and specific trading styles.
              </p>
            </div>
          </div>
          <div className="roadmap-item">
            <div className="roadmap-phase">
              <span className="phase-badge future">Future</span>
            </div>
            <div className="roadmap-content">
              <h4>v5.0 — On-Chain Integration</h4>
              <p>
                Add funding rates, open interest, and exchange flow data for crypto-native sentiment analysis.
              </p>
            </div>
          </div>
        </div>
        <div className="cta-section">
          <h3>Help Shape the Methodology</h3>
          <p style={{ color: "var(--gray-light)" }}>
            Have ideas for inputs we should test? Trading a specific instrument and want a custom preset? Let us know.
          </p>
          <div className="cta-buttons">
            <a href="https://t.me/fivedaytrader" target="_blank" className="btn btn-primary">Join the Discussion</a>
            {' '}
            <a href="/strategies" className="btn btn-secondary">View Strategies</a>
          </div>
        </div>
      </div>
      <footer>
        <div className="footer-links">
          <a href="/">Home</a>
          {' '}
          <a href="/about">About</a>
          {' '}
          <a href="/methodology">Methodology</a>
          {' '}
          <a href="/signals">Live Signals</a>
          {' '}
          <a href="/strategies">Strategies</a>
          {' '}
          <a href="/reports">Reports</a>
        </div>
        <p className="copyright">Built by traders, for traders.</p>
      </footer>
      <SuggestWidget />
    </>
  );
}
