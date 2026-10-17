// Economic Calendar API
// High-impact events for the currencies that move crypto. Source: Financial Modeling Prep (paid key in
// FMP_API_KEY: next two weeks, with actual results), falling back to Forex Factory's free this-week feed.

const MAJOR_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'AUD', 'CAD', 'CHF'];

// Keywords for extra important events
const VIP_KEYWORDS = [
  'Federal Funds Rate', 'FOMC', 'Interest Rate', 'Rate Decision', 'Rate Statement',
  'CPI', 'Inflation', 'NFP', 'Non-Farm', 'Non Farm', 'Employment Change', 'Unemployment',
  'GDP', 'PMI', 'Central Bank', 'Press Conference', 'Powell', 'Warsh', 'Lagarde',
  'BOJ', 'ECB', 'BOE', 'Fed', 'SNB', 'RBA', 'BOC', 'RBNZ'
];

// FMP lists every line of a release separately (CPI comes as six rows). Events with the same currency and
// time are one release: the headline figure leads, ranked by this list, and the rest are counted.
const HEADLINE_ORDER = [
  'Interest Rate Decision', 'Non Farm Payrolls', 'Inflation Rate YoY', 'Core Inflation Rate YoY',
  'GDP Growth Rate', 'Unemployment Rate', 'Retail Sales MoM', 'Producer Price Index MoM', 'Initial Jobless Claims',
  'S&P Global Manufacturing PMI', 'S&P Global Services PMI', 'ISM Manufacturing PMI'
];

const isVipTitle = (title) => VIP_KEYWORDS.some((kw) => title.toLowerCase().includes(kw.toLowerCase()));
const headlineRank = (title) => {
  // startsWith, so "Core Inflation Rate YoY" doesn't count as the headline "Inflation Rate YoY"
  const i = HEADLINE_ORDER.findIndex((h) => title.toLowerCase().startsWith(h.toLowerCase()));
  return i === -1 ? HEADLINE_ORDER.length : i;
};
const withUnit = (v, unit) => (v === null || v === undefined ? null : `${v}${unit === '%' ? '%' : unit && unit.length <= 2 ? unit : ''}`);
const ymd = (d) => d.toISOString().slice(0, 10);

async function fromFmp(key, now) {
  const from = new Date(now.getTime() - 7 * 86400000);
  const to = new Date(now.getTime() + 14 * 86400000);
  const response = await fetch(`https://financialmodelingprep.com/stable/economic-calendar?from=${ymd(from)}&to=${ymd(to)}&apikey=${key}`);
  if (!response.ok) throw new Error(`FMP calendar error: ${response.status}`);
  const rows = await response.json();
  if (!Array.isArray(rows)) throw new Error('Invalid FMP calendar response');

  const groups = new Map();
  for (const r of rows) {
    if (r.impact !== 'High' || !MAJOR_CURRENCIES.includes(r.currency)) continue;
    const id = `${r.currency}|${r.date}`;
    if (!groups.has(id)) groups.set(id, []);
    groups.get(id).push(r);
  }

  return [...groups.values()].map((g) => {
    g.sort((a, b) => headlineRank(a.event) - headlineRank(b.event));
    const lead = g[0];
    const date = lead.date.replace(' ', 'T') + 'Z'; // FMP times are UTC
    return {
      title: lead.event + (g.length > 1 ? ` +${g.length - 1} more` : ''),
      country: lead.currency,
      date,
      forecast: withUnit(lead.estimate, lead.unit),
      previous: withUnit(lead.previous, lead.unit),
      actual: withUnit(lead.actual, lead.unit),
      isVIP: g.some((r) => isVipTitle(r.event))
    };
  });
}

async function fromForexFactory() {
  const response = await fetch('https://nfs.faireconomy.media/ff_calendar_thisweek.json');
  if (!response.ok) throw new Error(`Calendar API error: ${response.status}`);
  const allEvents = await response.json();
  return allEvents
    .filter((event) => event.impact === 'High' && MAJOR_CURRENCIES.includes(event.country))
    .map((event) => ({
      title: event.title,
      country: event.country,
      date: event.date,
      forecast: event.forecast || null,
      previous: event.previous || null,
      actual: null,
      isVIP: isVipTitle(event.title)
    }));
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate'); // 30 min cache (actuals land through the day)

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const now = new Date();
    let source = 'fmp';
    let events;
    try {
      if (!process.env.FMP_API_KEY) throw new Error('FMP_API_KEY not set');
      events = await fromFmp(process.env.FMP_API_KEY, now);
    } catch (fmpError) {
      console.error('FMP calendar failed, using Forex Factory:', fmpError.message);
      source = 'forexfactory';
      events = await fromForexFactory();
    }

    const eventsWithParsedDates = events.map((event) => {
      const eventDate = new Date(event.date);
      return {
        ...event,
        // FMP occasionally fills in an actual before the release; only trust it afterwards
        actual: eventDate < now ? event.actual : null,
        timestamp: eventDate.getTime(),
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
      source,
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
