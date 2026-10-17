'use client';

import { useEffect, useState } from 'react';

// Delayed signals feed: shows signals from 24+ hours ago (from /api/signals)

function getSignalIcon(signalType, direction) {
  if (signalType === 'capital_flow') return '◉';
  if (signalType === 'grade_a' || signalType === 'grade_b') return direction === 'bearish' ? '▼' : '▲';
  if (signalType === 'blue_wave') return '◆';
  if (signalType === 'target') return '◇';
  if (signalType === 'exit') return '×';
  if (signalType === 'full_send') return '🚀';
  if (signalType === 'confluence') return '⭐';
  if (signalType === 'manipulation') return '🐋';
  if (signalType === 'divergence') return '📊';
  if (signalType === 'flip') return '🔄';
  if (direction === 'bullish') return '📈';
  if (direction === 'bearish') return '📉';
  return '📡';
}

function formatTimeAgo(timestamp) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  return `${hours}h ago`;
}

function cleanMessage(message) {
  // Headline only (CF Osc alerts are multi-line), without HTML tags and emojis
  return message
    .split('\n')[0]
    .replace(/<[^>]*>/g, '')
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
    .trim()
    .substring(0, 80);
}

function Empty({ title, note }) {
  return (
    <div className="signals-empty">
      <div className="signals-empty-icon">📡</div>
      <p>{title}</p>
      {note && <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>{note}</p>}
    </div>
  );
}

export default function SignalsFeed() {
  // undefined = loading, null = error, [] = no signals
  const [signals, setSignals] = useState(undefined);

  useEffect(() => {
    fetch('/api/signals')
      .then((r) => r.json())
      .then((data) => setSignals(data.signals || []))
      .catch((error) => {
        console.log('Could not fetch signals:', error);
        setSignals(null);
      });
  }, []);

  return (
    <div className="signals-feed" id="signals-feed">
      {signals === undefined && <Empty title="Loading signal feed..." />}
      {signals === null && <Empty title="Signal feed coming soon" note="Join Telegram for live signals now" />}
      {signals?.length === 0 && (
        <Empty
          title="No CF Osc alerts in the feed yet"
          note="The channel only posts the strongest signals on BTC 1H, so some days are quiet. Each one appears here 24 hours after Telegram gets it."
        />
      )}
      {signals?.map((signal, i) => (
        <div className="feed-item" key={signal.timestamp + i}>
          <div className={`feed-item-indicator ${signal.direction}`}></div>
          <span className="feed-item-icon">{getSignalIcon(signal.signalType, signal.direction)}</span>
          <div className="feed-item-content">
            <div className="feed-item-header">
              <span className="feed-item-ticker">{signal.ticker}</span>
              <span className="feed-item-tf">{signal.timeframe}</span>
              <span className={`feed-item-type ${signal.direction}`}>{signal.direction.toUpperCase()}</span>
            </div>
            <div className="feed-item-message" title={signal.message.replace(/<[^>]*>/g, '')}>{cleanMessage(signal.message)}</div>
          </div>
          <span className="feed-item-time">{formatTimeAgo(signal.timestamp)}</span>
        </div>
      ))}
    </div>
  );
}
