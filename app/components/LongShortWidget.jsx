'use client';

import { useEffect, useState } from 'react';
import './long-short-widget.css';

// One bar row (now / 24 hours ago)
function BarRow({ period, label, data }) {
  const longPct = data ? data.longPct : 50;
  const shortPct = data ? data.shortPct : 50;
  const longText = data ? data.longPct.toFixed(1) + '%' : '50%';
  const shortText = data ? data.shortPct.toFixed(1) + '%' : '50%';
  const hideLong = data ? data.longPct < 30 : false;
  const hideShort = data ? data.shortPct < 30 : false;

  return (
    <div className="ls-bar-row">
      <span className="ls-period-label">{label}</span>
      <div className="ls-bar-wrapper">
        <div className="ls-bar">
          <div className="ls-bar-long" id={`ls-bar-${period}-long`} style={{ width: longPct + '%' }}>
            <span className={`ls-bar-pct${hideLong ? ' hidden' : ''}`} id={`ls-pct-${period}-long`}>
              {longText}
            </span>
          </div>
          <div className="ls-bar-short" id={`ls-bar-${period}-short`} style={{ width: shortPct + '%' }}>
            <span className={`ls-bar-pct${hideShort ? ' hidden' : ''}`} id={`ls-pct-${period}-short`}>
              {shortText}
            </span>
          </div>
        </div>
      </div>
      <span className="ls-value-label long" id={`ls-value-${period}`}>
        {data ? data.longPct.toFixed(1) + '% L' : '--'}
      </span>
    </div>
  );
}

// Trend: now vs 24 hours ago
function getTrend(data1H, data1D) {
  const diff = data1H.longPct - data1D.longPct;
  const absDiff = Math.abs(diff).toFixed(1);

  if (diff > 0.5) {
    return { cls: 'more-long', icon: '📈', text: `Getting MORE long (+${absDiff}%)` };
  }
  if (diff < -0.5) {
    return { cls: 'more-short', icon: '📉', text: `Getting MORE short (${diff.toFixed(1)}%)` };
  }
  return { cls: 'steady', icon: '➡️', text: 'Holding steady' };
}

export default function LongShortWidget() {
  const [data1H, setData1H] = useState(null);
  const [data1D, setData1D] = useState(null);
  const [trend, setTrend] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchAllData() {
      try {
        // OKX's 1H and 1D series both start with the same latest reading, so compare now with 24 hours ago
        const res1H = await fetch('/api/long-short-ratio?period=1H');
        const json1H = await res1H.json();
        const json1D = json1H && json1H.prev24;
        for (const d of [json1H, json1D]) {
          if (!d || typeof d.longPct !== 'number' || typeof d.shortPct !== 'number') {
            throw new Error('Invalid long/short payload');
          }
        }
        const nextTrend = getTrend(json1H, json1D);

        if (cancelled) return;
        setData1H(json1H);
        setData1D(json1D);
        setTrend(nextTrend);
        setError(false);
      } catch (err) {
        console.error('Error fetching L/S:', err);
        if (!cancelled) setError(true);
      }
    }

    // Initial fetch
    fetchAllData();

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchAllData, 5 * 60 * 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // The error text replaces the trend badge's contents but keeps its last class
  let trendIcon = null;
  let trendText = 'Loading...';
  if (error) {
    trendIcon = '—';
    trendText = 'Error loading data';
  } else if (trend) {
    trendIcon = trend.icon;
    trendText = trend.text;
  }

  return (
    <div id="ls-widget">
      <div className="ls-widget">
        <div className="ls-header">
          <div className="ls-header-left">
            <span className="ls-emoji">📊</span>
            <span className="ls-title">Retail Positioning</span>
          </div>
          <span className="ls-source">OKX</span>
        </div>

        <div className="ls-bars-container">
          <BarRow period="1h" label="Now" data={data1H} />
          <BarRow period="1d" label="24h ago" data={data1D} />
        </div>

        <div className="ls-trend-section">
          <div className={`ls-trend-badge ${trend ? trend.cls : 'steady'}`} id="ls-trend">
            {trendIcon !== null && <span>{trendIcon}</span>}
            <span>{trendText}</span>
          </div>
          <div className="ls-status-row">
            {/* Crowding status based on 1H (most recent) */}
            <div className={`ls-status-badge ${data1H ? data1H.crowding : 'balanced'}`} id="ls-status">
              <span>{data1H ? data1H.emoji : '⚖️'}</span>
              <span>{data1H ? data1H.label : 'Loading...'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
