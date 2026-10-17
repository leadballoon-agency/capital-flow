// The CF Osc's chart marks, drawn small for the site: Capital Flow = dot in a thin gold ring, A-grade = dot in a
// thin green / red ring, Blue Wave = blue diamond, flow exit = grey x. Same colours as the indicator.
const GREEN = '#00d27a';
const RED = '#ff4d4d';
const GOLD = '#f3c754';
const BLUE = '#4aa3ff';
const GREY = '#9e9e9e';

export default function SignalMark({ kind, dir = 'bullish', size = 18 }) {
  const c = dir === 'bearish' ? RED : GREEN;
  let body;
  if (kind === 'capital_flow') {
    body = (
      <>
        <circle cx="10" cy="10" r="7.4" fill="none" stroke={GOLD} strokeWidth="1.6" />
        <circle cx="10" cy="10" r="3.6" fill={c} />
      </>
    );
  } else if (kind === 'grade_a') {
    body = (
      <>
        <circle cx="10" cy="10" r="7" fill="none" stroke={c} strokeWidth="1.3" />
        <circle cx="10" cy="10" r="3.6" fill={c} />
      </>
    );
  } else if (kind === 'grade_b') {
    body = <circle cx="10" cy="10" r="4.4" fill={c} stroke="#e6e9ef" strokeWidth="1" />;
  } else if (kind === 'blue_wave') {
    body = <rect x="5.5" y="5.5" width="9" height="9" fill={BLUE} transform="rotate(45 10 10)" />;
  } else if (kind === 'exit') {
    body = <path d="M5.5 5.5 L14.5 14.5 M14.5 5.5 L5.5 14.5" stroke={GREY} strokeWidth="2" strokeLinecap="round" />;
  } else {
    body = <circle cx="10" cy="10" r="3.6" fill={c} />;
  }
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      {body}
    </svg>
  );
}
