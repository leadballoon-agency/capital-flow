import './strategies.css';
import Logo from '../components/Logo';
import SignalMark from '../components/SignalMark';
import SuggestWidget from '../components/SuggestWidget';

export const metadata = {
  title: 'The Capital Flow Playbook | Capital Flow',
  description:
    'A discretionary playbook for the CF Osc and CF Levels: the Capital Flow signal gives the direction, demand and supply zones give the location, and the entry comes on a lower timeframe.',
};

const pairs = [
  ['Daily', '4H or 1H', 'Swing trades over days to weeks'],
  ['4H', '1H or 15m', 'Trades over a day or two'],
  ['1H', '15m or 5m', 'Intraday trades'],
  ['15m', '3m or 1m', 'Scalps: quick in and out, so be strict about the stop'],
];

const standAside = [
  ['🏃', 'Price has already left', 'The signal fired between zones and price ran without pulling back. There’s no level to lean on, so let it go. Another one will come.'],
  ['⚖️', 'Capital flow is neutral or turning', 'If the band at the bottom of the CF Osc is grey, or the × has appeared, the permission has gone.'],
  ['🧱', 'The zone has already broken', 'Once price closes through a zone, CF Levels removes it. Don’t trade a level that has stopped being one.'],
  ['📅', 'A big release is due', 'Rate decisions, CPI and jobs data can blow through any level. Check the economic calendar first and step back around the release.'],
  ['↕️', 'The higher timeframe disagrees', 'A long on 15m against a gold short on 4H is fighting the bigger flow. Trade with the higher timeframe, or not at all.'],
];

const checklist = [
  'A Capital Flow signal (gold dot) on the higher timeframe, and no × since',
  'Price at a demand zone (longs) or supply zone (shorts) on the entry timeframe',
  'A trigger: a close back out of the zone, a regain of the daily open, or a graded dot the same way',
  'Stop just beyond the zone, decided before you enter',
  'Target at the next opposite zone or a key open, and the reward is worth the risk',
  'No high-impact release in the next hour or two',
];

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
          <span className="page-badge">Playbook</span>
          <h1>The Capital Flow playbook</h1>
          <p className="subtitle">
            One way to trade with the CF Osc and CF Levels together. It&apos;s a discretionary method, not a system:
            you read the chart and make the call.
          </p>
        </div>

        <div className="strategy-card" id="idea">
          <div className="strategy-header">
            <span className="strategy-badge">The idea</span>
            <h2 className="strategy-title">Direction, location, timing</h2>
            <p className="strategy-subtitle">Each indicator answers a different question. Wait until all three have an answer.</p>
          </div>
          <div className="strategy-content">
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Answered by</th>
                  <th>What you look for</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Which way?</strong></td>
                  <td>CF Osc</td>
                  <td>
                    <span className="mark-inline"><SignalMark kind="capital_flow" size={16} /></span> A Capital Flow signal:
                    momentum, money flow and macro capital flow agree
                  </td>
                </tr>
                <tr>
                  <td><strong>Where?</strong></td>
                  <td>CF Levels</td>
                  <td>A demand zone for longs or a supply zone for shorts, ideally one with a big volume share or overlapping zones (x2, x3)</td>
                </tr>
                <tr>
                  <td><strong>When?</strong></td>
                  <td>Both</td>
                  <td>Price reacting at the zone: a close back out of it, a regain of the daily open (DO ↑), or a graded dot the same way</td>
                </tr>
              </tbody>
            </table>
            <p>
              Taking the signal without a level means chasing. Taking a level without the signal means guessing which
              side of it will hold. Together they give you a reason to trade and a place to put your stop.
            </p>
          </div>
        </div>

        <div className="strategy-card" id="steps">
          <div className="strategy-header">
            <span className="strategy-badge">Step by step</span>
            <h2 className="strategy-title">Five steps, longs and shorts mirrored</h2>
            <p className="strategy-subtitle">Written for a long; for a short, swap demand for supply and down for up.</p>
          </div>
          <div className="strategy-content">
            <h3>1. Permission: the gold dot</h3>
            <p>
              A Capital Flow long on the CF Osc sets the direction. On its own it isn&apos;t an entry. It says longs are
              worth looking for, and it stays that way until capital flow turns against it (the ×).
            </p>
            <h3>2. Location: a demand zone</h3>
            <p>
              Look for the nearest demand zone on CF Levels. If the signal fired with price already in a zone, you&apos;re
              there. If it fired between zones, wait for price to pull back into the zone below. If it runs away instead,
              there&apos;s no trade.
            </p>
            <h3>3. Timing: price reacts</h3>
            <p>
              Wait for a candle to close back above the zone, a regain of the daily open (DO ↑), or a graded dot the same
              way on the entry timeframe. That&apos;s the sign buyers are defending the level.
            </p>
            <h3>4. Risk: stop beyond the zone</h3>
            <p>
              Put the stop just below the zone. If price closes through it, the zone has failed and so has the trade.
              Set the target at the next supply zone or a key open (WO, MO) before you enter, and skip the trade if the
              reward isn&apos;t worth the risk.
            </p>
            <h3>5. Management: know when to leave</h3>
            <p>
              Close or tighten when the × appears on the CF Osc (capital flow has turned against you), when price reaches
              the target zone, or when price closes back through your zone.
            </p>
            <div className="rules-box">
              <div className="rule-card long">
                <div className="rule-header long">Long</div>
                <ul className="rule-list">
                  <li>Gold Capital Flow long, no × since</li>
                  <li>Price at a demand zone</li>
                  <li>Close back above the zone or DO ↑</li>
                  <li>Stop below the zone, target the next supply</li>
                </ul>
              </div>
              <div className="rule-card short">
                <div className="rule-header short">Short</div>
                <ul className="rule-list">
                  <li>Gold Capital Flow short, no × since</li>
                  <li>Price at a supply zone</li>
                  <li>Close back below the zone or DO ↓</li>
                  <li>Stop above the zone, target the next demand</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="strategy-card" id="timeframes">
          <div className="strategy-header">
            <span className="strategy-badge">Two timeframes</span>
            <h2 className="strategy-title">Signal on the higher timeframe, entry on the lower</h2>
            <p className="strategy-subtitle">The bigger picture sets the direction; the smaller one gives a tighter entry.</p>
          </div>
          <div className="strategy-content">
            <p>
              A gold dot on a higher timeframe carries more weight: more money has to move to turn the flow on a 4H or
              daily chart. But a stop beyond a 4H zone is wide. Dropping to a lower timeframe for the entry lets you
              use a smaller zone inside the bigger one, so the stop is tighter and the same target is worth more.
            </p>
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Signal on</th>
                  <th>Entry on</th>
                  <th>Suits</th>
                </tr>
              </thead>
              <tbody>
                {pairs.map(([hi, lo, suits]) => (
                  <tr key={hi}>
                    <td><strong>{hi}</strong></td>
                    <td>{lo}</td>
                    <td>{suits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3>How it works</h3>
            <div className="observations">
              <div className="observation">
                <span className="observation-icon">1</span>
                <div className="observation-content">
                  <div className="observation-title">Mark the higher-timeframe picture</div>
                  <p className="observation-text">
                    A gold Capital Flow long on the 4H, and the 4H demand zone it formed in or above. That zone is your
                    area of interest; the 4H supply above it is the target.
                  </p>
                </div>
              </div>
              <div className="observation">
                <span className="observation-icon">2</span>
                <div className="observation-content">
                  <div className="observation-title">Drop down and wait</div>
                  <p className="observation-text">
                    On the 1H or 15m, wait for price to come into the 4H zone. CF Levels on the lower timeframe will often
                    show a smaller demand zone inside it: that&apos;s where to look for the entry.
                  </p>
                </div>
              </div>
              <div className="observation">
                <span className="observation-icon">3</span>
                <div className="observation-content">
                  <div className="observation-title">Take the lower-timeframe trigger</div>
                  <p className="observation-text">
                    A close back above the small zone, a DO regain, or a graded dot pointing the same way on the lower
                    timeframe&apos;s CF Osc. Stop below the small zone, target the 4H supply.
                  </p>
                </div>
              </div>
              <div className="observation">
                <span className="observation-icon">4</span>
                <div className="observation-content">
                  <div className="observation-title">The higher timeframe still rules</div>
                  <p className="observation-text">
                    If the 4H shows the × or closes through its zone, the idea is off, whatever the lower timeframe says.
                    Lower-timeframe signals against the higher-timeframe flow are noise for this playbook.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="strategy-card" id="example">
          <div className="strategy-header">
            <span className="strategy-badge">Example</span>
            <h2 className="strategy-title">BTC 1H, 15 October 2026</h2>
            <p className="strategy-subtitle">How the pieces lined up at the low. Chosen to explain the method, not as proof that it works.</p>
          </div>
          <div className="strategy-content">
            <figure className="chart-example">
              <a href="/images/playbook-btc-1h-2026-10-15.jpg" target="_blank" rel="noopener" title="Open full size">
              <img
                src="/images/playbook-btc-1h-2026-10-15.jpg"
                alt="BTC 1H chart with CF Levels zones and opens above, and the CF Osc below showing gold Capital Flow dots at the 15 October low"
                loading="lazy"
              />
              </a>
              <figcaption>BTCUSDT perpetual (Bitget), 1H, with CF Levels on the chart and the CF Osc underneath. Click to open full size.</figcaption>
            </figure>
            <div className="observations">
              <div className="observation">
                <span className="observation-icon"><SignalMark kind="capital_flow" size={20} /></span>
                <div className="observation-content">
                  <div className="observation-title">Permission</div>
                  <p className="observation-text">
                    After the drop from 84k, the CF Osc printed gold Capital Flow long dots near the −60 line: the wave
                    turned up from deep oversold, money flow turned with it, and capital flow was on the long side.
                  </p>
                </div>
              </div>
              <div className="observation">
                <span className="observation-icon">🟩</span>
                <div className="observation-content">
                  <div className="observation-title">Location</div>
                  <p className="observation-text">
                    The dots formed with price inside the strongest demand on the chart around 79.8k–80.6k, two
                    overlapping zones holding about 4% of recent volume (x2).
                  </p>
                </div>
              </div>
              <div className="observation">
                <span className="observation-icon">↑</span>
                <div className="observation-content">
                  <div className="observation-title">Timing and risk</div>
                  <p className="observation-text">
                    A strong green climax candle closed back above the zone. The stop would go under the zone, below the
                    79.8k low; the first target was the supply zone at about 82.1k–82.9k, where price later stalled.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="strategy-card" id="stand-aside">
          <div className="strategy-header">
            <span className="strategy-badge">Discipline</span>
            <h2 className="strategy-title">When to stand aside</h2>
            <p className="strategy-subtitle">Most of the edge in a discretionary method is in the trades you skip.</p>
          </div>
          <div className="strategy-content">
            <div className="observations">
              {standAside.map(([icon, title, text]) => (
                <div className="observation" key={title}>
                  <span className="observation-icon">{icon}</span>
                  <div className="observation-content">
                    <div className="observation-title">{title}</div>
                    <p className="observation-text">{text}</p>
                  </div>
                </div>
              ))}
            </div>
            <h2>Before every trade</h2>
            <ul className="rule-list checklist">
              {checklist.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <div className="warning-box">
              <p>
                There&apos;s no published track record for this playbook. It&apos;s a way of reading the chart, not a
                promise of results. Size every trade so that being wrong is affordable.
              </p>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <h3>Get the indicators</h3>
          <p style={{ color: 'var(--gray-light)' }}>
            Both are free on TradingView. The Telegram channel posts the CF Osc&apos;s Capital Flow and A-grade signals on BTC 1H.
          </p>
          <div className="cta-buttons">
            <a href="/#install" className="btn btn-primary">Install the indicators</a>
            {' '}
            <a href="https://t.me/fivedaytrader" target="_blank" rel="noopener" className="btn btn-secondary">Join Telegram</a>
          </div>
        </div>
      </div>
      <footer>
        <div className="footer-links">
          <a href="/">Home</a>
          {' '}
          <a href="/#levels">CF Levels</a>
          {' '}
          <a href="/signals">Live Signals</a>
          {' '}
          <a href="/about">About</a>
          {' '}
          <a href="/disclaimer">Disclaimer</a>
        </div>
        <p className="copyright" style={{ maxWidth: '500px', margin: '0 auto 1rem', fontSize: '0.7rem' }}>
          <strong style={{ color: 'var(--brand)' }}>Disclaimer:</strong>
          {' '}Educational only, not financial advice. Trading involves substantial risk.
        </p>
        <p className="copyright">Built by traders, for traders.</p>
      </footer>
      <SuggestWidget />
    </>
  );
}
