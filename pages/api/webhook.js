// TradingView → Telegram Webhook
// Vercel Serverless Function
// Saves signals to Neon Postgres for delayed feed display

import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '-1001548592148';
  const DATABASE_URL = process.env.DATABASE_URL;

  // GET request = test the connection
  if (req.method === 'GET') {
    if (!TELEGRAM_BOT_TOKEN) {
      return res.status(200).json({
        status: 'Webhook active',
        telegram: 'NOT CONFIGURED - Add TELEGRAM_BOT_TOKEN env var',
        database: DATABASE_URL ? 'Configured' : 'NOT CONFIGURED',
        chat_id: TELEGRAM_CHAT_ID
      });
    }
    return res.status(200).json({
      status: 'Webhook active and ready',
      telegram: 'Configured',
      database: DATABASE_URL ? 'Configured' : 'NOT CONFIGURED',
      chat_id: TELEGRAM_CHAT_ID
    });
  }

  // Only accept POST requests for actual alerts
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!TELEGRAM_BOT_TOKEN) {
    console.error('Missing TELEGRAM_BOT_TOKEN');
    return res.status(500).json({ error: 'Bot token not configured' });
  }

  try {
    // Get the message from TradingView
    let message;

    if (typeof req.body === 'string') {
      message = req.body;
    } else if (req.body.message) {
      message = req.body.message;
    } else if (req.body.text) {
      message = req.body.text;
    } else {
      // Use the raw body as message
      message = JSON.stringify(req.body, null, 2);
    }

    // If TradingView sends the alert message directly as plain text
    if (!message || message === '{}') {
      const rawBody = await getRawBody(req);
      message = rawBody || 'Signal received (no message content)';
    }

    console.log('Received alert:', message);

    // Parse signal metadata from message
    const signalData = parseSignalMessage(message);

    // Send to Telegram
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const telegramResult = await telegramResponse.json();

    if (!telegramResult.ok) {
      console.error('Telegram error:', telegramResult);
      return res.status(500).json({
        error: 'Failed to send to Telegram',
        details: telegramResult
      });
    }

    // Save signal to Neon database (if configured)
    if (DATABASE_URL) {
      try {
        await saveSignalToNeon(signalData, DATABASE_URL);
        console.log('Signal saved to database');
      } catch (dbError) {
        console.error('Database save error (non-fatal):', dbError.message);
      }
    }

    console.log('Message sent successfully');
    return res.status(200).json({ success: true, message: 'Alert sent to Telegram' });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// Parse signal message to extract metadata
function parseSignalMessage(message) {
  const now = new Date().toISOString();

  // Try to detect signal type from message content
  let signalType = 'signal';
  let direction = 'neutral';
  let timeframe = 'unknown';
  let ticker = 'BTC';

  const msgLower = message.toLowerCase();

  // Detect direction
  if (msgLower.includes('bullish') || msgLower.includes('long') || msgLower.includes('🟢') || msgLower.includes('📈')) {
    direction = 'bullish';
  } else if (msgLower.includes('bearish') || msgLower.includes('short') || msgLower.includes('🔴') || msgLower.includes('📉')) {
    direction = 'bearish';
  }

  // Detect signal type
  if (msgLower.includes('full send') || msgLower.includes('🚀')) {
    signalType = 'full_send';
  } else if (msgLower.includes('confluence')) {
    signalType = 'confluence';
  } else if (msgLower.includes('manipulation') || msgLower.includes('🐋')) {
    signalType = 'manipulation';
  } else if (msgLower.includes('divergence')) {
    signalType = 'divergence';
  } else if (msgLower.includes('flip')) {
    signalType = 'flip';
  }

  // Detect timeframe
  if (msgLower.includes('5m') || msgLower.includes('scalp')) {
    timeframe = '5m';
  } else if (msgLower.includes('15m')) {
    timeframe = '15m';
  } else if (msgLower.includes('1h') || msgLower.includes('intraday')) {
    timeframe = '1H';
  } else if (msgLower.includes('4h') || msgLower.includes('swing')) {
    timeframe = '4H';
  } else if (msgLower.includes('1d') || msgLower.includes('daily')) {
    timeframe = '1D';
  }

  // Detect ticker
  const tickerMatch = message.match(/\b(BTC|ETH|SOL|XRP|ADA|DOGE|AVAX|DOT|LINK|MATIC)\b/i);
  if (tickerMatch) {
    ticker = tickerMatch[1].toUpperCase();
  }

  return {
    timestamp: now,
    message: message,
    signalType,
    direction,
    timeframe,
    ticker
  };
}

// Save signal to Neon Postgres
async function saveSignalToNeon(signalData, databaseUrl) {
  const sql = neon(databaseUrl);

  // Create table if it doesn't exist
  await sql`
    CREATE TABLE IF NOT EXISTS signals (
      id SERIAL PRIMARY KEY,
      timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      message TEXT NOT NULL,
      signal_type VARCHAR(50),
      direction VARCHAR(20),
      timeframe VARCHAR(10),
      ticker VARCHAR(20)
    )
  `;

  // Insert the signal
  await sql`
    INSERT INTO signals (timestamp, message, signal_type, direction, timeframe, ticker)
    VALUES (${signalData.timestamp}, ${signalData.message}, ${signalData.signalType}, ${signalData.direction}, ${signalData.timeframe}, ${signalData.ticker})
  `;

  // Clean up old signals (keep last 7 days)
  await sql`
    DELETE FROM signals WHERE timestamp < NOW() - INTERVAL '7 days'
  `;
}

// Helper to get raw body if needed
async function getRawBody(req) {
  if (req.body) return null;

  return new Promise((resolve) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => resolve(data));
    req.on('error', () => resolve(null));
  });
}
