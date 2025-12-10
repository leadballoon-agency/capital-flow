/**
 * Long/Short Ratio Widget
 * Horizontal bar showing retail positioning with crowding warnings
 *
 * Usage: Add <script src="/js/long-short-widget.js"></script> and
 *        <div id="ls-widget"></div> where you want the widget
 */

(function() {
  // Only load once
  if (window.LSWidget) return;
  window.LSWidget = true;

  // Inject styles
  const styles = document.createElement('style');
  styles.textContent = `
    .ls-widget {
      background: #111111;
      border: 1px solid #1a1a1a;
      border-radius: 16px;
      padding: 1.5rem;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .ls-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;
    }

    .ls-header-left {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .ls-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .ls-timeframe-selector {
      display: flex;
      gap: 0.25rem;
    }

    .ls-timeframe-btn {
      background: #1a1a1a;
      border: 1px solid #333;
      color: #666;
      padding: 0.25rem 0.5rem;
      font-size: 0.625rem;
      font-weight: 600;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
      text-transform: uppercase;
    }

    .ls-timeframe-btn:hover {
      border-color: #555;
      color: #888;
    }

    .ls-timeframe-btn.active {
      background: rgba(255, 107, 0, 0.15);
      border-color: var(--accent, #ff6b00);
      color: var(--accent, #ff6b00);
    }

    .ls-bar-container {
      margin-bottom: 1rem;
    }

    .ls-bar-labels {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }

    .ls-bar-label {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .ls-bar-label.long { color: #00cc44; }
    .ls-bar-label.short { color: #ff4444; }

    .ls-bar {
      height: 24px;
      background: #1a1a1a;
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      position: relative;
    }

    .ls-bar-long {
      height: 100%;
      background: linear-gradient(90deg, #00cc44, #00ff88);
      transition: width 1s ease-out;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding-left: 0.75rem;
    }

    .ls-bar-short {
      height: 100%;
      background: linear-gradient(90deg, #ff6644, #ff4444);
      transition: width 1s ease-out;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 0.75rem;
    }

    .ls-bar-pct {
      font-size: 0.75rem;
      font-weight: 700;
      color: #fff;
      text-shadow: 0 1px 2px rgba(0,0,0,0.5);
    }

    .ls-bar-pct.hidden {
      display: none;
    }

    .ls-values {
      display: flex;
      justify-content: space-between;
      margin-top: 0.5rem;
    }

    .ls-value {
      font-size: 1.5rem;
      font-weight: 800;
    }

    .ls-value.long { color: #00cc44; }
    .ls-value.short { color: #ff4444; }

    .ls-status {
      text-align: center;
      margin-top: 1rem;
    }

    .ls-status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.5rem 0.875rem;
      border-radius: 50px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .ls-status-badge.crowded_long {
      background: rgba(255, 68, 68, 0.1);
      color: #ff4444;
      border: 1px solid rgba(255, 68, 68, 0.2);
    }

    .ls-status-badge.crowded_short {
      background: rgba(0, 255, 136, 0.1);
      color: #00ff88;
      border: 1px solid rgba(0, 255, 136, 0.2);
    }

    .ls-status-badge.balanced {
      background: rgba(136, 136, 136, 0.1);
      color: #888;
      border: 1px solid rgba(136, 136, 136, 0.2);
    }

    .ls-alignment {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.5rem 0.875rem;
      border-radius: 50px;
      font-size: 0.75rem;
      font-weight: 600;
      margin-top: 0.5rem;
    }

    .ls-alignment.confirms {
      background: rgba(0, 255, 136, 0.1);
      color: #00ff88;
      border: 1px solid rgba(0, 255, 136, 0.2);
    }

    .ls-alignment.diverges {
      background: rgba(255, 170, 0, 0.1);
      color: #ffaa00;
      border: 1px solid rgba(255, 170, 0, 0.2);
    }

    .ls-alignment.neutral {
      background: rgba(136, 136, 136, 0.1);
      color: #888;
      border: 1px solid rgba(136, 136, 136, 0.2);
    }

    .ls-loading {
      text-align: center;
      padding: 2rem;
      color: #666;
    }
  `;
  document.head.appendChild(styles);

  // Find widget container
  const container = document.getElementById('ls-widget');
  if (!container) return;

  // Track current period
  let currentPeriod = '1H';

  // Create widget HTML
  container.innerHTML = `
    <div class="ls-widget">
      <div class="ls-header">
        <div class="ls-header-left">
          <span class="ls-emoji">📊</span>
          <span class="ls-title">Long/Short Ratio</span>
        </div>
        <div class="ls-timeframe-selector">
          <button class="ls-timeframe-btn" data-period="5m">5m</button>
          <button class="ls-timeframe-btn active" data-period="1H">1H</button>
          <button class="ls-timeframe-btn" data-period="1D">1D</button>
        </div>
      </div>
      <div class="ls-bar-container">
        <div class="ls-bar-labels">
          <span class="ls-bar-label long">Long</span>
          <span class="ls-bar-label short">Short</span>
        </div>
        <div class="ls-bar">
          <div class="ls-bar-long" id="ls-bar-long" style="width: 50%">
            <span class="ls-bar-pct" id="ls-pct-long">50%</span>
          </div>
          <div class="ls-bar-short" id="ls-bar-short" style="width: 50%">
            <span class="ls-bar-pct" id="ls-pct-short">50%</span>
          </div>
        </div>
        <div class="ls-values">
          <span class="ls-value long" id="ls-value-long">--</span>
          <span class="ls-value short" id="ls-value-short">--</span>
        </div>
      </div>
      <div class="ls-status">
        <div class="ls-status-badge balanced" id="ls-status">
          <span>⚖️</span>
          <span>Loading...</span>
        </div>
        <div class="ls-alignment neutral" id="ls-alignment">
          <span>—</span>
          <span>Checking signal...</span>
        </div>
      </div>
    </div>
  `;

  // Update widget with data
  function updateWidget(data, signal) {
    const barLong = document.getElementById('ls-bar-long');
    const barShort = document.getElementById('ls-bar-short');
    const pctLong = document.getElementById('ls-pct-long');
    const pctShort = document.getElementById('ls-pct-short');
    const valueLong = document.getElementById('ls-value-long');
    const valueShort = document.getElementById('ls-value-short');
    const statusEl = document.getElementById('ls-status');
    const alignmentEl = document.getElementById('ls-alignment');

    // Update bar widths
    barLong.style.width = data.longPct + '%';
    barShort.style.width = data.shortPct + '%';

    // Update percentages in bar (hide if too small)
    pctLong.textContent = data.longPct + '%';
    pctShort.textContent = data.shortPct + '%';
    pctLong.classList.toggle('hidden', data.longPct < 25);
    pctShort.classList.toggle('hidden', data.shortPct < 25);

    // Update value displays
    valueLong.textContent = data.longPct.toFixed(1) + '%';
    valueShort.textContent = data.shortPct.toFixed(1) + '%';

    // Update status badge
    statusEl.className = `ls-status-badge ${data.crowding}`;
    statusEl.innerHTML = `<span>${data.emoji}</span><span>${data.label}</span>`;

    // Update alignment with Capital Flow signal
    updateAlignment(data, signal);
  }

  // Calculate alignment with Capital Flow signal
  function updateAlignment(lsData, signal) {
    const alignmentEl = document.getElementById('ls-alignment');
    const signalDirection = signal || 'neutral';

    let alignmentClass, alignmentIcon, alignmentText;

    if (signalDirection === 'neutral') {
      alignmentClass = 'neutral';
      alignmentIcon = '—';
      alignmentText = 'Awaiting signal';
    } else if (signalDirection === 'bullish') {
      // Bullish signal + Retail Short = Strong (contrarian buy)
      // Bullish signal + Retail Long = Diverges (crowded)
      if (lsData.is_crowded_short) {
        alignmentClass = 'confirms';
        alignmentIcon = '✓';
        alignmentText = lsData.is_extreme ? 'Strong contrarian' : 'Confirms bullish';
      } else if (lsData.is_crowded_long) {
        alignmentClass = 'diverges';
        alignmentIcon = '⚠';
        alignmentText = lsData.is_extreme ? 'Caution: crowded' : 'Watch for pullback';
      } else {
        alignmentClass = 'neutral';
        alignmentIcon = '—';
        alignmentText = 'Neutral positioning';
      }
    } else if (signalDirection === 'bearish') {
      // Bearish signal + Retail Long = Strong (distribution)
      // Bearish signal + Retail Short = Diverges (capitulation?)
      if (lsData.is_crowded_long) {
        alignmentClass = 'confirms';
        alignmentIcon = '✓';
        alignmentText = lsData.is_extreme ? 'Strong distribution' : 'Confirms bearish';
      } else if (lsData.is_crowded_short) {
        alignmentClass = 'diverges';
        alignmentIcon = '⚠';
        alignmentText = lsData.is_extreme ? 'Possible bottom' : 'Watch for bounce';
      } else {
        alignmentClass = 'neutral';
        alignmentIcon = '—';
        alignmentText = 'Neutral positioning';
      }
    }

    alignmentEl.className = `ls-alignment ${alignmentClass}`;
    alignmentEl.innerHTML = `<span>${alignmentIcon}</span><span>${alignmentText}</span>`;
  }

  // Fetch L/S data for a specific period
  async function fetchLS(period = currentPeriod) {
    try {
      const response = await fetch(`/api/long-short-ratio?period=${period}`);
      const data = await response.json();

      // Try to get latest signal from reports
      let signal = 'neutral';
      try {
        const reportsResponse = await fetch('/reports-data.json');
        const reports = await reportsResponse.json();
        if (reports && reports.length > 0) {
          signal = reports[0].signal;
        }
      } catch (e) {
        // Ignore if reports not available
      }

      updateWidget(data, signal);

    } catch (error) {
      console.error('Error fetching L/S:', error);
      document.getElementById('ls-status').innerHTML = '<span>—</span><span>Error loading</span>';
    }
  }

  // Handle timeframe button clicks
  function setupTimeframeButtons() {
    const buttons = container.querySelectorAll('.ls-timeframe-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active state
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Fetch data for new period
        currentPeriod = btn.dataset.period;
        fetchLS(currentPeriod);
      });
    });
  }

  // Initial setup
  setupTimeframeButtons();
  fetchLS();

  // Auto-refresh every 5 minutes
  setInterval(() => fetchLS(currentPeriod), 5 * 60 * 1000);
})();
