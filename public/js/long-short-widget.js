/**
 * Long/Short Ratio Widget
 * Shows 1H vs 1D comparison with trend direction
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
      display: flex;
      flex-direction: column;
      min-height: 280px;
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

    .ls-source {
      font-size: 0.625rem;
      color: #555;
      text-transform: uppercase;
    }

    .ls-bars-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .ls-bar-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .ls-period-label {
      font-size: 0.75rem;
      font-weight: 700;
      color: #666;
      width: 28px;
      flex-shrink: 0;
    }

    .ls-bar-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .ls-bar {
      height: 20px;
      background: #1a1a1a;
      border-radius: 10px;
      overflow: hidden;
      display: flex;
      position: relative;
    }

    .ls-bar-long {
      height: 100%;
      background: linear-gradient(90deg, #00cc44, #00ff88);
      transition: width 0.8s ease-out;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 0.5rem;
    }

    .ls-bar-short {
      height: 100%;
      background: linear-gradient(90deg, #ff6644, #ff4444);
      transition: width 0.8s ease-out;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding-left: 0.5rem;
    }

    .ls-bar-pct {
      font-size: 0.625rem;
      font-weight: 700;
      color: #fff;
      text-shadow: 0 1px 2px rgba(0,0,0,0.5);
    }

    .ls-bar-pct.hidden {
      visibility: hidden;
    }

    .ls-value-label {
      font-size: 0.875rem;
      font-weight: 700;
      width: 55px;
      flex-shrink: 0;
      text-align: right;
      white-space: nowrap;
    }

    .ls-value-label.long { color: #00cc44; }

    .ls-trend-section {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #222;
    }

    .ls-trend-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.625rem 1rem;
      border-radius: 8px;
      font-size: 0.8125rem;
      font-weight: 600;
    }

    .ls-trend-badge.more-long {
      background: rgba(255, 68, 68, 0.1);
      color: #ff6666;
      border: 1px solid rgba(255, 68, 68, 0.2);
    }

    .ls-trend-badge.more-short {
      background: rgba(0, 255, 136, 0.1);
      color: #00ff88;
      border: 1px solid rgba(0, 255, 136, 0.2);
    }

    .ls-trend-badge.steady {
      background: rgba(136, 136, 136, 0.1);
      color: #888;
      border: 1px solid rgba(136, 136, 136, 0.2);
    }

    .ls-status-row {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 0.75rem;
      flex-wrap: wrap;
    }

    .ls-status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.375rem 0.625rem;
      border-radius: 50px;
      font-size: 0.6875rem;
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

    .ls-loading {
      text-align: center;
      padding: 2rem;
      color: #666;
    }

    /* Mobile Responsive */
    @media (max-width: 480px) {
      .ls-widget {
        padding: 1rem;
        min-height: 240px;
        border-radius: 12px;
      }

      .ls-header {
        margin-bottom: 1rem;
      }

      .ls-title {
        font-size: 0.75rem;
      }

      .ls-source {
        font-size: 0.5625rem;
      }

      .ls-bars-container {
        gap: 0.625rem;
      }

      .ls-bar-row {
        gap: 0.5rem;
      }

      .ls-period-label {
        font-size: 0.6875rem;
        width: 24px;
      }

      .ls-bar {
        height: 18px;
        border-radius: 9px;
      }

      .ls-bar-long {
        padding-right: 0.375rem;
      }

      .ls-bar-short {
        padding-left: 0.375rem;
      }

      .ls-bar-pct {
        font-size: 0.5625rem;
      }

      .ls-value-label {
        font-size: 0.75rem;
        width: auto;
        min-width: 50px;
      }

      .ls-trend-section {
        margin-top: 0.75rem;
        padding-top: 0.75rem;
      }

      .ls-trend-badge {
        padding: 0.5rem 0.75rem;
        font-size: 0.75rem;
        gap: 0.375rem;
      }

      .ls-status-row {
        margin-top: 0.5rem;
        gap: 0.375rem;
      }

      .ls-status-badge {
        padding: 0.3125rem 0.5rem;
        font-size: 0.625rem;
        gap: 0.1875rem;
      }
    }

    /* Small mobile (iPhone SE etc) */
    @media (max-width: 360px) {
      .ls-widget {
        padding: 0.875rem;
        min-height: 220px;
      }

      .ls-title {
        font-size: 0.6875rem;
      }

      .ls-period-label {
        font-size: 0.625rem;
        width: 20px;
      }

      .ls-bar {
        height: 16px;
      }

      .ls-value-label {
        font-size: 0.6875rem;
        width: auto;
        min-width: 44px;
      }

      .ls-trend-badge {
        font-size: 0.6875rem;
        padding: 0.4375rem 0.625rem;
      }
    }
  `;
  document.head.appendChild(styles);

  // Find widget container
  const container = document.getElementById('ls-widget');
  if (!container) return;

  // Create widget HTML
  container.innerHTML = `
    <div class="ls-widget">
      <div class="ls-header">
        <div class="ls-header-left">
          <span class="ls-emoji">📊</span>
          <span class="ls-title">Retail Positioning</span>
        </div>
        <span class="ls-source">OKX</span>
      </div>

      <div class="ls-bars-container">
        <div class="ls-bar-row">
          <span class="ls-period-label">1H</span>
          <div class="ls-bar-wrapper">
            <div class="ls-bar">
              <div class="ls-bar-long" id="ls-bar-1h-long" style="width: 50%">
                <span class="ls-bar-pct" id="ls-pct-1h-long">50%</span>
              </div>
              <div class="ls-bar-short" id="ls-bar-1h-short" style="width: 50%">
                <span class="ls-bar-pct" id="ls-pct-1h-short">50%</span>
              </div>
            </div>
          </div>
          <span class="ls-value-label long" id="ls-value-1h">--</span>
        </div>

        <div class="ls-bar-row">
          <span class="ls-period-label">1D</span>
          <div class="ls-bar-wrapper">
            <div class="ls-bar">
              <div class="ls-bar-long" id="ls-bar-1d-long" style="width: 50%">
                <span class="ls-bar-pct" id="ls-pct-1d-long">50%</span>
              </div>
              <div class="ls-bar-short" id="ls-bar-1d-short" style="width: 50%">
                <span class="ls-bar-pct" id="ls-pct-1d-short">50%</span>
              </div>
            </div>
          </div>
          <span class="ls-value-label long" id="ls-value-1d">--</span>
        </div>
      </div>

      <div class="ls-trend-section">
        <div class="ls-trend-badge steady" id="ls-trend">
          <span>Loading...</span>
        </div>
        <div class="ls-status-row">
          <div class="ls-status-badge balanced" id="ls-status">
            <span>⚖️</span>
            <span>Loading...</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // Update a single bar row
  function updateBar(period, data) {
    const barLong = document.getElementById(`ls-bar-${period}-long`);
    const barShort = document.getElementById(`ls-bar-${period}-short`);
    const pctLong = document.getElementById(`ls-pct-${period}-long`);
    const pctShort = document.getElementById(`ls-pct-${period}-short`);
    const valueLabel = document.getElementById(`ls-value-${period}`);

    barLong.style.width = data.longPct + '%';
    barShort.style.width = data.shortPct + '%';

    pctLong.textContent = data.longPct.toFixed(1) + '%';
    pctShort.textContent = data.shortPct.toFixed(1) + '%';
    pctLong.classList.toggle('hidden', data.longPct < 30);
    pctShort.classList.toggle('hidden', data.shortPct < 30);

    valueLabel.textContent = data.longPct.toFixed(1) + '% L';
  }

  // Update trend comparison
  function updateTrend(data1H, data1D) {
    const trendEl = document.getElementById('ls-trend');
    const statusEl = document.getElementById('ls-status');

    const diff = data1H.longPct - data1D.longPct;
    const absDiff = Math.abs(diff).toFixed(1);

    let trendClass, trendText, trendIcon;

    if (diff > 0.5) {
      trendClass = 'more-long';
      trendIcon = '📈';
      trendText = `Getting MORE long (+${absDiff}%)`;
    } else if (diff < -0.5) {
      trendClass = 'more-short';
      trendIcon = '📉';
      trendText = `Getting MORE short (${diff.toFixed(1)}%)`;
    } else {
      trendClass = 'steady';
      trendIcon = '➡️';
      trendText = 'Holding steady';
    }

    trendEl.className = `ls-trend-badge ${trendClass}`;
    trendEl.innerHTML = `<span>${trendIcon}</span><span>${trendText}</span>`;

    // Update crowding status based on 1H (most recent)
    statusEl.className = `ls-status-badge ${data1H.crowding}`;
    statusEl.innerHTML = `<span>${data1H.emoji}</span><span>${data1H.label}</span>`;
  }

  // Fetch both 1H and 1D data
  async function fetchAllData() {
    try {
      const [res1H, res1D] = await Promise.all([
        fetch('/api/long-short-ratio?period=1H'),
        fetch('/api/long-short-ratio?period=1D')
      ]);

      const data1H = await res1H.json();
      const data1D = await res1D.json();

      updateBar('1h', data1H);
      updateBar('1d', data1D);
      updateTrend(data1H, data1D);

    } catch (error) {
      console.error('Error fetching L/S:', error);
      document.getElementById('ls-trend').innerHTML = '<span>—</span><span>Error loading data</span>';
    }
  }

  // Initial fetch
  fetchAllData();

  // Auto-refresh every 5 minutes
  setInterval(fetchAllData, 5 * 60 * 1000);
})();
