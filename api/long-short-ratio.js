// Long/Short Ratio API Proxy
// Fetches BTC L/S ratio with fallback sources

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate'); // 15 min cache

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Try Binance API first (may be geo-blocked in some regions)
    let response = await fetch(
      'https://fapi.binance.com/futures/data/globalLongShortAccountRatio?symbol=BTCUSDT&period=4h&limit=1'
    );

    // If Binance is blocked (451), try alternative via public CORS proxy
    if (response.status === 451) {
      // Use allorigins.win as a CORS proxy for Binance API
      const proxyUrl = 'https://api.allorigins.win/raw?url=' +
        encodeURIComponent('https://fapi.binance.com/futures/data/globalLongShortAccountRatio?symbol=BTCUSDT&period=4h&limit=1');
      response = await fetch(proxyUrl);
    }

    if (!response.ok) {
      throw new Error(`Binance API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data[0]) {
      throw new Error('Invalid response from Binance');
    }

    const lsData = data[0];

    // Parse percentages (API returns as decimal strings like "0.6622")
    const longPct = parseFloat(lsData.longAccount) * 100;
    const shortPct = parseFloat(lsData.shortAccount) * 100;
    const ratio = parseFloat(lsData.longShortRatio);

    // Determine crowding status
    let crowding, crowdingLevel, emoji;
    if (longPct >= 65) {
      crowding = 'crowded_long';
      crowdingLevel = 'extreme';
      emoji = '⚠️';
    } else if (longPct >= 60) {
      crowding = 'crowded_long';
      crowdingLevel = 'moderate';
      emoji = '⚠️';
    } else if (shortPct >= 65) {
      crowding = 'crowded_short';
      crowdingLevel = 'extreme';
      emoji = '⚠️';
    } else if (shortPct >= 60) {
      crowding = 'crowded_short';
      crowdingLevel = 'moderate';
      emoji = '⚠️';
    } else {
      crowding = 'balanced';
      crowdingLevel = 'none';
      emoji = '⚖️';
    }

    // Determine label text
    let label;
    if (crowding === 'crowded_long') {
      label = crowdingLevel === 'extreme' ? 'Retail Very Long' : 'Retail Long';
    } else if (crowding === 'crowded_short') {
      label = crowdingLevel === 'extreme' ? 'Retail Very Short' : 'Retail Short';
    } else {
      label = 'Balanced';
    }

    return res.status(200).json({
      symbol: 'BTCUSDT',
      longPct: Math.round(longPct * 10) / 10,    // e.g., 66.2
      shortPct: Math.round(shortPct * 10) / 10,  // e.g., 33.8
      ratio: Math.round(ratio * 100) / 100,       // e.g., 1.96
      crowding,
      crowdingLevel,
      label,
      emoji,
      timestamp: lsData.timestamp,
      // For confirmation logic
      is_crowded_long: longPct >= 60,
      is_crowded_short: shortPct >= 60,
      is_extreme: longPct >= 65 || shortPct >= 65
    });

  } catch (error) {
    console.error('Long/Short Ratio API error:', error);

    // Return fallback neutral data on error
    return res.status(200).json({
      symbol: 'BTCUSDT',
      longPct: 50,
      shortPct: 50,
      ratio: 1,
      crowding: 'balanced',
      crowdingLevel: 'none',
      label: 'Data unavailable',
      emoji: '—',
      error: error.message,
      is_crowded_long: false,
      is_crowded_short: false,
      is_extreme: false
    });
  }
}
