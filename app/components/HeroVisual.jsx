// Stylised illustration of the CF Osc pane (not live data)
export default function HeroVisual() {
  return (
    <div
      className="hero-visual"
      role="img"
      aria-label="Illustration of the Capital Flow Oscillator pane with momentum waves, money flow, the capital flow band and signal dots"
    >
      <div className="vis-head">
        <span>
          <b>CF Osc</b> · BTCUSDT · 4H
        </span>
        <span>Illustration</span>
      </div>
      <svg viewBox="0 0 520 260" aria-hidden="true">
        <defs>
          <linearGradient id="mf" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#00d27a" stopOpacity=".45" />
            <stop offset="1" stopColor="#00d27a" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="mfr" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#ff4d4d" stopOpacity=".45" />
            <stop offset="1" stopColor="#ff4d4d" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="520" height="260" fill="#0d0d0d" />
        <g stroke="#1d1d1d" strokeWidth="1">
          <line x1="0" y1="45" x2="520" y2="45" />
          <line x1="0" y1="110" x2="520" y2="110" />
          <line x1="0" y1="175" x2="520" y2="175" />
        </g>
        {/* yellow momentum behind the money flow */}
        <path
          d="M0 110 C30 118 60 128 90 124 S140 112 170 108 S230 96 270 98 S340 104 380 96 S460 90 520 94 L520 110 L0 110Z"
          fill="#f5c542"
          opacity=".18"
        />
        {/* money flow */}
        <path d="M0 110 C40 125 70 140 110 132 S170 112 200 110 L200 110 L0 110Z" fill="url(#mfr)" />
        <path d="M200 110 C240 92 280 80 330 86 S420 96 460 84 S500 80 520 78 L520 110 L200 110Z" fill="url(#mf)" />
        {/* higher-timeframe wave */}
        <path
          d="M0 160 C80 190 150 150 220 110 S360 80 430 96 S500 92 520 88"
          fill="none"
          stroke="#b4a7d6"
          strokeOpacity=".45"
          strokeWidth="3"
        />
        {/* waves */}
        <path
          d="M0 150 C40 175 70 190 100 178 S150 120 190 95 S250 55 290 70 S340 120 370 125 S430 75 470 58 S510 52 520 55"
          fill="none"
          stroke="#4aa3ff"
          strokeWidth="2.4"
        />
        <path
          d="M0 140 C40 165 72 186 104 182 S152 132 196 104 S256 62 296 64 S344 112 374 130 S432 86 474 66 S512 58 520 60"
          fill="none"
          stroke="#2a5d99"
          strokeWidth="2"
        />
        {/* RSI edge cue */}
        <path d="M455 64 C470 57 495 52 520 55" fill="none" stroke="#ff4d4d" strokeWidth="3" />
        {/* divergence */}
        <line x1="104" y1="181" x2="372" y2="127" stroke="#00d27a" strokeWidth="1.2" strokeDasharray="4 4" />
        {/* dots: small cross dots, A dot, and the Capital Flow signal (gold dot in a gold ring) */}
        <circle cx="104" cy="181" r="4" fill="#00d27a" />
        <circle cx="292" cy="66" r="4" fill="#ff4d4d" />
        <circle cx="372" cy="127" r="4.5" fill="#FFD54F" />
        <circle cx="372" cy="127" r="8" fill="none" stroke="#FFD54F" strokeWidth="1.2" />
        <text x="384" y="150" fill="#FFD54F" fontSize="10" fontFamily="Inter" fontWeight="600">
          Capital Flow
        </text>
        {/* capital flow band */}
        <g>
          <rect x="0" y="232" width="150" height="14" fill="#5a1d1d" />
          <rect x="150" y="232" width="70" height="14" fill="#2a2a2a" />
          <rect x="220" y="232" width="110" height="14" fill="#134a33" />
          <rect x="330" y="232" width="190" height="14" fill="#00a862" />
          <circle cx="220" cy="239" r="3.5" fill="#00d27a" stroke="#0d0d0d" strokeWidth="1" />
        </g>
        <text x="6" y="226" fill="#9a9a9a" fontSize="10" fontFamily="Inter">
          capital flow band
        </text>
        <text x="514" y="226" fill="#00d27a" fontSize="10" fontFamily="Inter" fontWeight="600" textAnchor="end">
          ▲ CAPITAL FLOW IN
        </text>
      </svg>
      <div className="score-panel">
        <div>
          Capital flow<strong style={{ color: 'var(--green)' }}>▲ +62%</strong>
        </div>
        <div>
          Money flow<strong style={{ color: 'var(--green)' }}>buyers ↗</strong>
        </div>
        <div>
          Last signal<strong style={{ color: 'var(--gold)' }}>Capital Flow</strong>
        </div>
      </div>
      <p className="vis-note">Stylised illustration of the indicator layout, not a live reading or a real trade.</p>
    </div>
  );
}
