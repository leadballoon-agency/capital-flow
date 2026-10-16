import './strategies.css';
import Logo from '../components/Logo';
import SuggestWidget from '../components/SuggestWidget';

export const metadata = {
  title: "Trading Strategies | Capital Flow Filter",
  description: "Proven trading strategies using the Capital Flow Filter indicator. Learn how to trade with the Keltner Cloud Edge strategy."
};

export default function StrategiesPage() {
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
          <span className="page-badge">Strategy Guide</span>
          <h1>Trading Strategies</h1>
          <p className="subtitle">Proven setups using the Capital Flow Filter indicator</p>
        </div>
        <div className="strategy-card" id="cloud-edge">
          <div className="strategy-header">
            <span className="strategy-badge">82% Win Rate Observed</span>
            <h2 className="strategy-title">Cloud Edge Trading</h2>
            <p className="strategy-subtitle">Use the Keltner Channel as dynamic support/resistance based on flow direction</p>
          </div>
          <div className="strategy-content">
            <h2>The Core Concept</h2>
            <p>
              The Keltner Channel (the "cloud") acts as{' '}
              <strong>dynamic support and resistance</strong>
              . But here's the key insight: which edge matters depends on the{' '}
              <strong>flow direction</strong>
              .
            </p>
            <p>
              When capital is flowing bullish (green cloud), the{' '}
              <strong>bottom of the cloud becomes support</strong>
              . When capital is flowing bearish (red cloud), the{' '}
              <strong>top of the cloud becomes resistance</strong>
              .
            </p>
            <div className="rules-box">
              <div className="rule-card long">
                <div className="rule-header long">Long Setup</div>
                <ul className="rule-list">
                  <li>Flow is GREEN (bullish)</li>
                  <li>Price touches BOTTOM of cloud</li>
                  <li>Enter long on bounce</li>
                  <li>Target: Previous swing high or top of cloud</li>
                  <li>Stop: Below the cloud</li>
                </ul>
              </div>
              <div className="rule-card short">
                <div className="rule-header short">Short Setup</div>
                <ul className="rule-list">
                  <li>Flow is RED (bearish)</li>
                  <li>Price touches TOP of cloud</li>
                  <li>Enter short on rejection</li>
                  <li>Target: Previous swing low or bottom of cloud</li>
                  <li>Stop: Above the cloud</li>
                </ul>
              </div>
            </div>
            <h2>Backtest Results</h2>
            <p>We analyzed this strategy across multiple timeframes using recent BTC price action:</p>
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Timeframe</th>
                  <th>Winning Trades</th>
                  <th>Losing/Choppy</th>
                  <th>Win Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>15-minute</td>
                  <td>6</td>
                  <td>1</td>
                  <td className="highlight">86%</td>
                </tr>
                <tr>
                  <td>5-minute</td>
                  <td>4</td>
                  <td>1</td>
                  <td className="highlight">80%</td>
                </tr>
                <tr>
                  <td>1-hour</td>
                  <td>4</td>
                  <td>1</td>
                  <td className="highlight">80%</td>
                </tr>
                <tr className="total-row">
                  <td>Total</td>
                  <td>14</td>
                  <td>3</td>
                  <td className="highlight">82%</td>
                </tr>
              </tbody>
            </table>
            <h2>Key Observations</h2>
            <div className="observations">
              <div className="observation">
                <span className="observation-icon">📏</span>
                <div className="observation-content">
                  <div className="observation-title">Cloud thickness = conviction</div>
                  <p className="observation-text">
                    The strategy works best when the cloud is thick. Thick cloud means high conviction flow—entries off the edges are more reliable.
                  </p>
                </div>
              </div>
              <div className="observation">
                <span className="observation-icon">⚠️</span>
                <div className="observation-content">
                  <div className="observation-title">Thin clouds = danger zone</div>
                  <p className="observation-text">
                    When the cloud is thin or flipping frequently, expect choppy conditions. These are the whipsaw zones where the strategy breaks down.
                  </p>
                </div>
              </div>
              <div className="observation">
                <span className="observation-icon">📈</span>
                <div className="observation-content">
                  <div className="observation-title">Trending markets are ideal</div>
                  <p className="observation-text">
                    The big red cloud moves (drops from $97k to $89k) gave multiple clean short entries from the top. Sustained flow direction = sustained edge.
                  </p>
                </div>
              </div>
              <div className="observation">
                <span className="observation-icon">🔄</span>
                <div className="observation-content">
                  <div className="observation-title">First touch after flip is highest probability</div>
                  <p className="observation-text">
                    When flow changes color, the first touch of the new "support/resistance" edge often produces the strongest bounce or rejection.
                  </p>
                </div>
              </div>
              <div className="observation">
                <span className="observation-icon">🎯</span>
                <div className="observation-content">
                  <div className="observation-title">The flip dot is your bias change signal</div>
                  <p className="observation-text">
                    When you see the flow flip from green to red (or vice versa), that's your cue to switch your bias and start looking for entries from the opposite edge.
                  </p>
                </div>
              </div>
            </div>
            <h2>Best Timeframes</h2>
            <p>
              This strategy works across all timeframes but shines on{' '}
              <strong>lower timeframes (1m-15m)</strong>
              {' '}for scalping:
            </p>
            <ul style={{ color: "var(--gray-light)", paddingLeft: "1.5rem", marginBottom: "1.5rem" }}>
              <li>
                <strong>1m-5m:</strong>
                {' '}Quick scalps, multiple opportunities per session
              </li>
              <li>
                <strong>15m:</strong>
                {' '}Sweet spot—enough signals with cleaner moves
              </li>
              <li>
                <strong>1H:</strong>
                {' '}Fewer but larger moves, good for swing entries
              </li>
              <li>
                <strong>4H+:</strong>
                {' '}Use for bias, but fewer cloud edge touches
              </li>
            </ul>
            <div className="warning-box">
              <p>
                <strong>When to avoid this strategy:</strong>
                {' '}During low-volume periods (weekends, holidays), when the cloud is very thin, or when you see frequent flow flips within a short period. These conditions indicate indecision and increase whipsaw risk.
              </p>
            </div>
            <h2>Entry Checklist</h2>
            <ol style={{ color: "var(--gray-light)", paddingLeft: "1.5rem", marginBottom: "1.5rem" }}>
              <li>
                <strong>Confirm flow direction</strong>
                {' '}— Is the cloud green or red?
              </li>
              <li>
                <strong>Check cloud thickness</strong>
                {' '}— Thick = good, thin = caution
              </li>
              <li>
                <strong>Wait for edge touch</strong>
                {' '}— Price must reach the cloud edge
              </li>
              <li>
                <strong>Look for reaction</strong>
                {' '}— A bounce (green) or rejection (red)
              </li>
              <li>
                <strong>Enter on confirmation candle</strong>
                {' '}— Don't front-run the touch
              </li>
              <li>
                <strong>Set stop beyond cloud</strong>
                {' '}— If price breaks through, you're wrong
              </li>
            </ol>
            <div className="highlight-box">
              <p>
                <strong>Pro Tip:</strong>
                {' '}Combine this with higher timeframe bias. If the 1H flow is green and you're scalping the 5m, prioritize long setups off the bottom of the 5m cloud. Trading with the higher timeframe flow increases your win rate.
              </p>
            </div>
          </div>
        </div>
        <div className="strategy-card" id="dual-tp">
          <div className="strategy-header">
            <span className="strategy-badge">100% Win Rate on 4H (6/6 trades)</span>
            <h2 className="strategy-title">Dual Take-Profit System</h2>
            <p className="strategy-subtitle">Maximize gains with TP1 at middle band, TP2 at opposite band</p>
          </div>
          <div className="strategy-content">
            <h2>The Strategy</h2>
            <p>
              Building on Cloud Edge Trading, this system uses{' '}
              <strong>two take-profit levels</strong>
              {' '}to lock in profits while letting winners run. The middle Keltner band (basis) acts as TP1, and the opposite outer band becomes TP2.
            </p>
            <div className="rules-box">
              <div className="rule-card long">
                <div className="rule-header long">Long Trade Management</div>
                <ul className="rule-list">
                  <li>Entry: Bottom of Keltner (green flow)</li>
                  <li>Stop Loss: Below lower band (~1.5%)</li>
                  <li>TP1 (50%): Middle band (basis)</li>
                  <li>Move SL to breakeven after TP1</li>
                  <li>TP2 (50%): Upper band (opposite edge)</li>
                </ul>
              </div>
              <div className="rule-card short">
                <div className="rule-header short">Short Trade Management</div>
                <ul className="rule-list">
                  <li>Entry: Top of Keltner (red flow)</li>
                  <li>Stop Loss: Above upper band (~1.5%)</li>
                  <li>TP1 (50%): Middle band (basis)</li>
                  <li>Move SL to breakeven after TP1</li>
                  <li>TP2 (50%): Lower band (opposite edge)</li>
                </ul>
              </div>
            </div>
            <h2>4H BTC Backtest (Dec 2025)</h2>
            <p>Analyzed 7 trades on the 4H BTCUSDT chart following flow flips:</p>
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Trade</th>
                  <th>Type</th>
                  <th>Entry</th>
                  <th>TP1</th>
                  <th>TP2</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#1</td>
                  <td style={{ color: "var(--red)" }}>SHORT</td>
                  <td>$97,500</td>
                  <td className="highlight">+2.5%</td>
                  <td className="highlight">+5.0%</td>
                  <td className="highlight">Full TP</td>
                </tr>
                <tr>
                  <td>#2</td>
                  <td style={{ color: "var(--green)" }}>LONG</td>
                  <td>$93,000</td>
                  <td className="highlight">+2.7%</td>
                  <td className="highlight">+5.4%</td>
                  <td className="highlight">Full TP</td>
                </tr>
                <tr>
                  <td>#3</td>
                  <td style={{ color: "var(--red)" }}>SHORT</td>
                  <td>$98,500</td>
                  <td className="highlight">+3.0%</td>
                  <td className="highlight">+6.0%</td>
                  <td className="highlight">Full TP</td>
                </tr>
                <tr>
                  <td>#4</td>
                  <td style={{ color: "var(--green)" }}>LONG</td>
                  <td>$88,500</td>
                  <td className="highlight">+2.3%</td>
                  <td className="highlight">+4.5%</td>
                  <td className="highlight">Full TP</td>
                </tr>
                <tr>
                  <td>#5</td>
                  <td style={{ color: "var(--green)" }}>LONG</td>
                  <td>$89,500</td>
                  <td className="highlight">+1.7%</td>
                  <td>BE</td>
                  <td style={{ color: "var(--brand)" }}>Partial</td>
                </tr>
                <tr>
                  <td>#6</td>
                  <td style={{ color: "var(--red)" }}>SHORT</td>
                  <td>$94,000</td>
                  <td className="highlight">+2.7%</td>
                  <td className="highlight">+5.3%</td>
                  <td className="highlight">Full TP</td>
                </tr>
                <tr>
                  <td>#7</td>
                  <td style={{ color: "var(--green)" }}>LONG</td>
                  <td>$89,500</td>
                  <td className="highlight">+1.7%</td>
                  <td>Pending</td>
                  <td style={{ color: "var(--gray)" }}>Open</td>
                </tr>
                <tr className="total-row">
                  <td colSpan="3">6 Closed Trades</td>
                  <td colSpan="2">Avg Return: ~3.75%</td>
                  <td className="highlight">100% Win</td>
                </tr>
              </tbody>
            </table>
            <h2>Performance Breakdown</h2>
            <div className="observations">
              <div className="observation">
                <span className="observation-icon">🎯</span>
                <div className="observation-content">
                  <div className="observation-title">TP1 Hit Rate: 100%</div>
                  <p className="observation-text">Every single trade reached the middle band. This is your "always get paid" level.</p>
                </div>
              </div>
              <div className="observation">
                <span className="observation-icon">🚀</span>
                <div className="observation-content">
                  <div className="observation-title">TP2 Hit Rate: 85%</div>
                  <p className="observation-text">
                    5 out of 6 closed trades reached the opposite band. One stopped at breakeven (still profitable from TP1).
                  </p>
                </div>
              </div>
              <div className="observation">
                <span className="observation-icon">📊</span>
                <div className="observation-content">
                  <div className="observation-title">Average R:R = 3:1</div>
                  <p className="observation-text">Risking ~1.5% per trade, average return was ~3.75% (50% at TP1 + 50% at TP2).</p>
                </div>
              </div>
              <div className="observation">
                <span className="observation-icon">🛡️</span>
                <div className="observation-content">
                  <div className="observation-title">Zero Losses Before TP1</div>
                  <p className="observation-text">
                    No trade was stopped out before hitting TP1. The breakeven move after TP1 protected capital perfectly.
                  </p>
                </div>
              </div>
            </div>
            <h2>Why This Works</h2>
            <p>
              The Keltner Channel is a{' '}
              <strong>volatility-based envelope</strong>
              . Price naturally oscillates between the bands. By entering at one extreme and targeting the middle (TP1) then the opposite extreme (TP2), you're trading WITH the natural market rhythm.
            </p>
            <p>
              The key insight:{' '}
              <strong>TP1 at the middle band is almost always hit</strong>
              {' '}because it's just a reversion to the mean. TP2 at the opposite band catches the extended moves when flow is strong.
            </p>
            <div className="warning-box">
              <p>
                <strong>Critical Rule:</strong>
                {' '}Always move your stop to breakeven after TP1 hits. This turns every trade into either a winner or a scratch. In our backtest, this rule protected Trade #5 from becoming a loss.
              </p>
            </div>
            <h2>Position Sizing Example</h2>
            <p>With a $10,000 account risking 1.5% ($150) per trade:</p>
            <ul style={{ color: "var(--gray-light)", paddingLeft: "1.5rem", marginBottom: "1.5rem" }}>
              <li>
                <strong>Entry:</strong>
                {' '}Full position at cloud edge
              </li>
              <li>
                <strong>TP1 (50%):</strong>
                {' '}Close half (+$125 on avg)
              </li>
              <li>
                <strong>TP2 (50%):</strong>
                {' '}Close remaining (+$250 on avg)
              </li>
              <li>
                <strong>Total avg profit:</strong>
                {' '}$375 per trade (2.5R)
              </li>
              <li>
                <strong>If TP2 stopped at BE:</strong>
                {' '}Still +$125 (0.8R)
              </li>
            </ul>
            <div className="highlight-box">
              <p>
                <strong>Best Timeframe:</strong>
                {' '}This system shines on{' '}
                <strong>4H charts</strong>
                {' '}where flow direction is more sustained and the Keltner bands are wide enough to capture meaningful moves. Lower timeframes work but have more noise.
              </p>
            </div>
          </div>
        </div>
        <div className="coming-soon">
          <div className="coming-soon-icon">🚧</div>
          <h3>More Strategies Coming Soon</h3>
          <p>
            We're documenting additional strategies including Full Confluence plays, Divergence trading, and Manipulation fade setups.
          </p>
        </div>
        <div className="cta-section">
          <h3>Get Real-Time Signals</h3>
          <p style={{ color: "var(--gray-light)" }}>Join our Telegram channel for live Capital Flow signals and strategy discussions.</p>
          <div className="cta-buttons">
            <a href="https://t.me/fivedaytrader" target="_blank" className="btn btn-primary">Join Telegram</a>
            {' '}
            <a href="/about" className="btn btn-secondary">Learn More</a>
          </div>
        </div>
      </div>
      <footer>
        <div className="footer-links">
          <a href="/">Home</a>
          {' '}
          <a href="/about">About</a>
          {' '}
          <a href="/reports">Reports</a>
          {' '}
          <a href="/signals">Live Signals</a>
          {' '}
          <a href="/strategies">Strategies</a>
        </div>
        <p className="copyright" style={{ maxWidth: "500px", margin: "0 auto 1rem", fontSize: "0.7rem" }}>
          <strong style={{ color: "var(--brand)" }}>Disclaimer:</strong>
          {' '}These strategies are for educational purposes. Past performance does not guarantee future results. Always manage your risk.
        </p>
        <p className="copyright">Built by traders, for traders.</p>
      </footer>
      <SuggestWidget />
    </>
  );
}
