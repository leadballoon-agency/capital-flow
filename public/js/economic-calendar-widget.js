/**
 * Economic Calendar Widget
 * Shows upcoming high-impact economic events
 * Focus on interest rate decisions, CPI, employment data
 */

(function() {
  if (window.EconCalWidget) return;
  window.EconCalWidget = true;

  const styles = document.createElement('style');
  styles.textContent = `
    .econ-cal-widget {
      background: #111111;
      border: 1px solid #1a1a1a;
      border-radius: 16px;
      padding: 1.5rem;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .econ-cal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .econ-cal-header-left {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .econ-cal-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .econ-cal-badge {
      background: rgba(255, 68, 68, 0.15);
      color: #ff4444;
      font-size: 0.625rem;
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      text-transform: uppercase;
    }

    .econ-cal-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .econ-cal-event {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.75rem;
      background: #0a0a0a;
      border-radius: 8px;
      border-left: 3px solid #333;
      transition: all 0.2s;
    }

    .econ-cal-event:hover {
      background: #151515;
    }

    .econ-cal-event.vip {
      border-left-color: #ff4444;
    }

    .econ-cal-event.today {
      border-left-color: #ff6b00;
      background: rgba(255, 107, 0, 0.05);
    }

    .econ-cal-event.past {
      opacity: 0.5;
    }

    .econ-cal-time {
      min-width: 50px;
      text-align: right;
    }

    .econ-cal-time-relative {
      font-size: 0.75rem;
      font-weight: 600;
      color: #888;
    }

    .econ-cal-event.today .econ-cal-time-relative {
      color: #ff6b00;
    }

    .econ-cal-event.vip .econ-cal-time-relative {
      color: #ff4444;
    }

    .econ-cal-content {
      flex: 1;
      min-width: 0;
    }

    .econ-cal-event-title {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #fff;
      margin-bottom: 0.25rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .econ-cal-country {
      font-size: 0.625rem;
      font-weight: 600;
      padding: 0.125rem 0.375rem;
      border-radius: 3px;
      background: #1a1a1a;
      color: #888;
    }

    .econ-cal-country.USD { background: rgba(0, 136, 255, 0.15); color: #0088ff; }
    .econ-cal-country.EUR { background: rgba(0, 102, 204, 0.15); color: #0066cc; }
    .econ-cal-country.GBP { background: rgba(153, 51, 153, 0.15); color: #993399; }
    .econ-cal-country.JPY { background: rgba(255, 0, 0, 0.15); color: #ff6666; }
    .econ-cal-country.CNY { background: rgba(255, 204, 0, 0.15); color: #ffcc00; }
    .econ-cal-country.AUD { background: rgba(0, 153, 51, 0.15); color: #00cc44; }
    .econ-cal-country.CAD { background: rgba(255, 51, 51, 0.15); color: #ff5555; }
    .econ-cal-country.CHF { background: rgba(255, 102, 0, 0.15); color: #ff6600; }

    .econ-cal-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.6875rem;
      color: #666;
    }

    .econ-cal-forecast {
      color: #888;
    }

    .econ-cal-previous {
      color: #666;
    }

    .econ-cal-empty {
      text-align: center;
      padding: 2rem;
      color: #666;
      font-size: 0.875rem;
    }

    .econ-cal-footer {
      margin-top: 1rem;
      padding-top: 0.75rem;
      border-top: 1px solid #1a1a1a;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .econ-cal-source {
      font-size: 0.625rem;
      color: #444;
    }

    .econ-cal-source a {
      color: #666;
      text-decoration: none;
    }

    .econ-cal-source a:hover {
      color: #888;
    }

    .econ-cal-updated {
      font-size: 0.625rem;
      color: #444;
    }
  `;
  document.head.appendChild(styles);

  const container = document.getElementById('econ-cal-widget');
  if (!container) return;

  container.innerHTML = `
    <div class="econ-cal-widget">
      <div class="econ-cal-header">
        <div class="econ-cal-header-left">
          <span>📅</span>
          <span class="econ-cal-title">Economic Calendar</span>
        </div>
        <span class="econ-cal-badge">High Impact</span>
      </div>
      <div class="econ-cal-list" id="econ-cal-list">
        <div class="econ-cal-empty">Loading events...</div>
      </div>
      <div class="econ-cal-footer">
        <span class="econ-cal-source">Data: <a href="https://www.forexfactory.com/calendar" target="_blank">Forex Factory</a></span>
        <span class="econ-cal-updated" id="econ-cal-updated"></span>
      </div>
    </div>
  `;

  function formatTime(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }

  function renderEvents(data) {
    const listEl = document.getElementById('econ-cal-list');
    const updatedEl = document.getElementById('econ-cal-updated');

    if (!data.upcoming || data.upcoming.length === 0) {
      listEl.innerHTML = '<div class="econ-cal-empty">No high-impact events this week</div>';
      return;
    }

    const html = data.upcoming.slice(0, 6).map(event => {
      const classes = ['econ-cal-event'];
      if (event.isVIP) classes.push('vip');
      if (event.isToday) classes.push('today');
      if (event.isPast) classes.push('past');

      return `
        <div class="${classes.join(' ')}">
          <div class="econ-cal-time">
            <div class="econ-cal-time-relative">${event.relativeTime}</div>
          </div>
          <div class="econ-cal-content">
            <div class="econ-cal-event-title">
              <span class="econ-cal-country ${event.country}">${event.country}</span>
              ${event.title}
            </div>
            <div class="econ-cal-meta">
              <span>${formatDate(event.date)} ${formatTime(event.date)}</span>
              ${event.forecast ? `<span class="econ-cal-forecast">Fcst: ${event.forecast}</span>` : ''}
              ${event.previous ? `<span class="econ-cal-previous">Prev: ${event.previous}</span>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');

    listEl.innerHTML = html;

    if (data.lastUpdated) {
      const updated = new Date(data.lastUpdated);
      updatedEl.textContent = `Updated ${updated.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    }
  }

  async function fetchCalendar() {
    try {
      const response = await fetch('/api/economic-calendar');
      const data = await response.json();
      renderEvents(data);
    } catch (error) {
      console.error('Error fetching calendar:', error);
      document.getElementById('econ-cal-list').innerHTML =
        '<div class="econ-cal-empty">Failed to load calendar</div>';
    }
  }

  fetchCalendar();
  // Refresh every hour
  setInterval(fetchCalendar, 60 * 60 * 1000);
})();
