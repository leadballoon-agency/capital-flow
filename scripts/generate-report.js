#!/usr/bin/env node

/**
 * MDX Capital Flow Daily Report Generator
 *
 * Usage: node scripts/generate-report.js [screenshot-path]
 *
 * This script:
 * 1. Reads BTC 4H chart screenshot with Capital Flow indicator
 * 2. Sends to Claude for analysis
 * 3. Generates formatted Telegram report
 * 4. Posts report + image to Telegram channel
 */

import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '-1001548592148';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// Find the most recent screenshot
function findLatestScreenshot(dir) {
  const screenshotDir = dir || path.join(__dirname, '../public/Daily 4H BTC Screenshots');

  if (!fs.existsSync(screenshotDir)) {
    throw new Error(`Screenshot directory not found: ${screenshotDir}`);
  }

  const files = fs.readdirSync(screenshotDir)
    .filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'))
    .map(f => ({
      name: f,
      path: path.join(screenshotDir, f),
      mtime: fs.statSync(path.join(screenshotDir, f)).mtime
    }))
    .sort((a, b) => b.mtime - a.mtime);

  if (files.length === 0) {
    throw new Error('No screenshots found in directory');
  }

  return files[0];
}

// Extract date from filename like "BTCUSDT_2025-12-08_10-37-35_ffcc0.png"
function extractDateFromFilename(filename) {
  const match = filename.match(/(\d{4})-(\d{2})-(\d{2})_(\d{2})-(\d{2})-(\d{2})/);
  if (match) {
    const [_, year, month, day, hour, min, sec] = match;
    const date = new Date(`${year}-${month}-${day}T${hour}:${min}:${sec}Z`);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Analyze screenshot with Claude
async function analyzeChart(imagePath, reportDate) {
  const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  const imageData = fs.readFileSync(imagePath);
  const base64Image = imageData.toString('base64');
  const mediaType = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg';

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1500,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: base64Image
            }
          },
          {
            type: 'text',
            text: `You are an expert crypto trading analyst. Analyze this BTC/USDT 4H chart with the MDX Capital Flow indicator.

TODAY'S DATE IS: ${reportDate}

Look at:
1. **CAPITAL FLOW PANEL** (top right) - Read the MACRO, CRYPTO, SECTORS values and overall signal (BULLISH/BEARISH/NEUTRAL)
2. **Price Action** - Current price, recent trend, key levels
3. **Keltner Channels** - Price position relative to bands (overbought/oversold/neutral)
4. **Signal Dots** - Any recent buy/sell signals visible on chart

Generate a concise daily market report in this EXACT format (use these emojis and headers):

📊 <b>MDX CAPITAL FLOW — DAILY BTC REPORT</b>
📅 ${reportDate}

<b>🎯 SIGNAL:</b> [BULLISH 🟢 / BEARISH 🔴 / NEUTRAL 🟡]

<b>💰 PRICE:</b> $XX,XXX (describe position in Keltner bands)

<b>🌍 MACRO:</b>
• DXY: [reading] — [interpretation]
• VIX: [reading] — [interpretation]
• GOLD: [reading] — [interpretation]
• YIELDS: [reading] — [interpretation]

<b>₿ CRYPTO LEADERS:</b>
• BTC Flow: [reading]
• ETH Flow: [reading]

<b>📈 SECTORS:</b>
• BTC.D: [reading] — [majors vs alts interpretation]
• TOTAL3: [reading]

<b>📝 ANALYSIS:</b>
[2-3 sentences on what the Capital Flow data suggests for the next 24-48 hours. Be specific about potential scenarios.]

<b>⚠️ KEY LEVELS:</b>
• Resistance: $XX,XXX
• Support: $XX,XXX

<i>Not financial advice. Trade at your own risk.</i>
#BTC #CapitalFlow #MDX

Keep it factual based on what you see in the chart. If you can't read specific values, describe what you can see.`
          }
        ]
      }
    ]
  });

  return response.content[0].text;
}

// Send photo to Telegram
async function sendTelegramPhoto(imagePath, caption = '') {
  const FormData = (await import('form-data')).default;
  const fetch = (await import('node-fetch')).default;

  const form = new FormData();
  form.append('chat_id', TELEGRAM_CHAT_ID);
  form.append('photo', fs.createReadStream(imagePath));
  if (caption) {
    form.append('caption', caption);
    form.append('parse_mode', 'HTML');
  }

  const response = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
    {
      method: 'POST',
      body: form
    }
  );

  const result = await response.json();

  if (!result.ok) {
    throw new Error(`Telegram photo error: ${result.description}`);
  }

  return result;
}

// Send text message to Telegram
async function sendTelegramMessage(text) {
  const fetch = (await import('node-fetch')).default;

  const response = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: text,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    }
  );

  const result = await response.json();

  if (!result.ok) {
    throw new Error(`Telegram message error: ${result.description}`);
  }

  return result;
}

// Send full report (photo + text)
async function sendTelegramReport(imagePath, report) {
  // Send photo first with short caption
  await sendTelegramPhoto(imagePath, '📊 <b>MDX Capital Flow — BTC 4H Analysis</b>');

  // Then send full report as text message
  await sendTelegramMessage(report);
}

// Main execution
async function main() {
  console.log('🚀 MDX Capital Flow Report Generator\n');

  // Check environment variables
  if (!ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY not set');
    process.exit(1);
  }
  if (!TELEGRAM_BOT_TOKEN) {
    console.error('❌ TELEGRAM_BOT_TOKEN not set');
    process.exit(1);
  }

  try {
    // Find screenshot
    const customPath = process.argv[2];
    const screenshot = customPath
      ? { path: customPath, name: path.basename(customPath) }
      : findLatestScreenshot();

    console.log(`📸 Using screenshot: ${screenshot.name}`);
    const chartDate = extractDateFromFilename(screenshot.name);
    console.log(`📅 Chart date: ${chartDate}\n`);

    // Analyze with Claude
    console.log('🤖 Analyzing chart with Claude...');
    const report = await analyzeChart(screenshot.path, chartDate);
    console.log('\n📝 Generated Report:\n');
    console.log(report);
    console.log('\n');

    // Send to Telegram
    console.log('📤 Sending to Telegram...');
    await sendTelegramReport(screenshot.path, report);
    console.log('✅ Report sent successfully!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
