'use client';

import { useEffect, useState } from 'react';
import './fear-greed-widget.css';

// Full length of the gauge arc (half circle, r = 60)
const ARC_LENGTH = 188.5;

// Alignment of the F&G reading with the latest Capital Flow signal
function getAlignment(fngData, signal) {
  const signalDirection = signal || 'neutral'; // 'bullish', 'bearish', or 'neutral'

  if (signalDirection === 'bullish') {
    // Bullish signal + Fear = Confirms (contrarian buy)
    // Bullish signal + Greed = Diverges (crowded trade)
    if (fngData.is_fear) {
      return { cls: 'confirms', icon: '✓', text: fngData.is_extreme ? 'Strong confirmation' : 'Confirms bullish' };
    }
    if (fngData.is_greed) {
      return { cls: 'diverges', icon: '⚠', text: fngData.is_extreme ? 'Caution: extreme greed' : 'Watch for pullback' };
    }
    return { cls: 'neutral', icon: '—', text: 'Neutral sentiment' };
  }

  if (signalDirection === 'bearish') {
    // Bearish signal + Greed = Confirms (distribution)
    // Bearish signal + Fear = Diverges (capitulation?)
    if (fngData.is_greed) {
      return { cls: 'confirms', icon: '✓', text: fngData.is_extreme ? 'Strong confirmation' : 'Confirms bearish' };
    }
    if (fngData.is_fear) {
      return { cls: 'diverges', icon: '⚠', text: fngData.is_extreme ? 'Possible capitulation' : 'Watch for bounce' };
    }
    return { cls: 'neutral', icon: '—', text: 'Neutral sentiment' };
  }

  if (signalDirection === 'neutral') {
    return { cls: 'neutral', icon: '—', text: 'Awaiting signal' };
  }

  // Unknown signal value: the original left the alignment untouched
  return null;
}

export default function FearGreedWidget() {
  const [data, setData] = useState(null);
  const [alignment, setAlignment] = useState({ cls: 'neutral', icon: '—', text: 'Checking signal...' });
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timer = null;

    async function fetchFNG() {
      try {
        const response = await fetch('/api/fear-greed');
        const json = await response.json();

        // Try to get latest signal from reports
        let signal = 'neutral';
        try {
          const reportsResponse = await fetch('/reports-data.json');
          const reports = await reportsResponse.json();
          if (reports && reports.length > 0) {
            signal = reports[0].signal; // 'bullish', 'bearish', or 'neutral'
          }
        } catch (e) {
          // Ignore if reports not available
        }

        if (cancelled) return;
        setData(json);
        setError(false);
        const next = getAlignment(json, signal);
        if (next) setAlignment(next);

        // Schedule next update (every hour)
        timer = setTimeout(fetchFNG, 60 * 60 * 1000);
      } catch (err) {
        console.error('Error fetching F&G:', err);
        if (cancelled) return;
        // Like the original: value/label show the error, the gauge keeps its last reading
        setError(true);
      }
    }

    fetchFNG();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  const value = data ? data.value : null;
  // Needle rotation (-90deg = 0, 90deg = 100)
  const rotation = value != null ? -90 + (value / 100) * 180 : -90;
  // Arc fill (188.5 is full arc length)
  const dashOffset = value != null ? ARC_LENGTH - (value / 100) * ARC_LENGTH : ARC_LENGTH;
  const colorStyle = data ? { color: data.color } : undefined;

  let labelText = 'Loading...';
  if (error) labelText = 'Error loading';
  else if (data) labelText = data.classification;

  return (
    <div id="fng-widget">
      <div className="fng-widget">
        <div className="fng-header">
          <span className="fng-emoji">{data ? data.emoji : '😨'}</span>
          <span className="fng-title">Fear &amp; Greed Index</span>
        </div>
        <div className="fng-gauge-container">
          <svg className="fng-gauge-bg" viewBox="0 0 160 160">
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff4444" />
                <stop offset="25%" stopColor="#ff8844" />
                <stop offset="50%" stopColor="#ffcc00" />
                <stop offset="75%" stopColor="#88cc44" />
                <stop offset="100%" stopColor="#00cc44" />
              </linearGradient>
            </defs>
            {/* Background arc */}
            <path
              d="M 20 80 A 60 60 0 0 1 140 80"
              fill="none"
              stroke="#1a1a1a"
              strokeWidth="12"
              strokeLinecap="round"
            />
          </svg>
          <svg className="fng-gauge-fill" viewBox="0 0 160 160">
            {/* Filled arc */}
            <path
              id="fng-arc"
              d="M 20 80 A 60 60 0 0 1 140 80"
              fill="none"
              stroke="url(#gaugeGradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray="188.5"
              strokeDashoffset="188.5"
              style={{ strokeDashoffset: dashOffset }}
            />
          </svg>
          <div
            className="fng-needle"
            id="fng-needle"
            style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
          />
          <div className="fng-center" />
        </div>
        <div className="fng-value-container">
          <div className="fng-value" id="fng-value" style={colorStyle}>
            {data && !error ? data.value : '--'}
          </div>
          <div className="fng-label" id="fng-label" style={colorStyle}>
            {labelText}
          </div>
        </div>
        <div className={`fng-alignment ${alignment.cls}`} id="fng-alignment">
          <span>{alignment.icon}</span>
          <span>{alignment.text}</span>
        </div>
        <div className="fng-scale">
          <span className="fng-scale-label fear">Extreme Fear</span>
          <span className="fng-scale-label greed">Extreme Greed</span>
        </div>
      </div>
    </div>
  );
}
