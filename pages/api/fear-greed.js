// Fear & Greed Index API Proxy
// Fetches from Alternative.me and caches for 1 hour

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); // 1 hour cache

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Fetch from Alternative.me
    const response = await fetch('https://api.alternative.me/fng/?limit=1');

    if (!response.ok) {
      throw new Error(`Alternative.me API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data || !data.data[0]) {
      throw new Error('Invalid response from Alternative.me');
    }

    const fng = data.data[0];

    // Parse and enrich the data
    const value = parseInt(fng.value);
    const classification = fng.value_classification;

    // Determine sentiment level
    let level, color, emoji;
    if (value <= 25) {
      level = 'extreme_fear';
      color = '#ff4444';
      emoji = '😱';
    } else if (value <= 45) {
      level = 'fear';
      color = '#ff8844';
      emoji = '😨';
    } else if (value <= 55) {
      level = 'neutral';
      color = '#ffcc00';
      emoji = '😐';
    } else if (value <= 75) {
      level = 'greed';
      color = '#88cc44';
      emoji = '😀';
    } else {
      level = 'extreme_greed';
      color = '#00cc44';
      emoji = '🤑';
    }

    return res.status(200).json({
      value,
      classification,
      level,
      color,
      emoji,
      timestamp: fng.timestamp,
      time_until_update: fng.time_until_update,
      // For confirmation logic
      is_fear: value < 50,
      is_greed: value >= 50,
      is_extreme: value <= 25 || value >= 75
    });

  } catch (error) {
    console.error('Fear & Greed API error:', error);

    // Return fallback neutral data on error
    return res.status(200).json({
      value: 50,
      classification: 'Neutral',
      level: 'neutral',
      color: '#ffcc00',
      emoji: '😐',
      error: error.message,
      is_fear: false,
      is_greed: false,
      is_extreme: false
    });
  }
}
