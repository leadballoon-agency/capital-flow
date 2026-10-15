// Long/Short Ratio API Proxy
// Fetches BTC L/S ratio from OKX (primary) with Binance fallback
// Supports period query param: 5m, 1H, 1D (default: 1H)

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate'); // 1 min cache

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get period from query param, default to 1H
  const { period = '1H' } = req.query;

  // Validate period - OKX supports: 5m, 1H, 1D
  const validPeriods = ['5m', '1H', '1D'];
  const okxPeriod = validPeriods.includes(period) ? period : '1H';

  try {
    let ratio, longPct, shortPct, timestamp;
    let source = 'okx';

    // Try OKX API first (not geo-blocked in US)
    try {
      const okxResponse = await fetch(
        `https://www.okx.com/api/v5/rubik/stat/contracts/long-short-account-ratio?ccy=BTC&period=${okxPeriod}`
      );

      if (okxResponse.ok) {
        const okxData = await okxResponse.json();
        if (okxData.code === '0' && okxData.data && okxData.data.length > 0) {
          // OKX returns [timestamp, ratio] pairs, latest first
          const latestEntry = okxData.data[0];
          timestamp = parseInt(latestEntry[0]);
          ratio = parseFloat(latestEntry[1]);

          // Convert ratio to percentages: ratio = long/short
          // If ratio is 1.71, that means for every 1 short, there are 1.71 longs
          // longPct = ratio / (ratio + 1) * 100
          // shortPct = 1 / (ratio + 1) * 100
          longPct = (ratio / (ratio + 1)) * 100;
          shortPct = (1 / (ratio + 1)) * 100;
        } else {
          throw new Error('Invalid OKX response');
        }
      } else {
        throw new Error(`OKX API error: ${okxResponse.status}`);
      }
    } catch (okxError) {
      // Fallback to Binance API (may be geo-blocked)
      source = 'binance';
      const binanceResponse = await fetch(
        'https://fapi.binance.com/futures/data/globalLongShortAccountRatio?symbol=BTCUSDT&period=4h&limit=1'
      );

      if (!binanceResponse.ok) {
        throw new Error(`Binance API error: ${binanceResponse.status}`);
      }

      const binanceData = await binanceResponse.json();

      if (!binanceData || !binanceData[0]) {
        throw new Error('Invalid response from Binance');
      }

      const lsData = binanceData[0];
      // Parse percentages (API returns as decimal strings like "0.6622")
      longPct = parseFloat(lsData.longAccount) * 100;
      shortPct = parseFloat(lsData.shortAccount) * 100;
      ratio = parseFloat(lsData.longShortRatio);
      timestamp = lsData.timestamp;
    }

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
      period: okxPeriod,
      longPct: Math.round(longPct * 10) / 10,    // e.g., 66.2
      shortPct: Math.round(shortPct * 10) / 10,  // e.g., 33.8
      ratio: Math.round(ratio * 100) / 100,       // e.g., 1.96
      crowding,
      crowdingLevel,
      label,
      emoji,
      timestamp,
      source,
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
