// Delayed Signals Feed API
// Returns signals older than 24 hours for the public feed

import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const DATABASE_URL = process.env.DATABASE_URL;

  // If database not configured, return empty array
  if (!DATABASE_URL) {
    return res.status(200).json({
      signals: [],
      message: 'Database not configured'
    });
  }

  try {
    const sql = neon(DATABASE_URL);

    // Fetch signals older than 24 hours, limit to 20
    const signals = await sql`
      SELECT
        id,
        timestamp,
        message,
        signal_type as "signalType",
        direction,
        timeframe,
        ticker
      FROM signals
      WHERE timestamp < NOW() - INTERVAL '24 hours'
      ORDER BY timestamp DESC
      LIMIT 20
    `;

    return res.status(200).json({
      signals: signals,
      total: signals.length,
      delayed: true,
      delayHours: 24
    });

  } catch (error) {
    console.error('Error fetching signals:', error);
    return res.status(200).json({ signals: [], error: error.message });
  }
}
