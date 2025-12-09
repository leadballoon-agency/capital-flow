// Delayed Signals Feed API
// Returns signals older than 24 hours for the public feed

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const KV_REST_API_URL = process.env.KV_REST_API_URL;
  const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN;

  // If KV not configured, return empty array
  if (!KV_REST_API_URL || !KV_REST_API_TOKEN) {
    return res.status(200).json({
      signals: [],
      message: 'Signal storage not configured'
    });
  }

  try {
    // Fetch signals from KV
    const response = await fetch(`${KV_REST_API_URL}/get/signals`, {
      headers: {
        Authorization: `Bearer ${KV_REST_API_TOKEN}`
      }
    });

    if (!response.ok) {
      return res.status(200).json({ signals: [] });
    }

    const data = await response.json();

    if (!data.result) {
      return res.status(200).json({ signals: [] });
    }

    const allSignals = JSON.parse(data.result);

    // Filter to only show signals older than 24 hours
    const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);

    const delayedSignals = allSignals.filter(signal => {
      const signalTime = new Date(signal.timestamp).getTime();
      return signalTime < twentyFourHoursAgo;
    });

    // Return max 20 signals for the feed
    return res.status(200).json({
      signals: delayedSignals.slice(0, 20),
      total: delayedSignals.length,
      delayed: true,
      delayHours: 24
    });

  } catch (error) {
    console.error('Error fetching signals:', error);
    return res.status(200).json({ signals: [], error: error.message });
  }
}
