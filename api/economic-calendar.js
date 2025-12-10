// Economic Calendar API
// Fetches high-impact events from Forex Factory feed
// Focuses on interest rate decisions, CPI, employment data

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); // 1 hour cache

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch('https://nfs.faireconomy.media/ff_calendar_thisweek.json');

    if (!response.ok) {
      throw new Error(`Calendar API error: ${response.status}`);
    }

    const allEvents = await response.json();

    // Filter for high-impact events only
    // Focus on major currencies that affect crypto: USD, EUR, GBP, JPY, CNY
    const majorCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'AUD', 'CAD', 'CHF'];

    // Keywords for extra important events
    const vipKeywords = [
      'Federal Funds Rate', 'FOMC', 'Interest Rate', 'Rate Decision', 'Rate Statement',
      'CPI', 'Inflation', 'NFP', 'Non-Farm', 'Employment Change', 'Unemployment',
      'GDP', 'PMI', 'Central Bank', 'Press Conference', 'Powell', 'Lagarde',
      'BOJ', 'ECB', 'BOE', 'Fed', 'SNB', 'RBA', 'BOC', 'RBNZ'
    ];

    const highImpactEvents = allEvents.filter(event => {
      // Must be High impact
      if (event.impact !== 'High') return false;

      // Must be a major currency
      if (!majorCurrencies.includes(event.country)) return false;

      return true;
    });

    // Parse dates and sort
    const now = new Date();
    const eventsWithParsedDates = highImpactEvents.map(event => {
      const eventDate = new Date(event.date);
      const isVIP = vipKeywords.some(kw =>
        event.title.toLowerCase().includes(kw.toLowerCase())
      );

      return {
        title: event.title,
        country: event.country,
        date: event.date,
        timestamp: eventDate.getTime(),
        forecast: event.forecast || null,
        previous: event.previous || null,
        isVIP,
        isPast: eventDate < now,
        isToday: eventDate.toDateString() === now.toDateString(),
        relativeTime: getRelativeTime(eventDate, now)
      };
    });

    // Sort by date
    eventsWithParsedDates.sort((a, b) => a.timestamp - b.timestamp);

    // Split into upcoming and recent
    const upcoming = eventsWithParsedDates.filter(e => !e.isPast);
    const recent = eventsWithParsedDates.filter(e => e.isPast).slice(-5).reverse();

    return res.status(200).json({
      upcoming: upcoming.slice(0, 10), // Next 10 high-impact events
      recent: recent, // Last 5 events
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Economic Calendar API error:', error);
    return res.status(200).json({
      upcoming: [],
      recent: [],
      error: error.message
    });
  }
}

function getRelativeTime(eventDate, now) {
  const diffMs = eventDate - now;
  const diffMins = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);

  if (diffMs < 0) {
    // Past
    const absMins = Math.abs(diffMins);
    const absHours = Math.abs(diffHours);
    if (absMins < 60) return `${absMins}m ago`;
    if (absHours < 24) return `${absHours}h ago`;
    return `${Math.abs(diffDays)}d ago`;
  } else {
    // Future
    if (diffMins < 60) return `in ${diffMins}m`;
    if (diffHours < 24) return `in ${diffHours}h`;
    if (diffDays === 1) return 'Tomorrow';
    return `in ${diffDays}d`;
  }
}
