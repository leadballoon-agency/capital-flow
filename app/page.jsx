import './osc.css';
import Logo from './components/Logo';
import HeroVisual from './components/HeroVisual';
import LevelsVisual from './components/LevelsVisual';

export const metadata = {
  title: 'Capital Flow | Two free TradingView indicators, the whole picture',
  description:
    'CF Levels shows where price is likely to react; the Capital Flow Oscillator shows when, with momentum, real money flow and a cross-market capital flow engine. Both free, and together they fit the free plan.',
  openGraph: {
    title: 'Capital Flow: two free TradingView indicators',
    description: 'Zones, opens and volume on the price chart; momentum, money flow and macro capital flow underneath. Free, no repaint.',
    type: 'website',
  },
};

const TELEGRAM = 'https://t.me/fivedaytrader';

const legend = [
  { sw: { background: 'var(--blue)' }, title: 'Momentum waves.', text: 'WaveTrend maths (LazyBear\'s open-source formula), or a "Cloud Position" view inside the Keltner cloud.' },
  { sw: { background: '#b4a7d6' }, title: 'Higher-timeframe wave.', text: 'A soft lavender line behind the waves: 1H on 15m charts, 4H on 1H, daily on 4H. Closed bars only.' },
  { sw: { background: 'var(--green)', opacity: 0.6 }, title: 'Money flow.', text: 'Buy vs sell volume estimated from lower-timeframe candles, smoothed into a curve rather than a sawtooth.' },
  { sw: { background: 'var(--yellow)', opacity: 0.7 }, title: 'Yellow wave.', text: 'A second, smoother read of momentum, drawn behind the money flow. Or switch it to VWAP Distance: how far price is from its volume-weighted average price, where the way it curves through zero is the tell.' },
  { sw: { background: '#00a862' }, title: 'Capital flow band.', text: 'Along the bottom. It changes shade only when the reading holds for 3 bars, and green or red dots mark flips (±20% for 2 bars). A tag at the right edge reads "CAPITAL FLOW IN", "OUT", "leaning" or "neutral".' },
  { sw: { background: 'radial-gradient(circle, var(--green) 0 33%, transparent 36% 56%, var(--green) 58% 70%, transparent 72%)', borderRadius: '50%' }, title: 'Graded dots.', text: 'A small dot on every wave cross. A = a thin green or red ring around the dot, B = outlined dot, C = small dot. Small by design, so they don’t bury the waves.' },
  { sw: { background: 'radial-gradient(circle, var(--gold) 0 33%, transparent 36% 55%, var(--gold) 57% 71%, transparent 73%)', borderRadius: '50%' }, title: 'Capital Flow signal.', text: 'A gold dot in a thin gold ring, long or short, when momentum, money flow and capital flow all agree.' },
  { sw: { background: 'var(--blue)', transform: 'rotate(45deg) scale(.7)' }, title: 'Blue Wave.', text: 'A small blue diamond when a shallower second dip turns after a deep first one, with money flow behind it.' },
  { sw: { background: 'var(--red)' }, title: 'Divergence and RSI cue.', text: 'Divergence lines (bold when wave, RSI and money flow all agree), and a wave edge that changes colour at RSI extremes.' },
];

const levels = [
  { sw: { background: '#E5383B', opacity: 0.55 }, title: 'Volume zones.', text: 'Supply and demand zones drawn from the candles at each swing. The label gives the dollar volume traded as the swing formed and its share of recent volume, so you can see which levels have real money behind them. Where zones overlap the area shows darker and the label counts them (x2, x3): more overlap, a stronger level. A zone goes once price closes through it.' },
  { sw: { background: '#7FB3C4' }, title: 'Opens.', text: 'Daily, weekly, monthly, quarterly and yearly opens, each on its own line at its exact price, because a close a few dollars either side can matter. When opens sit close together their tags are set side by side so they stay readable.' },
  { sw: { background: '#2EBD59' }, title: 'Regains and losses.', text: '"DO ↑" marks the candle that closes back above the daily open after closing below it, and "WO ↓" the one that loses the weekly open. It takes two closes on the other side first, so chop around a level doesn’t count. Optional alerts.' },
  { sw: { background: '#8C919C' }, title: 'Market structure.', text: 'HH, HL, LH and LL tags on the main swings, so you can see the trend at a glance.' },
  { sw: { background: 'linear-gradient(90deg, #00E676 0 25%, #FF1744 25% 50%, #2962FF 50% 75%, #E040FB 75%)' }, title: 'Volume candles.', text: 'PVSRA colours: green or red when volume is at least double the average of the last 10 candles, blue or violet at 150%, grey for the rest. Only candles with real volume behind them stand out.' },
];

const mfTest = [
  { name: 'CF Osc (volume × body / range)', corr: '0.45–0.60', turns: '70–75%', best: true },
  { name: 'Close-location split (our old method)', corr: '0.25–0.45', turns: '60–70%' },
  { name: 'Classic 60-bar candle-body average', corr: '0.20–0.40', turns: '55–60%' },
];

const inputs = [
  { name: 'Macro', note: '4 inputs · inverted for crypto', tickers: [['DXY', 'down'], ['VIX', 'down'], ['GOLD', 'up'], ['US10Y', 'down']] },
  { name: 'Leaders', note: '2 inputs', tickers: [['BTC', 'up'], ['ETH', 'up']] },
  { name: 'Sectors', note: '2 inputs', tickers: [['BTC.D', ''], ['TOTAL3', 'up']] },
];

const faqs = [
  ['Is it really free?', 'Yes. No paid tier, no locked features and no dependency on any paid indicator. It fetches its own data on TradingView, and the free TradingView plan works.'],
  ['Does it repaint?', 'Higher-timeframe data (the lavender wave and the capital flow inputs) only uses closed bars, so past signals stay where they were drawn. Like any oscillator, the current bar’s values move until that bar closes, so wait for the close before acting on a dot.'],
  ['Where do the waves come from?', 'The waves use the public WaveTrend formula by LazyBear, and the layout takes ideas from VuManChu’s open-source oscillator. The capital flow engine, the grading, the Capital Flow signal and the money flow method are our own.'],
  ['How accurate is the money flow?', 'Roughly right, not exact. It tracked real buy/sell volume better than the alternatives we tested, but true aggressor data needs TradingView’s footprint data on paid plans. Treat it as a guide to who is in control, not a precise count.'],
  ['How often does the Capital Flow signal fire?', 'Rarely, by design. All three conditions have to line up on the same bar, so some days it won’t appear at all. The graded dots cover the everyday turns.'],
  ['Do I need CF Levels as well?', 'No. Each works on its own. The oscillator sits under the chart and handles timing; CF Levels sits on the price chart and marks the zones and opens. They’re designed to be used together.'],
  ['Where do the zone numbers come from?', 'From the chart’s own candle volume, not an order book. The dollar figure is the volume traded on the swing candle and the candles either side of it; the percentage is that volume’s share of the last 500 candles.'],
  ['Is this financial advice?', 'No. Everything here is educational. Please read the full disclaimer before using any signal.'],
];

export default function HomePage() {
  return (
    <>
      <nav aria-label="Main">
        <div className="wrap nav-inner">
          <a href="/" className="logo">
            <Logo />Capital Flow
          </a>
          <div className="nav-links">
            <a href="#signal">The signal</a>
            <a href="#pane">Reading it</a>
            <a href="#money-flow">Money flow</a>
            <a href="#levels">CF Levels</a>
            <a href="#install">Install</a>
            <a href="#faq">FAQ</a>
            <a href="/signals">Live signals</a>
            <a href={TELEGRAM} target="_blank" rel="noopener" className="btn btn-primary btn-sm">
              Join Telegram
            </a>
          </div>
        </div>
      </nav>

      <header className="hero">
        <div className="wrap hero-grid">
          <div>
            <div className="pill">
              <span className="dot" />
              Free on TradingView · two indicators, one complete setup
            </div>
            <h1>
              Two indicators. <span>The whole picture.</span>
            </h1>
            <p className="lead">
              CF Levels goes on the price chart and shows where price is likely to react: zones with the money behind
              them, the opens traders watch, and the moment price takes one back. The Capital Flow Oscillator goes
              underneath and shows when: momentum waves, real money flow, and a capital flow engine that reads eight
              markets, from the dollar to altcoins.
            </p>
            <div className="hero-ctas">
              <a href="#install" className="btn btn-primary">Get both indicators</a>
              <a href="#suite" className="btn btn-ghost">See how they fit together</a>
            </div>
            <div className="chips">
              <span>100% free</span>
              <span>Fits the free plan&apos;s 2-indicator limit</span>
              <span>Closed-bar data, no repaint</span>
              <span>No paid dependencies</span>
              <span>Crypto, equities, metals, forex</span>
            </div>
          </div>
          <HeroVisual />
        </div>
      </header>

      <section id="suite" aria-labelledby="suite-h">
        <div className="wrap">
          <div className="section-head center">
            <span className="eyebrow">The suite</span>
            <h2 id="suite-h">Built as a pair, for a free account.</h2>
            <p className="lead">
              TradingView&apos;s free plan allows two indicators per chart. These two cover what usually takes five or
              six: levels and volume on the chart, timing and the bigger flows underneath.
            </p>
          </div>
          <div className="grid-2">
            <div className="card product">
              <span className="kind">On the price chart</span>
              <h3>CF Levels</h3>
              <p>Where price is likely to react.</p>
              <ul className="ticks">
                <li><b>Volume zones</b> with the dollar volume behind each one; overlaps show stronger</li>
                <li><b>Opens</b>: daily, weekly, monthly, quarterly, yearly, at their exact prices</li>
                <li><b>Regains and losses</b> of the opens, with alerts</li>
                <li><b>Structure</b>: HH, HL, LH, LL on the main swings</li>
                <li><b>Volume candles</b>: the candles that carried real volume stand out</li>
              </ul>
              <a href="#levels" className="btn btn-ghost">More on CF Levels</a>
            </div>
            <div className="card product">
              <span className="kind">Under the chart</span>
              <h3>Capital Flow Oscillator</h3>
              <p>When momentum, money and macro line up.</p>
              <ul className="ticks">
                <li><b>Momentum waves</b> with a higher-timeframe wave behind them</li>
                <li><b>Money flow</b> from buying vs selling volume, tested against real exchange data</li>
                <li><b>Capital flow</b> from eight markets: dollar, VIX, gold, yields, BTC, ETH, dominance, altcoins</li>
                <li><b>Graded dots</b> and the gold <b>Capital Flow signal</b>, plus Blue Wave and divergences</li>
                <li><b>Alerts</b> in plain English, and a status box that sums it up</li>
              </ul>
              <a href="#signal" className="btn btn-ghost">More on the oscillator</a>
            </div>
          </div>
          <p style={{ textAlign: 'center', marginTop: 28, color: 'var(--muted-2)' }}>
            How to use them together: <a href="/strategies" style={{ color: 'var(--brand-light)' }}>the Capital Flow playbook</a>.
          </p>
        </div>
      </section>

      <section className="problem" aria-labelledby="why">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Why capital flow</span>
            <h2 id="why">A stretched wave is only half the story.</h2>
            <p className="lead">
              Wave oscillators are good at telling you a move is stretched. They can&apos;t tell you whether the money
              behind it is still arriving or already leaving.
            </p>
          </div>
          <div className="grid-3">
            <div className="card">
              <span className="num">01</span>
              <h3>Momentum without context</h3>
              <p>A green dot at the bottom looks the same whether the dollar is ripping higher or money is rotating into crypto.</p>
            </div>
            <div className="card">
              <span className="num">02</span>
              <h3>Too many tabs</h3>
              <p>Checking DXY, VIX, yields, BTC.D and TOTAL3 by hand before every trade is slow, and easy to skip when the market moves fast.</p>
            </div>
            <div className="card">
              <span className="num">03</span>
              <h3>Signals that move after the fact</h3>
              <p>Lots of multi-timeframe tools read unfinished higher-timeframe bars, so their history looks better than it was live. This one only uses closed bars.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="signal" className="sig-section" aria-labelledby="sig-h">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">The signature signal</span>
            <h2 id="sig-h">
              The <span>Capital Flow</span> signal.
            </h2>
            <p className="lead">
              It fires only when momentum, money and macro agree on the same bar. Then the dot turns gold and gets a thin gold ring.
            </p>
          </div>
          <div className="trio">
            <div className="card">
              <span className="num">Momentum</span>
              <h3>The wave turns from a stretched level</h3>
              <p>The fast wave crosses after reaching the setup edge, the same stretch that A and B dots need.</p>
            </div>
            <div className="card">
              <span className="num">Money</span>
              <h3>Money flow turns the same way</h3>
              <p>Buying volume is rising into a long, or selling volume into a short, compared with three bars earlier.</p>
            </div>
            <div className="card">
              <span className="num">Macro</span>
              <h3>Capital flow is on the same side</h3>
              <p>The capital flow engine has confirmed a flip in the trade&apos;s direction and the score agrees. A passing blip doesn&apos;t count.</p>
            </div>
          </div>
          <p className="sig-note">
            <span className="ring" aria-hidden="true" />
            Rare by design, so some days it won&apos;t appear at all. It has its own alerts, &quot;Capital Flow LONG&quot; and
            &quot;Capital Flow SHORT&quot;, and the status box shows it in gold.
          </p>
        </div>
      </section>

      <section id="pane" aria-labelledby="pane-h">
        <div className="wrap">
          <div className="anatomy">
            <div>
              <span className="eyebrow">Reading the oscillator</span>
              <h2 id="pane-h">Timing from the waves, permission from the flow.</h2>
              <p className="lead">
                The waves show momentum. The band along the bottom shows whether capital agrees. Each wave turn is scored
                on five checks: stretched wave, higher-timeframe wave, money flow, capital flow and recent divergence.
                Only turns from a stretched wave can grade above C.
              </p>
              <p className="lead" style={{ marginTop: 16 }}>
                A compact status box in the corner shows the capital flow reading, wave direction, money flow, the latest
                divergence and the last graded signal, with its age in clock time.
              </p>
            </div>
            <ul className="legend-list">
              {legend.map((l) => (
                <li key={l.title}>
                  <span className="sw" style={l.sw} />
                  <span>
                    <b>{l.title}</b> {l.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="money-flow" aria-labelledby="mf-h">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Money flow, tested</span>
            <h2 id="mf-h">We checked it against real buy and sell volume.</h2>
            <p className="lead">
              Candle-based money flow is an estimate. To find the best one, we compared each method with Binance&apos;s
              actual taker buy and sell volume on BTC and ETH, on 15m, 1H and 4H charts, over three weeks to five months
              of data.
            </p>
          </div>
          <div className="mf-grid">
            <div className="card table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Method</th>
                    <th>Correlation with real flow</th>
                    <th>Turns that agree</th>
                  </tr>
                </thead>
                <tbody>
                  {mfTest.map((r) => (
                    <tr key={r.name} className={r.best ? 'best' : undefined}>
                      <td>{r.name}</td>
                      <td className="num-c">{r.corr}</td>
                      <td className="num-c">{r.turns}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="bt-meta">Correlation is between the smoothed money flow lines. Turns agree when both lines change direction the same way over three bars.</p>
            </div>
            <div className="card caveats" role="note" aria-label="Money flow caveats">
              <h3>What this does and doesn&apos;t mean</h3>
              <ul>
                <li><b>Best of the estimates, still an estimate.</b> It gets the turns right about three times in four. Exact aggressor data needs TradingView&apos;s footprint data on paid plans.</li>
                <li><b>One exchange, two coins.</b> We tested on Binance BTC and ETH. Other markets may behave differently.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="how" aria-labelledby="how-h">
        <div className="wrap engine">
          <div>
            <span className="eyebrow">The capital flow engine</span>
            <h2 id="how-h">Eight inputs in, one score out.</h2>
            <p className="lead">
              Each input has a preset direction for the market you&apos;re trading. For crypto, a rising dollar or VIX
              counts against you. The engine weights the inputs, checks how many agree, and gives a score from
              &minus;100% to +100%. That score drives the band, the flip dots, the grades and the Capital Flow signal.
            </p>
            <div className="engine-notes">
              <p>Before it flips direction, the score has to clear ±20% for two bars. That cuts down the whipsaw you get from a simple zero-cross.</p>
              <p>On equities, metals and forex charts the basket switches automatically, for example to SPY, QQQ and HYG for equities, or gold, silver and GDX for metals.</p>
            </div>
          </div>
          <div className="inputs" aria-label="Crypto preset inputs">
            {inputs.map((g) => (
              <div className="group" key={g.name}>
                <div className="group-head">
                  <span>{g.name}</span>
                  <span>{g.note}</span>
                </div>
                <div className="tickers">
                  {g.tickers.map(([t, dir]) => (
                    <span key={t} className={`ticker ${dir}`}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <p style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Colours show an example reading, not live data.</p>
          </div>
        </div>
      </section>

      <section id="levels" aria-labelledby="levels-h">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">New · the price-chart companion</span>
            <h2 id="levels-h">CF Levels: where price is likely to react.</h2>
            <p className="lead">
              The oscillator tells you when momentum, money and macro line up. CF Levels goes on the price chart and
              shows where: the zones with money behind them, the opens traders watch, and the moment price takes one
              back. It&apos;s free too, and doesn&apos;t need the oscillator to work.
            </p>
          </div>
          <div className="anatomy">
            <LevelsVisual />
            <ul className="legend-list">
              {levels.map((l) => (
                <li key={l.title}>
                  <span className="sw" style={l.sw} />
                  <span>
                    <b>{l.title}</b> {l.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="install" aria-labelledby="inst-h">
        <div className="wrap">
          <div className="section-head center">
            <span className="eyebrow">Get started</span>
            <h2 id="inst-h">Up and running in about two minutes.</h2>
            <p className="lead">All you need is a TradingView account. The free plan works.</p>
          </div>
          <div className="steps">
            <div className="card step">
              <h3>Open a chart</h3>
              <p>Open any symbol on TradingView. BTCUSDT on the 15m to 4H is a good place to start.</p>
            </div>
            <div className="card step">
              <h3>Add both indicators</h3>
              <p>
                Go to Indicators and search <code>Capital Flow Oscillator</code>, then add <code>Capital Flow Levels</code>{' '}
                to the price chart. Until they&apos;re in the public library, get the script links from our Telegram
                channel.
              </p>
            </div>
            <div className="card step">
              <h3>Set Money Flow Source</h3>
              <p>Leave it on Volume Delta, the tested default.</p>
            </div>
            <div className="card step">
              <h3>Set alerts</h3>
              <p>Create alerts for &quot;Capital Flow LONG / SHORT&quot;, graded dots or capital flow flips.</p>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <a href={TELEGRAM} target="_blank" rel="noopener" className="btn btn-primary">
              Get the script links on Telegram
            </a>
          </div>
        </div>
      </section>

      <section id="faq" aria-labelledby="faq-h">
        <div className="wrap">
          <div className="section-head center">
            <span className="eyebrow">FAQ</span>
            <h2 id="faq-h">Questions people ask.</h2>
          </div>
          <div className="faq">
            {faqs.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>
                  {a}
                  {q.startsWith('Is this financial') && (
                    <>
                      {' '}
                      <a href="/disclaimer" style={{ color: 'var(--brand-light)' }}>
                        Read the disclaimer
                      </a>
                      .
                    </>
                  )}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="final" aria-labelledby="final-h">
        <div className="wrap">
          <h2 id="final-h">Two free indicators. The whole picture.</h2>
          <p className="lead">Levels and volume on the chart, momentum, money flow and macro underneath. Use them to filter your own setups.</p>
          <div className="hero-ctas">
            <a href="#install" className="btn btn-primary">Get both indicators</a>
            <a href={TELEGRAM} target="_blank" rel="noopener" className="btn btn-ghost">
              Join the Telegram channel
            </a>
          </div>
        </div>
      </section>

      <section className="risk" aria-label="Risk disclaimer">
        <div className="wrap">
          <div className="risk-box">
            <strong>Risk disclaimer.</strong> Trading crypto, stocks, forex and other instruments involves substantial
            risk, and you can lose some or all of your capital. Leverage magnifies losses. The indicators, signals and
            reports on this site are for education only and are not financial advice. Past performance doesn&apos;t
            predict future results. <a href="/disclaimer">Read the full disclaimer</a>.
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div className="foot-links">
            <a href="/">Home</a>
            <a href="/signals">Live Signals</a>
            <a href="/strategies">Strategies</a>
            <a href="/methodology">Methodology</a>
            <a href="/reports">Reports</a>
            <a href="/about">About</a>
            <a href={TELEGRAM} target="_blank" rel="noopener">Telegram</a>
            <a href="/privacy">Privacy</a>
            <a href="/disclaimer">Disclaimer</a>
          </div>
          <p className="disclosure">
            Capital Flow is a free, independent project: two indicators, free on TradingView.
          </p>
          <p>
            WaveTrend by LazyBear; layout ideas from VuManChu&apos;s open-source oscillator. TradingView is a trademark of
            TradingView, Inc.
          </p>
        </div>
      </footer>
    </>
  );
}
