import './methodology.css';
import Logo from '../components/Logo';
import SignalMark from '../components/SignalMark';
import SuggestWidget from '../components/SuggestWidget';

export const metadata = {
  title: 'Methodology | Capital Flow',
  description:
    'How the Capital Flow indicators work: the eight-market capital flow engine, the CF Osc waves, money flow, grades and signals, and how CF Levels builds its zones, opens and volume candles.',
};

const presets = [
  ['Crypto', 'DXY, VIX, Gold, US10Y', 'BTC, ETH', 'BTC.D (inverted), TOTAL3'],
  ['Equities', 'DXY, VIX, US10Y, HYG', 'SPY, QQQ', 'IWM, XLU'],
  ['Metals', 'DXY, US10Y, VIX, SPX', 'Gold, Silver', 'GDX, TIP'],
  ['Forex', 'US10Y, VIX, SPX, Gold', 'base and quote currency indexes', 'AUDJPY, Oil'],
  ['Custom', 'your 4 symbols', 'your 2 symbols', 'your 2 symbols'],
];

const modes = [
  ['Scalp', '1m to 15m', '5m, 15m, 1H', 'Macro read as a 1H/4H/1D backdrop at 0.6 weight. On crypto the leader and sector slots switch to order flow: open interest x price, Coinbase premium and perp basis.'],
  ['Intraday', '30m to 4H', '15m, 1H, 4H', 'The standard mode for most charts.'],
  ['Swing', 'Daily and above', '4H, 1D, 1W', 'Slower, for position trades.'],
];

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
          <span className="page-badge">Methodology</span>
          <h1>How the indicators work</h1>
          <p className="subtitle">
            The capital flow engine, the Capital Flow Oscillator and CF Levels, explained part by part. Nothing here is a
            black box: both scripts are open source on TradingView.
          </p>
        </div>

        <div className="section-card">
          <h3>The idea</h3>
          <p>
            Price follows money. A wave oscillator tells you when a move is stretched and turning, but not whether the
            money across markets agrees. The capital flow engine reads eight markets that move crypto (the dollar,
            volatility, gold, yields, the leaders and where capital sits within crypto) and turns them into one score.
            The oscillator puts that score under the waves; CF Levels shows where on the price chart a trade has a
            level to lean on.
          </p>
        </div>

        <h2>1. The capital flow engine</h2>
        <h3>The eight inputs (crypto preset)</h3>
        <p>
          Each input has a preset direction: for crypto a rising dollar, VIX, gold or yields counts against you, and
          rising BTC.D means money leaving the alts.
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

        <h3>Other markets</h3>
        <p>The basket switches with the chart&apos;s instrument (Market = Auto), or you can pick one.</p>
        <table className="alt-table">
          <thead>
            <tr><th>Market</th><th>Macro</th><th>Leaders</th><th>Sectors</th></tr>
          </thead>
          <tbody>
            {presets.map(([m, macro, lead, sec]) => (
              <tr key={m}><td><strong>{m}</strong></td><td>{macro}</td><td>{lead}</td><td>{sec}</td></tr>
            ))}
          </tbody>
        </table>

        <h3>From inputs to a score</h3>
        <div className="framework-box">
          <ul className="framework-list">
            <li><span><strong>Flow:</strong> for each input, the rate of change over 14 bars, smoothed with an EMA of the same length.</span></li>
            <li><span><strong>Three timeframes:</strong> each input is read on three timeframes, weighted 1, 2 and 3 so the higher timeframe counts most. Which three depends on the mode (below).</span></li>
            <li><span><strong>Signal:</strong> a flow beyond a threshold (0.5% by default; volatility-scaled in Scalp mode) counts as bullish or bearish for the market you are on.</span></li>
            <li><span><strong>Accuracy weighting:</strong> each input is scored on how often it agreed with price over a lookback (200 bars on a 1H chart). An input that has been right or wrong most of the time gets up to full weight; one at a coin flip gets 20%. One that has been wrong most of the time has its sign flipped.</span></li>
            <li><span><strong>Groups:</strong> macro, leaders and sectors are combined with group weights (on BTC: 1.2, 1.0 and 0.8).</span></li>
            <li><span><strong>Score:</strong> the weighted result, from &minus;100% to +100%, lightly smoothed. The status box shows it with how many of the eight markets agree.</span></li>
            <li><span><strong>Flips:</strong> capital flow only changes side when the score holds past ±20% for 2 bars. That cuts the whipsaw of a simple zero cross.</span></li>
          </ul>
        </div>
        <table className="alt-table">
          <thead>
            <tr><th>Mode</th><th>Charts</th><th>Data read</th><th>Notes</th></tr>
          </thead>
          <tbody>
            {modes.map(([m, charts, tfs, notes]) => (
              <tr key={m}><td><strong>{m}</strong></td><td>{charts}</td><td>{tfs}</td><td>{notes}</td></tr>
            ))}
          </tbody>
        </table>

        <h2>2. Capital Flow Oscillator</h2>
        <div className="section-card">
          <h3>Waves</h3>
          <p>
            The fast and slow momentum waves use LazyBear&apos;s open-source WaveTrend formula: distance from an average,
            scaled by its typical deviation, then smoothed. Lines at ±53 and ±60 mark stretched readings. A soft
            lavender curve behind them is the same wave one timeframe up (1H on 15m, 4H on 1H, daily on 4H), from closed
            higher-timeframe bars only.
          </p>
          <h3>Money flow</h3>
          <p>
            Each lower-timeframe candle inside a bar is split by its body as a share of its range (a full green body
            counts as all buying), weighted by volume, then smoothed into a curve. We checked this against Binance&apos;s
            real taker buy and sell volume on BTC and ETH from 15m to 4H: it tracked real flow better than the
            close-location split and the classic candle-body average (correlation about 0.45 to 0.6, turns agreeing about
            70 to 75% of the time). It is still an estimate: exact aggressor data needs TradingView&apos;s footprint data.
          </p>
          <h3>Yellow wave</h3>
          <p>
            By default the gap between the fast and slow waves, which turns before they cross. Optionally (Yellow Wave =
            VWAP Distance) it shows how far price is from a rolling 50-bar VWAP, or a session VWAP, in standard
            deviations, so the way it curves through zero shows whether price is pulling away from where the volume
            traded or being drawn back.
          </p>
          <h3>Grades</h3>
          <p>
            Every wave cross is scored on five checks: the wave was stretched (touched ±53 in the last 5 bars), the
            higher-timeframe wave agrees, money flow agrees, capital flow agrees, and there was a recent divergence.
            Only turns from a stretched wave can grade above C.
          </p>
          <ul>
            <li><span className="mark-inline"><SignalMark kind="grade_a" size={16} /></span> <strong>A grade:</strong> stretched plus at least 3 of the other 4, a dot with a thin ring</li>
            <li><span><strong>B grade:</strong> stretched plus 2 more, an outlined dot</span></li>
            <li><span><strong>C grade:</strong> the rest, a small dot (none on small crosses near zero)</span></li>
          </ul>
          <h3>Capital Flow signal <span className="mark-inline"><SignalMark kind="capital_flow" size={18} /></span></h3>
          <p>
            A gold dot in a gold ring when three things line up on one bar: the wave turns from a stretched level, money
            flow is turning the same way (against 3 bars ago), and capital flow is confirmed on the same side with the
            score agreeing. It is rare by design.
          </p>
          <h3>Blue Wave <span className="mark-inline"><SignalMark kind="blue_wave" size={16} /></span></h3>
          <p>
            A deep first dip (past ±53, the deepest in the last 40 bars), then a shallower second one (at most 80% as
            deep) without the wave bouncing far past zero in between. It fires when the second dip turns and money flow
            has moved the trade&apos;s way over the last 5 bars. One signal per first dip.
          </p>
          <h3>Divergences</h3>
          <p>
            Price swings are compared with the wave, RSI and money flow at the same points, for regular and hidden
            divergences, with a strength of 1 to 3 for how many agree. Lines are drawn when the wave itself diverges and at
            least two agree; hidden ones count towards the grades without a line.
          </p>
          <h3>Flow exit <span className="mark-inline"><SignalMark kind="exit" size={16} /></span></h3>
          <p>A grey x when capital flow turns against the last graded long or short: a prompt to review the trade.</p>
        </div>

        <h2>3. CF Levels</h2>
        <div className="section-card">
          <h3>Volume zones</h3>
          <p>
            A swing high or low needs 10 lower highs or higher lows on each side. The zone is the swing candle from its
            wick to its body, kept between half and one ATR tall. Its label gives the dollar volume of the swing candle
            and the candles either side of it (volume x price), and that volume&apos;s share of the last 500 bars. Zones
            that overlap stay as separate see-through boxes, so the overlap shows darker, with one label for the cluster
            (x2, x3). A zone is removed once a candle closes through it.
          </p>
          <h3>Opens and regains</h3>
          <p>
            Daily, weekly, monthly, quarterly and yearly opens are drawn at their exact prices; only identical prices
            share a tag. A regain is a candle closing back above an open after price had closed below it for at least 2
            candles (a loss is the reverse), so chop around a level doesn&apos;t count.
          </p>
          <h3>Structure and volume candles</h3>
          <p>
            HH, HL, LH and LL tags use a longer swing (20 bars each side) than the zones, so only the main swings are
            tagged. Candles are coloured by the PVSRA method: climax (at least double the average volume of the last 10
            candles, or the biggest volume x range of them) in green or red, rising volume (150%) in blue or violet, the
            rest grey.
          </p>
        </div>

        <h2>4. Data and repainting</h2>
        <div className="framework-box">
          <ul className="framework-list">
            <li><span><strong>Closed bars only</strong> for higher-timeframe and capital flow data, so past signals stay where they were drawn. The current bar moves until it closes.</span></li>
            <li><span><strong>Swings are confirmed late by design:</strong> CF Levels zones and structure tags appear 10 or 20 bars after the swing, and divergences 2 bars after.</span></li>
            <li><span><strong>Macro markets have hours.</strong> The dollar, VIX and yields only move during their sessions, so capital flow changes less at weekends.</span></li>
            <li><span><strong>Volume differs by exchange.</strong> Dollar volumes and money flow come from the chart&apos;s own data.</span></li>
            <li><span><strong>No published track record.</strong> These are tools for reading the chart, not a system with promised results.</span></li>
          </ul>
        </div>

        <div className="cta-section">
          <h3>See it on a chart</h3>
          <p style={{ color: 'var(--gray-light)' }}>
            Both indicators are free on TradingView. The playbook shows one way to use them together.
          </p>
          <div className="cta-buttons">
            <a href="/#install" className="btn btn-primary">Get the indicators</a>
            {' '}
            <a href="/strategies" className="btn btn-secondary">Read the playbook</a>
          </div>
        </div>
      </div>
      <footer>
        <div className="footer-links">
          <a href="/">Home</a>
          {' '}
          <a href="/about">About</a>
          {' '}
          <a href="/strategies">Playbook</a>
          {' '}
          <a href="/signals">Live Signals</a>
          {' '}
          <a href="/disclaimer">Disclaimer</a>
        </div>
        <p className="copyright">Built by traders, for traders.</p>
      </footer>
      <SuggestWidget />
    </>
  );
}
