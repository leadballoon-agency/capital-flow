'use client';

import { useEffect, useState } from 'react';

// Homepage preview of the newest daily report (from /reports-data.json)
export default function LatestReportCard() {
  const [card, setCard] = useState({
    image: '',
    date: 'Loading...',
    signal: '--',
    signalClass: '',
    price: '--',
    fg: 'F&G: --',
    excerpt: 'Loading latest report...',
  });

  useEffect(() => {
    fetch('/reports-data.json')
      .then((r) => r.json())
      .then((reports) => {
        if (!reports || reports.length === 0) return;
        const latest = reports[0];
        const signal = latest.signal.toLowerCase();
        const priceMatch = latest.reportText.match(/PRICE:\s*\$([0-9,]+)/);
        const analysisMatch = latest.reportText.match(/ANALYSIS:\s*\n([^\n]+)/);
        setCard((c) => ({
          image: latest.image || c.image,
          date: latest.date,
          signal: latest.signal.toUpperCase() + (latest.signalValue ? ' ' + latest.signalValue : ''),
          signalClass: signal.includes('bullish') ? 'bullish' : signal.includes('bearish') ? 'bearish' : '',
          price: priceMatch ? '$' + priceMatch[1] : '--',
          fg: latest.fearGreed ? 'F&G: ' + latest.fearGreed.value + ' ' + latest.fearGreed.emoji : c.fg,
          excerpt: analysisMatch
            ? analysisMatch[1].substring(0, 100) + '...'
            : 'Daily BTC analysis with Capital Flow insights.',
        }));
      })
      .catch((error) => {
        console.log('Could not load latest report:', error);
        setCard((c) => ({ ...c, excerpt: 'Check out our daily market analysis reports.' }));
      });
  }, []);

  return (
    <a href="/reports" className="report-card" id="latest-report-card">
      <div className="report-card-image">
        {card.image ? <img src={card.image} alt="BTC 4H Chart" id="report-card-img" /> : <img alt="BTC 4H Chart" id="report-card-img" />}
        <span className={`report-card-badge ${card.signalClass}`.trim()} id="report-card-signal">
          {card.signal}
        </span>
      </div>
      <div className="report-card-content">
        <span className="report-card-date" id="report-card-date">{card.date}</span>
        <h4 className="report-card-title">Daily BTC Report</h4>
        <div className="report-card-meta">
          <span id="report-card-price">{card.price}</span>
          <span className="report-card-divider">|</span>
          <span id="report-card-fg">{card.fg}</span>
        </div>
        <p className="report-card-excerpt" id="report-card-excerpt">{card.excerpt}</p>
      </div>
    </a>
  );
}
