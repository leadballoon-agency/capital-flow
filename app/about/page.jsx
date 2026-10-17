import './about.css';
import Logo from '../components/Logo';
import SuggestWidget from '../components/SuggestWidget';

export const metadata = {
  title: 'About | Capital Flow',
  description:
    'Capital Flow is a free, independent project: two TradingView indicators, a live signals channel and a playbook for trading with the money behind the move.',
};

const TELEGRAM = 'https://t.me/fivedaytrader';

const parts = [
  ['〰️', 'Capital Flow Oscillator', 'Under the chart. Momentum waves, money flow from real buying and selling volume, and a capital flow engine that reads eight markets. Graded dots and the gold Capital Flow signal show when they line up.', '/#signal'],
  ['🧱', 'CF Levels', 'On the price chart. Supply and demand zones with the money behind them, the daily to yearly opens and their regains, market structure and volume candles.', '/#levels'],
  ['📣', 'Telegram channel', 'The oscillator’s strongest signals on BTC 1H (Capital Flow and A-grade setups, Blue Wave, flow exits) the moment the candle closes, plus a heads-up on big economic releases.', TELEGRAM],
  ['📡', 'Live signals page', 'The channel’s alerts 24 hours later, with the market backdrop: fear and greed, retail positioning and the economic calendar.', '/signals'],
  ['📘', 'The playbook', 'One way to trade with both indicators: the signal for direction, a zone for location, a reaction for timing.', '/strategies'],
  ['🔬', 'Methodology', 'How every part is built, from the eight inputs to how a zone is drawn.', '/methodology'],
];

const principles = [
  ['Free', 'No paid tier, no locked features, no paid indicators needed. Both indicators work within the free TradingView plan’s two-indicator limit.'],
  ['Open', 'Both scripts are open source, so anyone can read exactly how they work.'],
  ['No repainting', 'Higher-timeframe and capital flow data only use closed bars. Past signals stay where they were drawn.'],
  ['No promises', 'There is no published track record and no win-rate claims. The tools help you read the chart; the decisions are yours.'],
];

export default function AboutPage() {
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
        <h1>About Capital Flow</h1>
        <p className="subtitle">A free, independent project for trading with the money behind the move.</p>

        <h2>Why it exists</h2>
        <p>
          Price follows money. A move that has the dollar, volatility, yields and the crypto leaders behind it tends to
          carry; one that doesn&apos;t tends to fade. Most traders know this, but checking DXY, VIX, yields, BTC
          dominance and the rest by hand before every trade is slow, and easy to skip when the market moves fast.
        </p>
        <p>
          Capital Flow puts that on the chart. The capital flow engine reads eight markets and turns them into one score,
          the oscillator puts it under the waves you already use, and CF Levels shows where on the price chart a trade
          has something to lean on.
        </p>

        <h2>What&apos;s included</h2>
        <div className="signal-grid">
          {parts.map(([icon, title, text, href]) => (
            <a key={title} href={href} className="signal-card" style={{ textDecoration: 'none' }}
              {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {})}>
              <div className="signal-card-header">{icon} {title}</div>
              <p>{text}</p>
            </a>
          ))}
        </div>

        <h2>How it&apos;s built</h2>
        <div className="signal-grid">
          {principles.map(([title, text]) => (
            <div key={title} className="signal-card">
              <div className="signal-card-header">{title}</div>
              <p>{text}</p>
            </div>
          ))}
        </div>

        <h2>Where it came from</h2>
        <p>
          It started as the Capital Flow Filter, a price-chart overlay that scored the same eight markets. Using it every
          day showed that the score was most useful next to momentum, so in October 2026 the engine moved into the
          Capital Flow Oscillator, and CF Levels took over the price chart with zones, opens and volume.
        </p>
        <p>
          The waves use LazyBear&apos;s open-source WaveTrend formula, the oscillator&apos;s layout takes ideas from
          VuManChu&apos;s open-source oscillator, and the volume candles follow the PVSRA method. The capital flow
          engine, the grading, the Capital Flow signal, the money flow method and CF Levels&apos; zones are our own.
        </p>

        <div className="feedback-section">
          <h3>Tell us what you think</h3>
          <p>Capital Flow is built with the people who use it. The most useful things to send:</p>
          <ul>
            <li><strong>Charts where it helped, or didn&apos;t</strong>: a screenshot says more than a description</li>
            <li><strong>Something that looks wrong</strong>: the symbol, timeframe and roughly when</li>
            <li><strong>Ideas</strong>: what would make the indicators or the channel more useful</li>
          </ul>
          <p>
            Post in the <a href={TELEGRAM} target="_blank" rel="noopener">Telegram channel</a> or use the{' '}
            <a href="/suggest">suggestions page</a>. Every message is read.
          </p>
        </div>

        <div className="cta-section">
          <h3>Try both indicators</h3>
          <p style={{ color: 'var(--gray-light)' }}>Free on TradingView. Set up in about two minutes.</p>
          <div className="cta-buttons">
            <a href="/#install" className="btn btn-primary">Get the indicators</a>
            {' '}
            <a href={TELEGRAM} target="_blank" rel="noopener" className="btn btn-secondary">Join Telegram</a>
          </div>
        </div>
      </div>
      <footer>
        <div className="footer-links">
          <a href="/">Home</a>
          {' '}
          <a href="/methodology">Methodology</a>
          {' '}
          <a href="/strategies">Playbook</a>
          {' '}
          <a href="/signals">Live Signals</a>
          {' '}
          <a href="/disclaimer">Disclaimer</a>
        </div>
        <p className="copyright" style={{ maxWidth: '500px', margin: '0 auto 1rem', fontSize: '0.7rem' }}>
          Capital Flow is a free, independent project. Educational only, not financial advice.
        </p>
        <p className="copyright">Built by traders, for traders.</p>
      </footer>
      <SuggestWidget />
    </>
  );
}
