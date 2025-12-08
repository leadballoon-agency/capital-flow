// TradingView → Telegram Webhook
// Vercel Serverless Function

export default async function handler(req, res) {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '-1001548592148';

  // GET request = test the connection
  if (req.method === 'GET') {
    if (!TELEGRAM_BOT_TOKEN) {
      return res.status(200).json({
        status: 'Webhook active',
        telegram: 'NOT CONFIGURED - Add TELEGRAM_BOT_TOKEN env var',
        chat_id: TELEGRAM_CHAT_ID
      });
    }
    return res.status(200).json({
      status: 'Webhook active and ready',
      telegram: 'Configured',
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

    console.log('Message sent successfully');
    return res.status(200).json({ success: true, message: 'Alert sent to Telegram' });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
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
