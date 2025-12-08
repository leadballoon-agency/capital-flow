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
    max_tokens: 1800,
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

CRITICAL INSTRUCTIONS:
1. Read the EXACT current price from the chart's price axis (right side) or the price label. BTC is currently trading around $90,000-$100,000 range in late 2025.
2. Support/Resistance levels MUST be within 5-10% of the current price. If price is ~$92,000, support might be $88,000-$90,000 and resistance $95,000-$98,000.
3. DO NOT hallucinate prices. If you cannot read the exact price, estimate based on the visible price scale on the right axis.

Look at:
1. **CAPITAL FLOW PANEL** (top right) - Read the MACRO, CRYPTO, SECTORS values and overall signal (BULLISH/BEARISH/NEUTRAL/LEAN BULL/LEAN BEAR)
2. **Price Action** - Read the ACTUAL current price from the chart
3. **Keltner Channels** - Price position relative to bands (overbought/oversold/neutral)
4. **Signal Dots** - Any recent buy/sell signals visible on chart
5. **D/W/M Opens** - Look for horizontal lines labeled with Daily, Weekly, Monthly opens (may show as "D Open", "W Open", "M Open" or similar). Read the exact price from each label and determine if current price is ABOVE or BELOW each level.

Generate a concise daily market report in this EXACT format (use these emojis and headers):

📊 <b>MDX CAPITAL FLOW — DAILY BTC REPORT</b>
📅 ${reportDate}

<b>🎯 SIGNAL:</b> [Read from panel: BULLISH 🟢 / BEARISH 🔴 / NEUTRAL 🟡 / LEAN BULL 🟢 / LEAN BEAR 🔴] + percentage

<b>💰 PRICE:</b> $XX,XXX (read actual price from chart, describe position in Keltner bands)

<b>🌍 MACRO:</b>
• DXY: [exact %] — [interpretation]
• VIX: [exact %] — [interpretation]
• GOLD: [exact %] — [interpretation]
• YIELDS: [exact %] — [interpretation]

<b>₿ CRYPTO LEADERS:</b>
• BTC Flow: [exact %]
• ETH Flow: [exact %]

<b>📈 SECTORS:</b>
• BTC.D: [exact %] — [majors vs alts interpretation]
• TOTAL3: [exact %]

<b>📝 ANALYSIS:</b>
[2-3 sentences on what the Capital Flow data suggests for the next 24-48 hours. Be specific about potential scenarios.]

<b>⚠️ KEY LEVELS:</b> (must be realistic - within 5-10% of current price)
• Resistance: $XX,XXX (based on Keltner upper band or recent highs visible on chart)
• Support: $XX,XXX (based on Keltner lower band or recent lows visible on chart)

<b>📍 OPEN LEVELS:</b>
• Daily: $XX,XXX — [✅ Holding / ❌ Lost] — [context]
• Weekly: $XX,XXX — [✅ Holding / ❌ Lost] — [context]
• Monthly: $XX,XXX — [✅ Holding / ❌ Lost] — [context]

<i>Not financial advice. Trade at your own risk.</i>
#BTC #CapitalFlow #MDX

OPEN LEVELS INTERPRETATION:
- ✅ Holding Daily = bullish intraday momentum, buyers defending today's start
- ❌ Lost Daily = bearish intraday, sellers control today
- ✅ Holding Weekly = bullish weekly structure, institutions long this week
- ❌ Lost Weekly = bearish weekly, distribution occurring
- ✅ Holding Monthly = bullish monthly bias, trend continuation
- ❌ Lost Monthly = bearish monthly, potential reversal

If D/W/M open lines are not visible on the chart, write "Not visible" for that level.

IMPORTANT: Only report values you can actually see in the image. Read the price scale on the right side of the chart carefully. Current BTC price in Dec 2025 is approximately $90,000-$100,000.`
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

// Save report to JSON archive
function saveReportToArchive(screenshot, chartDate, report) {
  const archivePath = path.join(__dirname, '../public/reports-data.json');

  // Load existing archive or create new
  let archive = [];
  if (fs.existsSync(archivePath)) {
    archive = JSON.parse(fs.readFileSync(archivePath, 'utf-8'));
  }

  // Extract signal from report
  let signal = 'neutral';
  let signalValue = '0%';
  if (report.includes('BULLISH') || report.includes('LEAN BULL')) {
    signal = 'bullish';
    const match = report.match(/(\d+%)/);
    if (match) signalValue = match[1];
  } else if (report.includes('BEARISH') || report.includes('LEAN BEAR')) {
    signal = 'bearish';
    const match = report.match(/(\d+%)/);
    if (match) signalValue = match[1];
  }

  // Create report entry
  const entry = {
    id: Date.now(),
    date: chartDate,
    timestamp: new Date().toISOString(),
    image: `/Daily 4H BTC Screenshots/${screenshot.name}`,
    signal: signal,
    signalValue: signalValue,
    reportHtml: report,
    reportText: report.replace(/<[^>]*>/g, '') // Strip HTML tags
  };

  // Add to beginning of archive (newest first)
  archive.unshift(entry);

  // Keep last 100 reports
  archive = archive.slice(0, 100);

  // Save
  fs.writeFileSync(archivePath, JSON.stringify(archive, null, 2));
  console.log(`📁 Report saved to archive (${archive.length} total reports)`);

  return entry;
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

    // Save to archive
    saveReportToArchive(screenshot, chartDate, report);

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
