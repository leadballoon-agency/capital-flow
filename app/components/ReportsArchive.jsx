'use client';

import { useCallback, useEffect, useState } from 'react';

// Parse report text into structured data
function parseReport(reportText) {
  const data = {
    signal: { type: 'neutral', value: '0%', label: 'NEUTRAL' },
    price: { value: 'N/A', context: '' },
    macro: [],
    crypto: [],
    sectors: [],
    analysis: '',
    resistance: 'N/A',
    support: 'N/A',
    openLevels: { daily: null, weekly: null, monthly: null },
  };

  // Extract signal
  const signalMatch = reportText.match(/SIGNAL[:\s]*(BULLISH|BEARISH|NEUTRAL|LEAN BULL|LEAN BEAR|FULL SEND)[^0-9]*(\d+%?)/i);
  if (signalMatch) {
    const signalText = signalMatch[1].toUpperCase();
    data.signal.label = signalText;
    data.signal.value = signalMatch[2].includes('%') ? signalMatch[2] : signalMatch[2] + '%';
    if (signalText.includes('BULL') || signalText === 'BULLISH') {
      data.signal.type = 'bullish';
    } else if (signalText.includes('BEAR') || signalText === 'BEARISH') {
      data.signal.type = 'bearish';
    } else {
      data.signal.type = 'neutral';
    }
  }

  // Extract price
  const priceMatch = reportText.match(/PRICE[:\s]*\$?([\d,]+)/i);
  if (priceMatch) {
    data.price.value = '$' + priceMatch[1];
  }
  const priceContextMatch = reportText.match(/PRICE[:\s]*\$?[\d,]+\s*\(([^)]+)\)/i);
  if (priceContextMatch) {
    data.price.context = priceContextMatch[1];
  }

  // Extract Macro data
  const macroSection = reportText.match(/MACRO[\s\S]*?(?=CRYPTO|₿|$)/i);
  if (macroSection) {
    const dxyMatch = macroSection[0].match(/DXY[:\s]*(\d+%?)[^—\n]*(?:—|-)?\s*([^\n•]+)?/i);
    const vixMatch = macroSection[0].match(/VIX[:\s]*(\d+%?)[^—\n]*(?:—|-)?\s*([^\n•]+)?/i);
    const goldMatch = macroSection[0].match(/GOLD[:\s]*(\d+%?)[^—\n]*(?:—|-)?\s*([^\n•]+)?/i);
    const yieldsMatch = macroSection[0].match(/YIELDS?[:\s]*(\d+%?)[^—\n]*(?:—|-)?\s*([^\n•]+)?/i);

    if (dxyMatch) data.macro.push({ label: 'DXY', value: dxyMatch[1], context: dxyMatch[2]?.trim() || '' });
    if (vixMatch) data.macro.push({ label: 'VIX', value: vixMatch[1], context: vixMatch[2]?.trim() || '' });
    if (goldMatch) data.macro.push({ label: 'GOLD', value: goldMatch[1], context: goldMatch[2]?.trim() || '' });
    if (yieldsMatch) data.macro.push({ label: 'YIELDS', value: yieldsMatch[1], context: yieldsMatch[2]?.trim() || '' });
  }

  // Extract Crypto data
  const cryptoSection = reportText.match(/CRYPTO[\s\S]*?(?=SECTOR|📈|$)/i);
  if (cryptoSection) {
    const btcMatch = cryptoSection[0].match(/BTC[^:]*[:\s]*(\d+%?)/i);
    const ethMatch = cryptoSection[0].match(/ETH[^:]*[:\s]*(\d+%?)/i);

    if (btcMatch) data.crypto.push({ label: 'BTC Flow', value: btcMatch[1] });
    if (ethMatch) data.crypto.push({ label: 'ETH Flow', value: ethMatch[1] });
  }

  // Extract Sectors data
  const sectorsSection = reportText.match(/SECTOR[\s\S]*?(?=ANALYSIS|📝|$)/i);
  if (sectorsSection) {
    const btcdMatch = sectorsSection[0].match(/BTC\.?D[:\s]*(\d+%?)[^—\n]*(?:—|-)?\s*([^\n•]+)?/i);
    const total3Match = sectorsSection[0].match(/TOTAL3[:\s]*(\d+%?)[^—\n]*(?:—|-)?\s*([^\n•]+)?/i);

    if (btcdMatch) data.sectors.push({ label: 'BTC.D', value: btcdMatch[1], context: btcdMatch[2]?.trim() || '' });
    if (total3Match) data.sectors.push({ label: 'TOTAL3', value: total3Match[1], context: total3Match[2]?.trim() || '' });
  }

  // Extract Analysis
  const analysisMatch = reportText.match(/ANALYSIS[:\s]*\n?([^\n�⚠]+(?:\n[^\n�⚠]+)*)/i);
  if (analysisMatch) {
    data.analysis = analysisMatch[1].replace(/^[•\s]+/, '').trim();
  }

  // Extract Key Levels
  const resistanceMatch = reportText.match(/Resistance[:\s]*\$?([\d,]+)/i);
  const supportMatch = reportText.match(/Support[:\s]*\$?([\d,]+)/i);
  if (resistanceMatch) data.resistance = '$' + resistanceMatch[1];
  if (supportMatch) data.support = '$' + supportMatch[1];

  // Extract Open Levels
  const openSection = reportText.match(/OPEN LEVELS[\s\S]*?(?=Not financial|<i>|$)/i);
  if (openSection) {
    const dailyMatch = openSection[0].match(/Daily[:\s]*\$?([\d,]+)[^✅❌]*([✅❌])\s*(Holding|Lost)/i);
    const weeklyMatch = openSection[0].match(/Weekly[:\s]*\$?([\d,]+)[^✅❌]*([✅❌])\s*(Holding|Lost)/i);
    const monthlyMatch = openSection[0].match(/Monthly[:\s]*\$?([\d,]+)[^✅❌]*([✅❌])\s*(Holding|Lost)/i);

    if (dailyMatch) {
      data.openLevels.daily = { price: '$' + dailyMatch[1], status: dailyMatch[3].toLowerCase() };
    }
    if (weeklyMatch) {
      data.openLevels.weekly = { price: '$' + weeklyMatch[1], status: weeklyMatch[3].toLowerCase() };
    }
    if (monthlyMatch) {
      data.openLevels.monthly = { price: '$' + monthlyMatch[1], status: monthlyMatch[3].toLowerCase() };
    }
  }

  return data;
}

// Convert "Wednesday, December 10, 2025" to "Wed, Dec 10"
function getShortDate(dateStr) {
  const parts = dateStr.split(', ');
  if (parts.length >= 2) {
    const weekday = parts[0].slice(0, 3);
    const monthDay = parts[1].split(' ');
    if (monthDay.length >= 2) {
      const month = monthDay[0].slice(0, 3);
      const day = monthDay[1];
      return `${weekday}, ${month} ${day}`;
    }
  }
  return dateStr;
}

// Helper to determine data value color
function getValueClass(value) {
  const num = parseInt(value);
  if (num >= 55) return 'positive';
  if (num <= 45) return 'negative';
  return 'neutral';
}

function DataRows({ rows }) {
  if (!rows.length) {
    return (
      <div className="data-row">
        <span className="data-label">No data</span>
      </div>
    );
  }
  return rows.map((r) => (
    <div className="data-row" key={r.label}>
      <span className="data-label">{r.label}</span>
      <span className={`data-value ${getValueClass(r.value)}`}>
        <span className="data-percent">{r.value}</span>
      </span>
    </div>
  ));
}

function OpenLevel({ label, data }) {
  if (!data) {
    return (
      <div className="open-level-item">
        <div className="open-level-label">{label}</div>
        <div className="open-level-price">—</div>
        <span className="open-level-status not-visible">Not visible</span>
      </div>
    );
  }
  const holding = data.status === 'holding';
  return (
    <div className="open-level-item">
      <div className="open-level-label">{label}</div>
      <div className="open-level-price">{data.price}</div>
      <span className={`open-level-status ${holding ? 'holding' : 'lost'}`}>
        {holding ? '✓' : '✗'} {holding ? 'Holding' : 'Lost'}
      </span>
    </div>
  );
}

function ReportCard({ report, onOpenImage }) {
  const parsed = parseReport(report.reportText || '');
  const signalIcon =
    parsed.signal.type === 'bullish' ? '📈' : parsed.signal.type === 'bearish' ? '📉' : '➡️';

  return (
    <article className="report-card">
      <div className="report-header" onClick={() => onOpenImage(report.image)}>
        <img src={report.image} alt={`BTC 4H Chart - ${report.date}`} className="report-image" />
        <div className="report-header-overlay">
          <div className="report-date-badge">
            <span>📅</span>
            {report.date}
          </div>
          <h2 className="report-title-overlay">Capital Flow Daily Analysis</h2>
        </div>
      </div>

      <div className="report-content">
        {/* Top Row: Signal + Price */}
        <div className="report-top-row">
          <div className="signal-card">
            <div className="card-label">
              <span>🎯</span> {getShortDate(report.date)}
            </div>
            <div className={`signal-badge ${parsed.signal.type}`}>
              <span className="signal-icon">{signalIcon}</span>
              <span>
                {parsed.signal.label} {parsed.signal.value}
              </span>
            </div>
          </div>
          <div className="price-card">
            <div className="card-label">
              <span>💰</span> BTC Price
            </div>
            <div className="price-value">{parsed.price.value}</div>
            {parsed.price.context ? <div className="price-context">{parsed.price.context}</div> : null}
          </div>
        </div>

        {/* Data Sections */}
        <div className="data-sections">
          <div className="data-section">
            <div className="section-header">
              <span className="section-icon">🌍</span>
              <span className="section-title">Macro</span>
            </div>
            <DataRows rows={parsed.macro} />
          </div>

          <div className="data-section">
            <div className="section-header">
              <span className="section-icon">₿</span>
              <span className="section-title">Crypto</span>
            </div>
            <DataRows rows={parsed.crypto} />
          </div>

          <div className="data-section">
            <div className="section-header">
              <span className="section-icon">📈</span>
              <span className="section-title">Sectors</span>
            </div>
            <DataRows rows={parsed.sectors} />
          </div>
        </div>

        {/* Analysis */}
        {parsed.analysis ? (
          <div className="analysis-card">
            <div className="section-header">
              <span className="section-icon">📝</span>
              <span className="section-title">Analysis</span>
            </div>
            <p className="analysis-text">{parsed.analysis}</p>
          </div>
        ) : null}

        {/* Key Levels */}
        <div className="levels-grid">
          <div className="level-card resistance">
            <div className="level-type">⬆️ Resistance</div>
            <div className="level-price">{parsed.resistance}</div>
          </div>
          <div className="level-card support">
            <div className="level-type">⬇️ Support</div>
            <div className="level-price">{parsed.support}</div>
          </div>
        </div>

        {/* Open Levels */}
        <div className="open-levels">
          <div className="section-header">
            <span className="section-icon">📍</span>
            <span className="section-title">Open Levels</span>
          </div>
          <div className="open-levels-grid">
            <OpenLevel label="Daily" data={parsed.openLevels.daily} />
            <OpenLevel label="Weekly" data={parsed.openLevels.weekly} />
            <OpenLevel label="Monthly" data={parsed.openLevels.monthly} />
          </div>
        </div>

        {/* Footer */}
        <div className="report-footer">
          <div className="report-tags">
            <span className="tag">#BTC</span>
            <span className="tag">#CapitalFlow</span>
            <span className="tag">#4H</span>
          </div>
          <a href="https://t.me/fivedaytrader" target="_blank" rel="noopener noreferrer" className="telegram-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
            Join Telegram
          </a>
        </div>

        <div className="report-disclaimer">
          Not financial advice. Trade at your own risk. Past performance is not indicative of future results.
        </div>
      </div>
    </article>
  );
}

function EmptyState({ title, text }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">📊</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

/**
 * Replaces, in the old reports.html, the <div id="reports-feed"> block and the
 * <div class="lightbox" id="lightbox"> block. Renders both as siblings.
 */
export default function ReportsArchive() {
  // status: 'loading' | 'ready' | 'empty' | 'error'
  const [status, setStatus] = useState('loading');
  const [reports, setReports] = useState([]);
  const [lightboxSrc, setLightboxSrc] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadReports() {
      try {
        const response = await fetch('/reports-data.json');
        if (!response.ok) throw new Error('No reports');
        const data = await response.json();
        if (cancelled) return;
        if (!Array.isArray(data) || data.length === 0) {
          setStatus('empty');
          return;
        }
        setReports(data);
        setStatus('ready');
      } catch (error) {
        console.log('Error loading reports:', error);
        if (!cancelled) setStatus('error');
      }
    }
    loadReports();
    return () => {
      cancelled = true;
    };
  }, []);

  const openLightbox = useCallback((src) => {
    setLightboxSrc(src);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [closeLightbox]);

  return (
    <>
      <div id="reports-feed">
        {status === 'loading' && (
          <EmptyState title="Loading reports..." text="Fetching the latest Capital Flow analysis" />
        )}
        {status === 'empty' && (
          <EmptyState
            title="No Reports Yet"
            text="Daily Capital Flow reports will appear here. Join our Telegram for real-time updates."
          />
        )}
        {status === 'error' && (
          <EmptyState
            title="No Reports Available"
            text="Daily Capital Flow reports will appear here once generated."
          />
        )}
        {status === 'ready' &&
          reports.map((report, i) => (
            <ReportCard key={report.id ?? i} report={report} onOpenImage={openLightbox} />
          ))}
      </div>

      {/* Lightbox */}
      <div className={`lightbox${lightboxOpen ? ' active' : ''}`} id="lightbox" onClick={closeLightbox}>
        <button
          className="lightbox-close"
          onClick={(e) => {
            e.stopPropagation();
            closeLightbox();
          }}
        >
          &times;
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img id="lightbox-img" src={lightboxSrc || undefined} alt="Full size image" />
      </div>
    </>
  );
}
