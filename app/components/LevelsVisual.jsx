// Illustration of CF Levels on a price chart: PVSRA candles, overlapping supply zones, a demand zone,
// daily / weekly opens, structure tags and a daily-open regain. Hand-drawn data, not a live chart.

const closes = [70, 72, 71, 74, 76, 75, 78, 80, 82, 78, 76, 77, 73, 70, 68, 65, 63, 60, 62, 61, 64, 67, 70, 74, 79, 75,
  72, 70, 68, 66.5, 65, 64, 63, 64, 67.5, 68, 69, 68.5, 70, 71, 70.5, 72, 71.5, 72.5];
const highs = { 8: 83, 24: 80.6 };
const lows = { 17: 59.3, 32: 62.3 };
const climax = { 9: 'dn', 17: 'dn', 20: 'up', 34: 'up' };
const rising = { 14: 'dn', 23: 'up', 30: 'dn', 38: 'up' };

const W = 600;
const x = (i) => 16 + i * 11;
const y = (p) => 18 + (86 - p) * (282 / 31);

const COL = {
  greyUp: '#9A9EA8', greyDn: '#4A4E58', climaxUp: '#00E676', climaxDn: '#FF1744', risingUp: '#2962FF', risingDn: '#E040FB',
  supply: '#E5383B', demand: '#2EBD59', open: '#7FB3C4', tag: '#8C919C',
};

function candleColour(i, up) {
  if (climax[i]) return climax[i] === 'up' ? COL.climaxUp : COL.climaxDn;
  if (rising[i]) return rising[i] === 'up' ? COL.risingUp : COL.risingDn;
  return up ? COL.greyUp : COL.greyDn;
}

export default function LevelsVisual() {
  const candles = closes.map((c, i) => {
    const o = i === 0 ? 69 : closes[i - 1];
    const up = c >= o;
    const hi = highs[i] ?? Math.max(o, c) + 0.6 + (i % 3) * 0.3;
    const lo = lows[i] ?? Math.min(o, c) - 0.6 - (i % 2) * 0.4;
    return { i, o, c, hi, lo, up };
  });
  const right = W - 8;

  return (
    <div className="hero-visual levels-visual">
      <div className="vis-head">
        <span><b>CF Levels</b> · on the price chart</span>
        <span>Illustration</span>
      </div>
      <svg viewBox={`0 0 ${W} 320`} role="img" aria-label="Illustration of CF Levels: volume zones with dollar volume and share labels, daily and weekly opens, structure tags and a daily open regain">
        {/* Supply zones: two overlapping zones show darker where they overlap, one label for the cluster */}
        <rect x={x(8) - 3} y={y(83)} width={right - x(8) + 3} height={y(79.5) - y(83)} fill={COL.supply} opacity="0.17" />
        <rect x={x(24) - 3} y={y(80.6)} width={right - x(24) + 3} height={y(77.5) - y(80.6)} fill={COL.supply} opacity="0.17" />
        <text x={right - 4} y={y(80.3)} textAnchor="end" className="lv-zone" fill={COL.supply}>$1.37B | 2.64%  x2</text>
        {/* Demand zone from the LL */}
        <rect x={x(17) - 3} y={y(62)} width={right - x(17) + 3} height={y(59.3) - y(62)} fill={COL.demand} opacity="0.22" />
        <text x={right - 4} y={y(60.4)} textAnchor="end" className="lv-zone" fill={COL.demand}>$594M | 4.11%</text>

        {/* Opens */}
        <line x1={x(12)} x2={right - 34} y1={y(70)} y2={y(70)} stroke={COL.open} strokeOpacity="0.6" />
        <text x={right - 30} y={y(70) + 3.5} className="lv-tag" fill={COL.open}>WO</text>
        <line x1={x(30)} x2={right - 34} y1={y(66.5)} y2={y(66.5)} stroke={COL.open} strokeOpacity="0.6" />
        <text x={right - 30} y={y(66.5) + 3.5} className="lv-tag" fill={COL.open}>DO</text>

        {/* Candles (PVSRA colours) */}
        {candles.map(({ i, o, c, hi, lo, up }) => {
          const col = candleColour(i, up);
          const top = y(Math.max(o, c));
          return (
            <g key={i}>
              <line x1={x(i)} x2={x(i)} y1={y(hi)} y2={y(lo)} stroke={col} strokeWidth="1" />
              <rect x={x(i) - 3} y={top} width="6" height={Math.max(1.5, y(Math.min(o, c)) - top)} fill={col} />
            </g>
          );
        })}

        {/* Structure tags */}
        <text x={x(8)} y={y(83) - 6} textAnchor="middle" className="lv-tag" fill={COL.tag}>HH</text>
        <text x={x(24)} y={y(80.6) - 6} textAnchor="middle" className="lv-tag" fill={COL.tag}>LH</text>
        <text x={x(17)} y={y(59.3) + 13} textAnchor="middle" className="lv-tag" fill={COL.tag}>LL</text>
        <text x={x(32)} y={y(62.3) + 13} textAnchor="middle" className="lv-tag" fill={COL.tag}>HL</text>

        {/* Regain: a close back above the daily open after closes below it */}
        <text x={x(34)} y={y(lows[34] ?? 63.2) + 26} textAnchor="middle" className="lv-tag" fill={COL.demand}>DO ↑</text>
      </svg>
      <div className="vis-note">Volume zones, opens, structure and volume candles. The data is drawn for illustration.</div>
    </div>
  );
}
