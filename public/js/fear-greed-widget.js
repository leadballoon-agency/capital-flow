/**
 * Fear & Greed Index Widget
 * A beautiful gauge showing market sentiment with confirmation status
 *
 * Usage: Add <script src="/js/fear-greed-widget.js"></script> and
 *        <div id="fng-widget"></div> where you want the widget
 */

(function() {
  // Only load once
  if (window.FNGWidget) return;
  window.FNGWidget = true;

  // Inject styles
  const styles = document.createElement('style');
  styles.textContent = `
    .fng-widget {
      background: #111111;
      border: 1px solid #1a1a1a;
      border-radius: 16px;
      padding: 1.5rem;
      text-align: center;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .fng-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 1.25rem;
    }

    .fng-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .fng-gauge-container {
      position: relative;
      width: 160px;
      height: 90px;
      margin: 0 auto 1rem;
    }

    .fng-gauge-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 160px;
      height: 160px;
    }

    .fng-gauge-fill {
      position: absolute;
      top: 0;
      left: 0;
      width: 160px;
      height: 160px;
      transition: stroke-dashoffset 1s ease-out;
    }

    .fng-needle {
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 4px;
      height: 60px;
      background: linear-gradient(to top, #fff, transparent);
      transform-origin: bottom center;
      transform: translateX(-50%) rotate(-90deg);
      transition: transform 1s ease-out;
      border-radius: 2px;
    }

    .fng-center {
      position: absolute;
      bottom: -5px;
      left: 50%;
      transform: translateX(-50%);
      width: 16px;
      height: 16px;
      background: #fff;
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
    }

    .fng-value-container {
      margin-bottom: 0.75rem;
    }

    .fng-value {
      font-size: 2.5rem;
      font-weight: 800;
      line-height: 1;
      transition: color 0.3s;
    }

    .fng-label {
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-top: 0.25rem;
      transition: color 0.3s;
    }

    .fng-alignment {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.5rem 0.875rem;
      border-radius: 50px;
      font-size: 0.75rem;
      font-weight: 600;
      margin-top: 0.5rem;
      transition: all 0.3s;
    }

    .fng-alignment.confirms {
      background: rgba(0, 255, 136, 0.1);
      color: #00ff88;
      border: 1px solid rgba(0, 255, 136, 0.2);
    }

    .fng-alignment.diverges {
      background: rgba(255, 170, 0, 0.1);
      color: #ffaa00;
      border: 1px solid rgba(255, 170, 0, 0.2);
    }

    .fng-alignment.neutral {
      background: rgba(136, 136, 136, 0.1);
      color: #888;
      border: 1px solid rgba(136, 136, 136, 0.2);
    }

    .fng-scale {
      display: flex;
      justify-content: space-between;
      margin-top: 1rem;
      padding: 0 0.5rem;
    }

    .fng-scale-label {
      font-size: 0.625rem;
      color: #666;
      text-transform: uppercase;
    }

    .fng-scale-label.fear { color: #ff4444; }
    .fng-scale-label.greed { color: #00cc44; }

    .fng-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 180px;
      color: #666;
    }

    .fng-error {
      color: #ff4444;
      font-size: 0.75rem;
      margin-top: 0.5rem;
    }
  `;
  document.head.appendChild(styles);

  // Find widget container
  const container = document.getElementById('fng-widget');
  if (!container) return;

  // Create widget HTML
  container.innerHTML = `
    <div class="fng-widget">
      <div class="fng-header">
        <span class="fng-emoji">😨</span>
        <span class="fng-title">Fear & Greed Index</span>
      </div>
      <div class="fng-gauge-container">
        <svg class="fng-gauge-bg" viewBox="0 0 160 160">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#ff4444" />
              <stop offset="25%" stop-color="#ff8844" />
              <stop offset="50%" stop-color="#ffcc00" />
              <stop offset="75%" stop-color="#88cc44" />
              <stop offset="100%" stop-color="#00cc44" />
            </linearGradient>
          </defs>
          <!-- Background arc -->
          <path
            d="M 20 80 A 60 60 0 0 1 140 80"
            fill="none"
            stroke="#1a1a1a"
            stroke-width="12"
            stroke-linecap="round"
          />
        </svg>
        <svg class="fng-gauge-fill" viewBox="0 0 160 160">
          <!-- Filled arc -->
          <path
            id="fng-arc"
            d="M 20 80 A 60 60 0 0 1 140 80"
            fill="none"
            stroke="url(#gaugeGradient)"
            stroke-width="12"
            stroke-linecap="round"
            stroke-dasharray="188.5"
            stroke-dashoffset="188.5"
          />
        </svg>
        <div class="fng-needle" id="fng-needle"></div>
        <div class="fng-center"></div>
      </div>
      <div class="fng-value-container">
        <div class="fng-value" id="fng-value">--</div>
        <div class="fng-label" id="fng-label">Loading...</div>
      </div>
      <div class="fng-alignment neutral" id="fng-alignment">
        <span>—</span>
        <span>Checking signal...</span>
      </div>
      <div class="fng-scale">
        <span class="fng-scale-label fear">Extreme Fear</span>
        <span class="fng-scale-label greed">Extreme Greed</span>
      </div>
    </div>
  `;

  // Update widget with data
  function updateWidget(data, signal) {
    const valueEl = document.getElementById('fng-value');
    const labelEl = document.getElementById('fng-label');
    const emojiEl = document.querySelector('.fng-emoji');
    const needleEl = document.getElementById('fng-needle');
    const arcEl = document.getElementById('fng-arc');
    const alignmentEl = document.getElementById('fng-alignment');

    // Update value and label
    valueEl.textContent = data.value;
    valueEl.style.color = data.color;
    labelEl.textContent = data.classification;
    labelEl.style.color = data.color;
    emojiEl.textContent = data.emoji;

    // Update needle rotation (-90deg = 0, 90deg = 100)
    const rotation = -90 + (data.value / 100) * 180;
    needleEl.style.transform = `translateX(-50%) rotate(${rotation}deg)`;

    // Update arc fill (188.5 is full arc length)
    const dashOffset = 188.5 - (data.value / 100) * 188.5;
    arcEl.style.strokeDashoffset = dashOffset;

    // Update alignment status
    updateAlignment(data, signal);
  }

  // Calculate alignment with Capital Flow signal
  function updateAlignment(fngData, signal) {
    const alignmentEl = document.getElementById('fng-alignment');

    // Default signal direction (try to get from latest report)
    const signalDirection = signal || 'neutral'; // 'bullish', 'bearish', or 'neutral'

    let alignmentClass, alignmentIcon, alignmentText;

    if (signalDirection === 'neutral') {
      alignmentClass = 'neutral';
      alignmentIcon = '—';
      alignmentText = 'Awaiting signal';
    } else if (signalDirection === 'bullish') {
      // Bullish signal + Fear = Confirms (contrarian buy)
      // Bullish signal + Greed = Diverges (crowded trade)
      if (fngData.is_fear) {
        alignmentClass = 'confirms';
        alignmentIcon = '✓';
        alignmentText = fngData.is_extreme ? 'Strong confirmation' : 'Confirms bullish';
      } else if (fngData.is_greed) {
        alignmentClass = 'diverges';
        alignmentIcon = '⚠';
        alignmentText = fngData.is_extreme ? 'Caution: extreme greed' : 'Watch for pullback';
      } else {
        alignmentClass = 'neutral';
        alignmentIcon = '—';
        alignmentText = 'Neutral sentiment';
      }
    } else if (signalDirection === 'bearish') {
      // Bearish signal + Greed = Confirms (distribution)
      // Bearish signal + Fear = Diverges (capitulation?)
      if (fngData.is_greed) {
        alignmentClass = 'confirms';
        alignmentIcon = '✓';
        alignmentText = fngData.is_extreme ? 'Strong confirmation' : 'Confirms bearish';
      } else if (fngData.is_fear) {
        alignmentClass = 'diverges';
        alignmentIcon = '⚠';
        alignmentText = fngData.is_extreme ? 'Possible capitulation' : 'Watch for bounce';
      } else {
        alignmentClass = 'neutral';
        alignmentIcon = '—';
        alignmentText = 'Neutral sentiment';
      }
    }

    alignmentEl.className = `fng-alignment ${alignmentClass}`;
    alignmentEl.innerHTML = `<span>${alignmentIcon}</span><span>${alignmentText}</span>`;
  }

  // Fetch F&G data
  async function fetchFNG() {
    try {
      const response = await fetch('/api/fear-greed');
      const data = await response.json();

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

      updateWidget(data, signal);

      // Schedule next update (every hour)
      setTimeout(fetchFNG, 60 * 60 * 1000);

    } catch (error) {
      console.error('Error fetching F&G:', error);
      document.getElementById('fng-value').textContent = '--';
      document.getElementById('fng-label').textContent = 'Error loading';
    }
  }

  // Initial fetch
  fetchFNG();
})();
