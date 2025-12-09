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

// Fetch Fear & Greed Index from Alternative.me
async function fetchFearGreed() {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch('https://api.alternative.me/fng/?limit=1');
    const data = await response.json();

    if (!data.data || !data.data[0]) {
      throw new Error('Invalid F&G response');
    }

    const fng = data.data[0];
    const value = parseInt(fng.value);
    const classification = fng.value_classification;

    // Determine emoji and color context
    let emoji, level;
    if (value <= 25) {
      emoji = '😱';
      level = 'extreme_fear';
    } else if (value <= 45) {
      emoji = '😨';
      level = 'fear';
    } else if (value <= 55) {
      emoji = '😐';
      level = 'neutral';
    } else if (value <= 75) {
      emoji = '😀';
      level = 'greed';
    } else {
      emoji = '🤑';
      level = 'extreme_greed';
    }

    return {
      value,
      classification,
      emoji,
      level,
      is_fear: value < 50,
      is_greed: value >= 50,
      is_extreme: value <= 25 || value >= 75
    };
  } catch (error) {
    console.error('⚠️ Could not fetch Fear & Greed Index:', error.message);
    return null;
  }
}

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

// Get previous report for context
function getPreviousReport() {
  const archivePath = path.join(__dirname, '../public/reports-data.json');
  if (fs.existsSync(archivePath)) {
    const archive = JSON.parse(fs.readFileSync(archivePath, 'utf-8'));
    if (archive.length > 0) {
      return archive[0]; // Most recent report
    }
  }
  return null;
}

// Analyze screenshot with Claude
async function analyzeChart(imagePath, reportDate, fearGreedData) {
  const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  const imageData = fs.readFileSync(imagePath);
  const base64Image = imageData.toString('base64');
  const mediaType = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg';

  // Get previous report for context
  const prevReport = getPreviousReport();
  const prevContext = prevReport
    ? `\n\nPREVIOUS REPORT (${prevReport.date}):\n${prevReport.reportText}\n\nUse the previous report for context - note any changes in signal, open levels regained/lost, or shifts in bias. Reference changes like "Yesterday's LEAN BULL has shifted to NEUTRAL" or "Successfully reclaimed the DO that was lost yesterday".`
    : '';

  // Fear & Greed context
  const fngContext = fearGreedData
    ? `\n\nFEAR & GREED INDEX (from Alternative.me):
• Value: ${fearGreedData.value} (${fearGreedData.classification})
• ${fearGreedData.emoji} ${fearGreedData.is_extreme ? 'EXTREME ' : ''}${fearGreedData.is_fear ? 'FEAR' : 'GREED'}

IMPORTANT F&G INTERPRETATION:
- If Capital Flow is BULLISH and F&G shows FEAR = STRONG confirmation (contrarian buy opportunity)
- If Capital Flow is BULLISH and F&G shows GREED = Caution (crowded trade, watch for pullback)
- If Capital Flow is BEARISH and F&G shows GREED = STRONG confirmation (distribution/sell signal)
- If Capital Flow is BEARISH and F&G shows FEAR = Caution (possible capitulation bottom)

Include the F&G Index in your report using this format:
<b>😨 FEAR & GREED:</b> ${fearGreedData.value} — ${fearGreedData.classification} ${fearGreedData.emoji}
• Signal Alignment: [✅ Confirms / ⚠️ Diverges] Capital Flow — [brief interpretation]`
    : '';

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

CRITICAL INSTRUCTIONS - READ CAREFULLY:
1. The GREEN price label on the RIGHT AXIS shows current price (around $90,500 area today)
2. Open level labels on chart:
   - "DO" = Today's Daily Open (current day)
   - Light blue lines with brackets like "(1)" "(2)" = Previous daily opens (days back)
   - "WO" = Weekly Open
   - "Dec" or "MO" = Monthly Open (December)
   - "Q1" = Quarterly Open, "YO" = Yearly Open
3. If current price is BELOW a level line, you have LOST that level (bearish)
4. If current price is ABOVE a level line, you are HOLDING that level (bullish)
5. GREEN horizontal zones = Support levels, RED horizontal zones = Resistance levels
6. DO NOT make up prices - only report what you can actually see on the chart

Look at:
1. **CAPITAL FLOW PANEL** (top right) - Read the MACRO, CRYPTO, SECTORS values and overall signal (BULLISH/BEARISH/NEUTRAL/LEAN BULL/LEAN BEAR) with percentage
2. **Price Action** - Read the ACTUAL current price from the GREEN label on right axis
3. **Support/Resistance Zones** - GREEN horizontal zones = Support, RED horizontal zones = Resistance. Read prices from labels.
4. **Signal Dots** - Any recent buy/sell signals visible on chart
5. **Open Levels** - Look for horizontal lines labeled "DO" (Daily Open), "WO" (Weekly Open), "MO" (Monthly Open), also "Q1" (Quarterly), "YO" (Yearly Open). Compare current price to each - if price is ABOVE the line = Holding, if price is BELOW the line = Lost

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

<b>😨 FEAR & GREED:</b> [value] — [classification] [emoji]
• Signal Alignment: [✅ Confirms / ⚠️ Diverges] Capital Flow — [interpretation]

<b>📝 ANALYSIS:</b>
[2-3 sentences on what the Capital Flow data suggests for the next 24-48 hours. Be specific about potential scenarios.]

<b>⚠️ KEY LEVELS:</b>
• Resistance: $XX,XXX (read from RED horizontal zones on chart)
• Support: $XX,XXX (read from GREEN horizontal zones on chart)

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

IMPORTANT: Only report values you can actually see in the image. Read the price scale on the right side of the chart carefully. Current BTC price in Dec 2025 is approximately $90,000-$100,000.${prevContext}${fngContext}`
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
function saveReportToArchive(screenshot, chartDate, report, fearGreedData) {
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
    reportText: report.replace(/<[^>]*>/g, ''), // Strip HTML tags
    fearGreed: fearGreedData ? {
      value: fearGreedData.value,
      classification: fearGreedData.classification,
      emoji: fearGreedData.emoji
    } : null
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

    // Fetch Fear & Greed Index
    console.log('😨 Fetching Fear & Greed Index...');
    const fearGreedData = await fetchFearGreed();
    if (fearGreedData) {
      console.log(`   ${fearGreedData.emoji} F&G: ${fearGreedData.value} (${fearGreedData.classification})\n`);
    } else {
      console.log('   ⚠️ F&G data unavailable, continuing without it\n');
    }

    // Analyze with Claude
    console.log('🤖 Analyzing chart with Claude...');
    const report = await analyzeChart(screenshot.path, chartDate, fearGreedData);
    console.log('\n📝 Generated Report:\n');
    console.log(report);
    console.log('\n');

    // Save to archive
    saveReportToArchive(screenshot, chartDate, report, fearGreedData);

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
