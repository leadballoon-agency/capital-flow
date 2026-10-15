import './disclaimer.css';

export const metadata = {
  title: "Disclaimer | MDX Capital Flow",
  description: "Risk disclaimer and terms for MDX Capital Flow trading signals service."
};

export default function DisclaimerPage() {
  return (
    <>
      <nav>
        <div className="nav-content">
          <a href="/" className="logo">
            <span className="logo-icon">CF</span>
            {' '}Capital Flow
          </a>
          {' '}
          <a href="/" className="back-link">← Back to Home</a>
        </div>
      </nav>
      <div className="container">
        <h1>Disclaimer</h1>
        <p className="last-updated">Last updated: December 2024</p>
        <div className="warning-box">
          <p>
            IMPORTANT: Trading cryptocurrencies involves substantial risk of loss and is not suitable for all investors. You should carefully consider whether trading is suitable for you in light of your circumstances, knowledge, and financial resources.
          </p>
        </div>
        <h2>1. Not Financial Advice</h2>
        <p>
          MDX Capital Flow and all affiliated parties are{' '}
          <strong>not registered as financial advisors</strong>
          . The signals, analysis, and information provided through our service are for{' '}
          <strong>educational and informational purposes only</strong>
          {' '}and should not be construed as financial, investment, or trading advice.
        </p>
        <p>
          Nothing on this website or in our Telegram channel constitutes a recommendation to buy, sell, or hold any cryptocurrency or financial instrument.
        </p>
        <h2>2. No Guarantees</h2>
        <p>We make no guarantees, representations, or warranties regarding:</p>
        <ul>
          <li>The accuracy, completeness, or timeliness of any signals or information provided</li>
          <li>Future performance or profitability of any trading strategy</li>
          <li>The success of any particular trade or investment decision</li>
          <li>The availability or reliability of our service</li>
        </ul>
        <div className="highlight-box">
          <p>
            <strong>Past performance is not indicative of future results.</strong>
            {' '}Any historical data, backtests, or performance metrics shown are for illustrative purposes only and do not guarantee future performance.
          </p>
        </div>
        <h2>3. Risk Acknowledgment</h2>
        <p>By using our service, you acknowledge and accept that:</p>
        <ul>
          <li>Cryptocurrency markets are highly volatile and unpredictable</li>
          <li>You may lose some or all of your invested capital</li>
          <li>Leveraged trading significantly amplifies both potential profits and losses</li>
          <li>
            Market manipulation, technical failures, and other unforeseen events can impact your trades
          </li>
          <li>
            Regulatory changes may affect the legality or viability of cryptocurrency trading in your jurisdiction
          </li>
        </ul>
        <h2>4. Your Responsibility</h2>
        <p>You are solely responsible for:</p>
        <ul>
          <li>Conducting your own research and due diligence before making any trading decisions</li>
          <li>Evaluating the suitability of any investment based on your personal circumstances</li>
          <li>Managing your own risk, including setting appropriate stop-losses and position sizes</li>
          <li>Ensuring compliance with all applicable laws and regulations in your jurisdiction</li>
          <li>Any losses or damages resulting from your trading activities</li>
        </ul>
        <h2>5. Signal Accuracy</h2>
        <p>
          Our Capital Flow Filter indicator analyzes market data to generate trading signals. However:
        </p>
        <ul>
          <li>No indicator or trading system is 100% accurate</li>
          <li>
            Signals are generated based on historical data and mathematical models that may not account for all market conditions
          </li>
          <li>Market conditions can change rapidly, potentially invalidating signals</li>
          <li>Technical issues, delays, or errors may affect signal delivery</li>
        </ul>
        <h2>6. Third-Party Services</h2>
        <p>
          Our service integrates with third-party platforms including TradingView, Telegram, and cryptocurrency exchanges. We are not responsible for:
        </p>
        <ul>
          <li>The availability, reliability, or security of these platforms</li>
          <li>Any losses resulting from technical issues with third-party services</li>
          <li>Changes to third-party terms of service or APIs that may affect our service</li>
        </ul>
        <h2>7. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, MDX Capital Flow, its owners, operators, affiliates, and partners shall not be liable for any:
        </p>
        <ul>
          <li>Direct, indirect, incidental, special, or consequential damages</li>
          <li>Loss of profits, revenue, data, or other intangible losses</li>
          <li>Damages resulting from your use of or inability to use our service</li>
          <li>Unauthorized access to or alteration of your data</li>
        </ul>
        <h2>8. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless MDX Capital Flow and its affiliates from any claims, damages, or expenses arising from your use of our service or violation of these terms.
        </p>
        <h2>9. Jurisdiction</h2>
        <p>
          Our service may not be available or legal in all jurisdictions. It is your responsibility to ensure that your use of our service complies with all applicable local laws and regulations.
        </p>
        <h2>10. Changes to This Disclaimer</h2>
        <p>
          We reserve the right to modify this disclaimer at any time. Continued use of our service after any changes constitutes acceptance of the updated terms.
        </p>
        <h2>11. Contact</h2>
        <p>
          For questions about this disclaimer, please contact us through our{' '}
          <a href="https://t.me/fivedaytrader" target="_blank" rel="noopener">Telegram channel</a>
          {' '}or via{' '}
          <a href="https://mdxalgo.com/?ref=CsMGq" target="_blank" rel="noopener">MDX ALGO</a>
          .
        </p>
        <div className="highlight-box">
          <p>
            <strong>
              By using MDX Capital Flow, you confirm that you have read, understood, and agree to this disclaimer.
            </strong>
          </p>
        </div>
      </div>
      <footer>
        <div className="footer-links">
          <a href="/">Home</a>
          {' '}
          <a href="/privacy">Privacy Policy</a>
          {' '}
          <a href="/disclaimer">Disclaimer</a>
          {' '}
          <a href="https://mdxalgo.com/?ref=CsMGq" target="_blank">MDX ALGO</a>
        </div>
        <p className="copyright" style={{ maxWidth: "500px", margin: "0 auto 1rem", fontSize: "0.7rem" }}>
          <strong style={{ color: "var(--orange)" }}>Disclosure:</strong>
          {' '}Capital Flow Filter is a free, independent indicator. Not affiliated with MDX ALGO. Affiliate links used.
        </p>
        <p className="copyright">Built by traders, for traders.</p>
      </footer>
    </>
  );
}
