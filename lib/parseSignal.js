// Reads type, direction, ticker and timeframe out of a TradingView alert message.
// Handles the CF Osc messages ("🟢 A-grade LONG · BTCUSDT.P 15m\nPrice ...") and the older
// CF Filter overlay ones ("↘️ FLIP BEARISH | BTCUSDT 60 | Score: -6% ..."). Only the first line
// is used for type and direction, because the later lines explain the signal and mention both sides.

// TradingView's timeframe.period: "5", "60", "240" (minutes), "1D", "W", "1M", or our own "15m"/"4h"
function normaliseTimeframe(raw) {
  if (!raw) return null;
  const s = raw.trim();
  const word = { daily: '1D', weekly: '1W', monthly: '1M' }[s.toLowerCase()];
  if (word) return word;
  let m = s.match(/^(\d+)\s*([smhdwM]?)$/i);
  if (!m) m = s.match(/^(\d*)([DWM])$/);
  if (!m) return null;
  const n = m[1] === '' ? 1 : parseInt(m[1], 10);
  const unit = m[2];
  if (unit === '' ) {
    // bare number = minutes
    if (n % 1440 === 0) return `${n / 1440}D`;
    if (n % 60 === 0) return `${n / 60}H`;
    return `${n}m`;
  }
  if (/^s$/i.test(unit)) return `${n}s`;
  if (unit === 'm') return n % 60 === 0 ? `${n / 60}H` : `${n}m`;
  if (/^h$/i.test(unit)) return `${n}H`;
  if (/^d$/i.test(unit)) return `${n}D`;
  if (/^w$/i.test(unit)) return `${n}W`;
  if (unit === 'M') return `${n}M`;
  return null;
}

export function parseSignalMessage(message) {
  const text = String(message || '');
  const first = text.split('\n')[0];
  const low = first.toLowerCase();

  let signalType = 'signal';
  if (low.includes('capital flow long') || low.includes('capital flow short')) signalType = 'capital_flow';
  else if (low.includes('blue wave')) signalType = 'blue_wave';
  else if (/\b[ab]-grade\b/.test(low)) signalType = low.includes('a-grade') ? 'grade_a' : 'grade_b';
  else if (low.includes('target')) signalType = 'target';
  else if (low.includes('turned against')) signalType = 'exit';
  else if (low.includes('full send') || first.includes('🚀')) signalType = 'full_send';
  else if (low.includes('confluence')) signalType = 'confluence';
  else if (low.includes('manipulation') || first.includes('🐋')) signalType = 'manipulation';
  else if (low.includes('divergence')) signalType = 'divergence';
  else if (low.includes('flip')) signalType = 'flip';

  let direction = 'neutral';
  if (signalType === 'exit' || signalType === 'target') direction = 'neutral';
  else if (/\b(bull|bullish|long)\b/.test(low) || first.includes('🟢') || first.includes('📈')) direction = 'bullish';
  else if (/\b(bear|bearish|short)\b/.test(low) || first.includes('🔴') || first.includes('📉')) direction = 'bearish';

  // "· BTCUSDT.P 15m" / "· BTCUSDT Daily" (CF Osc) or "| BTCUSDT 60 |" (overlay)
  let ticker = 'BTC';
  let timeframe = 'unknown';
  const m = first.match(/[·|]\s*([A-Z0-9][A-Z0-9._!:-]*)\s+(\d+[smhHdwM]?|\d*[DWM]|Daily|Weekly|Monthly)\b/);
  if (m) {
    ticker = m[1].replace(/^[A-Z]+:/, '').replace(/\.P$/, '').replace(/(USDT|USDC|USD|PERP)$/, '') || m[1];
    timeframe = normaliseTimeframe(m[2]) || 'unknown';
  }

  return { message: text, signalType, direction, timeframe, ticker };
}
