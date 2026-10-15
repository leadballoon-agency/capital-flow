import './about.css';
import SuggestWidget from '../components/SuggestWidget';

export const metadata = {
  title: "About Capital Flow Filter | Free Crypto Trading Signals",
  description: "Learn how the Capital Flow Filter indicator works and why tracking capital rotation matters for crypto trading."
};

export default function AboutPage() {
  return (
    <>
      <nav>
        <div className="nav-content">
          <a href="/" className="logo">
            <span className="logo-icon">CF</span>
            {' '}Capital Flow
          </a>
          {' '}
          <a href="/" className="back-link">← Back to Home</a>
        </div>
      </nav>
      <div className="container">
        <span className="beta-badge">🚀 Beta Release</span>
        <h1>Understanding Capital Flow</h1>
        <p className="subtitle">Why tracking where money moves is the edge most traders are missing</p>
        <div className="highlight-box beta">
          <p>
            <strong>This project is currently in beta.</strong>
            {' '}We're actively developing and improving the Capital Flow Filter. Your feedback is invaluable in helping us build something truly useful for the trading community. If you have suggestions, find bugs, or want to share how you're using the signals, please reach out via our{' '}
            <a href="https://t.me/fivedaytrader" target="_blank">Telegram channel</a>
            .
          </p>
        </div>
        <h2>The Problem with Traditional Analysis</h2>
        <p>
          Most traders focus on price action alone. They draw lines, spot patterns, and try to predict where price will go next. But here's what they're missing:{' '}
          <strong>price follows money</strong>
          .
        </p>
        <p>
          Before a big move happens, capital starts flowing. Institutions don't just wake up and buy — they rotate capital from one asset class to another based on risk appetite, macro conditions, and sector strength. By the time price "breaks out," the smart money is already positioned.
        </p>
        <h2>What is Capital Flow?</h2>
        <p>
          Capital flow analysis tracks where money is moving across different asset classes and market sectors. Instead of just looking at Bitcoin's price, we ask:{' '}
          <strong>Where is capital rotating right now?</strong>
        </p>
        <div className="signal-grid">
          <div className="signal-card">
            <div className="signal-card-header">🌍 Macro Flow</div>
            <p>Is money flowing into risk assets or safe havens? We track DXY, VIX, Gold, and Yields.</p>
          </div>
          <div className="signal-card">
            <div className="signal-card-header">₿ Crypto Leaders</div>
            <p>Are BTC and ETH seeing inflows? Leaders move first, alts follow.</p>
          </div>
          <div className="signal-card">
            <div className="signal-card-header">📈 Sector Rotation</div>
            <p>Is money favoring majors (BTC dominance) or rotating into alts (TOTAL3)?</p>
          </div>
          <div className="signal-card">
            <div className="signal-card-header">🎯 Confluence</div>
            <p>When all signals align, conviction is highest. 8/8 alignment is rare and powerful.</p>
          </div>
        </div>
        <h2>How the Capital Flow Filter Works</h2>
        <p>
          The indicator aggregates data from 8 different sources across multiple timeframes, then weights and combines them into a single, actionable signal:
        </p>
        <div className="flow-diagram">
          <span className="flow-step">📊 Macro Data</span>
          {' '}
          <span className="flow-step">₿ Crypto Data</span>
          {' '}
          <span className="flow-step">📈 Sector Data</span>
          {' '}
          <br />
          {' '}
          <span className="flow-arrow">↓</span>
          {' '}
          <br />
          {' '}
          <span className="flow-step">Multi-Timeframe Analysis</span>
          {' '}
          <br />
          {' '}
          <span className="flow-arrow">↓</span>
          {' '}
          <br />
          {' '}
          <span className="flow-step">Correlation Weighting</span>
          {' '}
          <br />
          {' '}
          <span className="flow-arrow">↓</span>
          {' '}
          <br />
          {' '}
          <span className="flow-step" style={{ background: "linear-gradient(135deg, var(--orange), var(--orange-light))", border: "none" }}>🎯 Capital Flow Signal</span>
        </div>
        <h3>The Data Sources</h3>
        <ul>
          <li>
            <strong>DXY (Dollar Index)</strong>
            {' '}— When the dollar weakens, risk assets like crypto typically benefit
          </li>
          <li>
            <strong>VIX (Volatility Index)</strong>
            {' '}— Low VIX = risk-on sentiment, high VIX = fear in the market
          </li>
          <li>
            <strong>Gold</strong>
            {' '}— Safe haven flows; money leaving gold often flows into risk assets
          </li>
          <li>
            <strong>US 10Y Yields</strong>
            {' '}— Rising yields can pressure risk assets; falling yields support them
          </li>
          <li>
            <strong>BTC Flow</strong>
            {' '}— Direct measurement of Bitcoin capital movement
          </li>
          <li>
            <strong>ETH Flow</strong>
            {' '}— Ethereum often leads altcoin rotations
          </li>
          <li>
            <strong>BTC Dominance</strong>
            {' '}— High dominance = majors favored; falling = alt season potential
          </li>
          <li>
            <strong>TOTAL3</strong>
            {' '}— Total altcoin market cap excluding BTC/ETH; measures alt sector strength
          </li>
        </ul>
        <h3>Signal Strength</h3>
        <p>The indicator produces a normalized score from -100% to +100%:</p>
        <ul>
          <li>
            <strong style={{ color: "var(--green)" }}>Full Send (70%+)</strong>
            {' '}— Strongest conviction, all systems go
          </li>
          <li>
            <strong style={{ color: "var(--green)" }}>Bullish (50%+)</strong>
            {' '}— Standard bullish signal
          </li>
          <li>
            <strong style={{ color: "var(--green)" }}>Lean Bull (20%+)</strong>
            {' '}— Early bullish indication
          </li>
          <li>
            <strong>Neutral</strong>
            {' '}— Mixed signals, no clear direction
          </li>
          <li>
            <strong style={{ color: "var(--red)" }}>Lean Bear (-20%)</strong>
            {' '}— Early bearish indication
          </li>
          <li>
            <strong style={{ color: "var(--red)" }}>Bearish (-50%)</strong>
            {' '}— Standard bearish signal
          </li>
          <li>
            <strong style={{ color: "var(--red)" }}>Full Send (-70%)</strong>
            {' '}— Strongest bearish conviction
          </li>
        </ul>
        <h2>Performance Tracking</h2>
        <p>
          One of the most powerful features of Capital Flow Filter is the built-in{' '}
          <strong>performance tracking system</strong>
          . The indicator tracks its own signal accuracy in real-time, showing you:
        </p>
        <div className="signal-grid">
          <div className="signal-card">
            <div className="signal-card-header">📊 Win Rate</div>
            <p>Percentage of signals that correctly predicted direction over a rolling window.</p>
          </div>
          <div className="signal-card">
            <div className="signal-card-header">✓ Last Signal</div>
            <p>Result of the most recent signal — did it win or lose, and by how much?</p>
          </div>
          <div className="signal-card">
            <div className="signal-card-header">🔥 Streak</div>
            <p>Current consecutive wins or losses to gauge momentum of signal accuracy.</p>
          </div>
          <div className="signal-card">
            <div className="signal-card-header">🎯 Timeframe Scanning</div>
            <p>Compare win rates across timeframes to find where signals perform best right now.</p>
          </div>
        </div>
        <h3>How to Use Timeframe Scanning</h3>
        <p>This is one of the most valuable techniques for finding your edge:</p>
        <ol>
          <li>
            <strong>Flip through timeframes</strong>
            {' '}— Check 3m, 15m, 1H, 4H, Daily
          </li>
          <li>
            <strong>Compare win rates</strong>
            {' '}— Note which timeframes show higher accuracy
          </li>
          <li>
            <strong>Focus your trading</strong>
            {' '}— Trade the timeframe with the best current performance
          </li>
        </ol>
        <p>
          For example, if you see Daily at 31% but 1H at 52%, the shorter timeframes are more reliable in current conditions. This often happens during choppy, range-bound markets where shorter signals adapt faster.
        </p>
        <h3>Auto-Scaling Lookback</h3>
        <p>The performance window automatically adjusts based on your trading mode:</p>
        <ul>
          <li>
            <strong>Scalp Mode:</strong>
            {' '}Last 20 signals — fast adaptation
          </li>
          <li>
            <strong>Intraday Mode:</strong>
            {' '}Last 50 signals — balanced view
          </li>
          <li>
            <strong>Swing Mode:</strong>
            {' '}Last 100 signals — stable long-term accuracy
          </li>
        </ul>
        <h3>Timeframe Comparison Example</h3>
        <p>Here's what scanning across timeframes looks like in practice:</p>
        <div className="tf-gallery">
          <div className="tf-gallery-item">
            <img src="/images/5minute-BTC.png" alt="5 Minute Chart" />
            <div className="tf-gallery-label">
              <span className="tf-name">5m Scalp</span>
              {' '}
              <span className="tf-rate low">23%</span>
            </div>
          </div>
          <div className="tf-gallery-item">
            <img src="/images/15minute-btc.png" alt="15 Minute Chart" />
            <div className="tf-gallery-label">
              <span className="tf-name">15m Scalp</span>
              {' '}
              <span className="tf-rate low">30%</span>
            </div>
          </div>
          <div className="tf-gallery-item best">
            <img src="/images/1HBTC.png" alt="1 Hour Chart" />
            <div className="tf-gallery-label">
              <span className="tf-name">1H Intraday</span>
              {' '}
              <span className="tf-rate high">44%</span>
              {' '}
              <span className="tf-best-badge">Best</span>
            </div>
          </div>
          <div className="tf-gallery-item">
            <img src="/images/4H-BTC.png" alt="4 Hour Chart" />
            <div className="tf-gallery-label">
              <span className="tf-name">4H Intraday</span>
              {' '}
              <span className="tf-rate mid">38%</span>
            </div>
          </div>
          <div className="tf-gallery-item">
            <img src="/images/daily-BTC.png" alt="Daily Chart" />
            <div className="tf-gallery-label">
              <span className="tf-name">Daily Swing</span>
              {' '}
              <span className="tf-rate low">31%</span>
            </div>
          </div>
        </div>
        <p style={{ marginTop: "1rem" }}>
          <strong>Takeaway:</strong>
          {' '}In this example, the 1H timeframe has the best win rate (44%), suggesting intraday signals are more reliable than swing signals in current market conditions.
        </p>
        <h3>Different Timeframes, Different Uses</h3>
        <p>
          Don't judge all timeframes by win rate alone. The indicator serves{' '}
          <strong>different purposes</strong>
          {' '}depending on timeframe:
        </p>
        <div className="signal-grid">
          <div className="signal-card">
            <div className="signal-card-header">1m-5m Scalping</div>
            <p>
              <strong>Cloud as dynamic S/R</strong>
              {' '}— Watch for bounces off cloud edges. Flip dots mark entry/exit points. Cloud color tells you to hold or take profit. Win rate less important here.
            </p>
          </div>
          <div className="signal-card">
            <div className="signal-card-header">15m-1H Intraday</div>
            <p>
              <strong>Win rate matters</strong>
              {' '}— Follow signal direction for intraday swings. Cloud thickness shows conviction. Best balance of signal quality and trade frequency.
            </p>
          </div>
          <div className="signal-card">
            <div className="signal-card-header">4H Swing</div>
            <p>
              <strong>High conviction setups</strong>
              {' '}— Wait for Full Send (70%+) or Full Confluence signals. Fewer trades, higher quality. Good for position sizing decisions.
            </p>
          </div>
          <div className="signal-card">
            <div className="signal-card-header">Daily+ Macro</div>
            <p>
              <strong>Overall bias</strong>
              {' '}— Sets the backdrop for lower timeframe trades. Don't overtrade—use for directional context, not frequent entries.
            </p>
          </div>
        </div>
        <h2>Why This Matters for Your Trading</h2>
        <h3>1. Trade with the Flow, Not Against It</h3>
        <p>
          When capital is flowing into risk assets across all sectors, fighting that tide is swimming upstream. The Capital Flow Filter helps you align your trades with institutional money movement.
        </p>
        <h3>2. Better Risk Management</h3>
        <p>
          Knowing the macro environment helps you size positions appropriately. Full confluence? Consider larger size. Mixed signals? Trade smaller or sit out.
        </p>
        <h3>3. Earlier Entries and Exits</h3>
        <p>
          Capital often starts rotating before price confirms. The indicator can give you a heads up that conditions are shifting, allowing you to position ahead of the crowd.
        </p>
        <h3>4. Avoid Manipulation Traps</h3>
        <p>
          The indicator includes manipulation detection — identifying unusual volume patterns, wick hunting, and spoofing. When the market is playing games, you'll know.
        </p>
        <h3>5. Find Your Edge with Performance Tracking</h3>
        <p>
          Use the built-in win rate display to identify which timeframes are currently performing best. A dropping win rate signals changing market conditions — adjust your approach accordingly.
        </p>
        <h2>Daily Reports</h2>
        <p>
          Every day, we analyze the BTC 4H chart and publish a comprehensive Capital Flow report covering:
        </p>
        <ul>
          <li>Current signal and strength</li>
          <li>Macro conditions (DXY, VIX, Gold, Yields)</li>
          <li>Crypto leader flows (BTC, ETH)</li>
          <li>Sector rotation analysis</li>
          <li>Key support and resistance levels</li>
          <li>Daily, Weekly, and Monthly open analysis</li>
          <li>Actionable analysis for the next 24-48 hours</li>
        </ul>
        <p>
          Reports are posted to our{' '}
          <a href="https://t.me/fivedaytrader" target="_blank">Telegram channel</a>
          {' '}and archived on this website.
        </p>
        <div className="cta-section">
          <h3>Join the Community</h3>
          <p style={{ color: "var(--gray-light)" }}>
            Get daily signals, real-time alerts, and connect with other traders using Capital Flow analysis.
          </p>
          <div className="cta-buttons">
            <a href="https://t.me/fivedaytrader" target="_blank" className="btn btn-primary">Join Telegram</a>
            {' '}
            <a href="/reports" className="btn btn-secondary">View Reports</a>
          </div>
        </div>
        <div className="feedback-section">
          <h3>We Want Your Feedback</h3>
          <p>
            This project is in active development and we're building it for traders like you. Here's how you can help:
          </p>
          <ul>
            <li>
              <strong>Bug reports</strong>
              {' '}— Something not working? Let us know
            </li>
            <li>
              <strong>Feature requests</strong>
              {' '}— What would make this more useful for you?
            </li>
            <li>
              <strong>Signal feedback</strong>
              {' '}— How are the signals performing for your trading style?
            </li>
            <li>
              <strong>Use cases</strong>
              {' '}— Tell us how you're incorporating Capital Flow into your strategy
            </li>
          </ul>
          <p>
            Reach out via{' '}
            <a href="https://t.me/fivedaytrader" target="_blank">Telegram</a>
            {' '}— we read every message.
          </p>
        </div>
        <h2>About This Project</h2>
        <p>
          The Capital Flow Filter is a{' '}
          <strong>free, independent indicator</strong>
          {' '}created by a trader, for traders. It's inspired by capital flow concepts but built from scratch with a focus on practical, actionable signals.
        </p>
        <p>
          This project is not affiliated with any paid signal service or trading group. The indicator and daily reports are provided free of charge. We believe good trading tools should be accessible to everyone.
        </p>
        <p>
          If you're interested in professional-grade trading tools and education, we recommend checking out{' '}
          <a href="https://mdxalgo.com/?ref=CsMGq" target="_blank">MDX ALGO</a>
          {' '}— a comprehensive trading suite that inspired some of the concepts behind this indicator.
        </p>
        <div className="highlight-box">
          <p>
            <strong>Disclaimer:</strong>
            {' '}This is not financial advice. Trading cryptocurrencies involves substantial risk. The Capital Flow Filter is a tool to aid your analysis, not a guarantee of profits. Always do your own research and never risk more than you can afford to lose.{' '}
            <a href="/disclaimer">Read full disclaimer</a>
            .
          </p>
        </div>
      </div>
      <footer>
        <div className="footer-links">
          <a href="/">Home</a>
          {' '}
          <a href="/about">About</a>
          {' '}
          <a href="/oscillator">Oscillator</a>
          {' '}
          <a href="/strategies">Strategies</a>
          {' '}
          <a href="/reports">Reports</a>
          {' '}
          <a href="/privacy">Privacy Policy</a>
          {' '}
          <a href="/disclaimer">Disclaimer</a>
          {' '}
          <a href="https://mdxalgo.com/?ref=CsMGq" target="_blank">MDX ALGO</a>
        </div>
        <p className="copyright" style={{ maxWidth: "500px", margin: "0 auto 1rem", fontSize: "0.7rem" }}>
          <strong style={{ color: "var(--orange)" }}>Disclosure:</strong>
          {' '}Capital Flow Filter is a free, independent indicator. Not affiliated with MDX ALGO. Affiliate links used.
        </p>
        <p className="copyright">Built by traders, for traders.</p>
      </footer>
      <SuggestWidget />
    </>
  );
}
