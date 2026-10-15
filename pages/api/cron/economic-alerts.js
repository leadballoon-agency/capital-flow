// Economic Calendar Alerts - Cron Job
// Sends Telegram alerts for upcoming high-impact events
// Runs every hour, alerts 1 hour before events

export const config = {
  maxDuration: 30,
};

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Country flag emojis
const FLAGS = {
  USD: '🇺🇸',
  EUR: '🇪🇺',
  GBP: '🇬🇧',
  JPY: '🇯🇵',
  CNY: '🇨🇳',
  AUD: '🇦🇺',
  CAD: '🇨🇦',
  CHF: '🇨🇭',
  NZD: '🇳🇿'
};

// VIP keywords for most important events
const VIP_KEYWORDS = [
  'Federal Funds Rate', 'FOMC', 'Interest Rate', 'Rate Decision', 'Rate Statement',
  'CPI', 'Inflation', 'NFP', 'Non-Farm', 'Employment Change', 'Unemployment',
  'GDP', 'Central Bank', 'Press Conference', 'Powell', 'Lagarde',
  'BOJ', 'ECB', 'BOE', 'Fed', 'SNB', 'RBA', 'BOC', 'RBNZ'
];

export default async function handler(req, res) {
  // Verify cron secret or allow test mode
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;
  const isValidCron = cronSecret && authHeader === `Bearer ${cronSecret}`;
  const isTestMode = req.query.test === 'true';
  const shouldSend = req.query.send === 'true';

  // Allow test mode for debugging (won't send unless send=true)
  if (!isValidCron && !isTestMode) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Fetch calendar data
    const calendarResponse = await fetch('https://nfs.faireconomy.media/ff_calendar_thisweek.json');
    const allEvents = await calendarResponse.json();

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    // Filter for high-impact events happening TODAY
    const majorCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'AUD', 'CAD', 'CHF'];

    const upcomingAlerts = allEvents.filter(event => {
      if (event.impact !== 'High') return false;
      if (!majorCurrencies.includes(event.country)) return false;

      const eventDate = new Date(event.date);
      // Alert for events happening today (and not already past)
      return eventDate >= now && eventDate < todayEnd;
    });

    if (upcomingAlerts.length === 0) {
      return res.status(200).json({
        message: 'No upcoming high-impact events to alert',
        checked: now.toISOString()
      });
    }

    // Group events by time (some happen at the same time like FOMC)
    const groupedEvents = {};
    upcomingAlerts.forEach(event => {
      const key = event.date;
      if (!groupedEvents[key]) {
        groupedEvents[key] = [];
      }
      groupedEvents[key].push(event);
    });

    // Check if any event is VIP
    const hasVIP = upcomingAlerts.some(e =>
      VIP_KEYWORDS.some(kw => e.title.toLowerCase().includes(kw.toLowerCase()))
    );

    // Build single consolidated message
    const todayStr = now.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      timeZone: 'America/New_York'
    });

    let message = hasVIP
      ? `🚨 <b>HIGH IMPACT EVENTS TODAY</b> 🚨\n\n📅 ${todayStr}\n\n`
      : `📅 <b>Economic Calendar - ${todayStr}</b>\n\n`;

    // Sort time slots and add each group
    const sortedTimes = Object.keys(groupedEvents).sort((a, b) => new Date(a) - new Date(b));

    for (const dateKey of sortedTimes) {
      const events = groupedEvents[dateKey];
      const eventDate = new Date(dateKey);
      const timeStr = eventDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/New_York'
      });

      message += `⏰ <b>${timeStr} ET</b>\n`;

      events.forEach(event => {
        const flag = FLAGS[event.country] || '🌍';
        message += `${flag} ${event.title}`;
        if (event.forecast) message += ` (Fcst: ${event.forecast})`;
        message += '\n';
      });

      message += '\n';
    }

    message += `💡 <i>High-impact events can cause significant market volatility.</i>`;
    message += `\n\n<a href="https://capital-flow-filter.vercel.app">View Full Calendar →</a>`;

    const alertData = {
      eventCount: upcomingAlerts.length,
      timeSlots: sortedTimes.length,
      events: upcomingAlerts.map(e => e.title),
      message,
      sent: false
    };

    // Only send if not in test mode or if send=true
    if (!isTestMode || shouldSend) {
      const telegramResponse = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML',
            disable_web_page_preview: true
          })
        }
      );

      const telegramResult = await telegramResponse.json();
      alertData.sent = telegramResult.ok;
      if (!telegramResult.ok) {
        alertData.error = telegramResult.description;
      }
    }

    return res.status(200).json({
      message: isTestMode && !shouldSend
        ? `Test mode: Found ${upcomingAlerts.length} event(s) to send (add &send=true to actually send)`
        : `Sent daily digest with ${upcomingAlerts.length} event(s)`,
      testMode: isTestMode,
      alert: alertData,
      checked: now.toISOString()
    });

  } catch (error) {
    console.error('Economic alerts error:', error);
    return res.status(500).json({ error: error.message });
  }
}
