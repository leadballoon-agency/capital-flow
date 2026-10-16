import './privacy.css';

export const metadata = {
  title: "Privacy Policy | Capital Flow",
  description: "Privacy Policy for Capital Flow trading signals service."
};

export default function PrivacyPage() {
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
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last updated: December 2024</p>
        <p>
          Capital Flow ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our trading signals service and website.
        </p>
        <h2>1. Information We Collect</h2>
        <p>We collect minimal information necessary to provide our services:</p>
        <ul>
          <li>
            <strong>Telegram Information:</strong>
            {' '}When you join our Telegram channel, we receive your Telegram username and user ID as provided by Telegram's platform.
          </li>
          <li>
            <strong>Usage Data:</strong>
            {' '}We may collect anonymous analytics data about how you interact with our website, including pages visited and time spent.
          </li>
          <li>
            <strong>Communications:</strong>
            {' '}If you contact us directly, we may receive additional information such as your name, email address, and the contents of your message.
          </li>
        </ul>
        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Deliver trading signals and alerts through our Telegram channel</li>
          <li>Improve and optimize our services</li>
          <li>Respond to your inquiries and provide customer support</li>
          <li>Send important updates about our service</li>
        </ul>
        <h2>3. Information Sharing</h2>
        <p>
          We do not sell, trade, or rent your personal information to third parties. We may share information only in the following circumstances:
        </p>
        <ul>
          <li>
            <strong>Service Providers:</strong>
            {' '}We use third-party services (Vercel for hosting, Telegram for messaging) that may process data on our behalf.
          </li>
          <li>
            <strong>Legal Requirements:</strong>
            {' '}We may disclose information if required by law or to protect our rights and safety.
          </li>
        </ul>
        <h2>4. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
        </p>
        <h2>5. Third-Party Services</h2>
        <p>Our service integrates with third-party platforms:</p>
        <ul>
          <li>
            <strong>Telegram:</strong>
            {' '}Subject to{' '}
            <a href="https://telegram.org/privacy" target="_blank" rel="noopener">Telegram's Privacy Policy</a>
          </li>
          <li>
            <strong>TradingView:</strong>
            {' '}Signals are generated using TradingView's platform, subject to{' '}
            <a href="https://www.tradingview.com/privacy-policy/" target="_blank" rel="noopener">TradingView's Privacy Policy</a>
          </li>
          <li>
            <strong>Vercel:</strong>
            {' '}Our website is hosted on Vercel, subject to{' '}
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener">Vercel's Privacy Policy</a>
          </li>
        </ul>
        <h2>6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access the personal information we hold about you</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of your information</li>
          <li>Opt out of our Telegram channel at any time by leaving the group</li>
        </ul>
        <h2>7. Cookies</h2>
        <p>
          Our website may use cookies and similar tracking technologies to enhance your experience. You can control cookies through your browser settings.
        </p>
        <h2>8. Children's Privacy</h2>
        <p>
          Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children.
        </p>
        <h2>9. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
        </p>
        <h2>10. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us through our{' '}
          <a href="https://t.me/fivedaytrader" target="_blank" rel="noopener">Telegram channel</a>
          .
        </p>
      </div>
      <footer>
        <div className="footer-links">
          <a href="/">Home</a>
          {' '}
          <a href="/privacy">Privacy Policy</a>
          {' '}
          <a href="/disclaimer">Disclaimer</a>
        </div>
        <p className="copyright" style={{ maxWidth: "500px", margin: "0 auto 1rem", fontSize: "0.7rem" }}>
          <strong style={{ color: "var(--orange)" }}>Disclosure:</strong>
          {' '}Capital Flow is a free, independent project.
        </p>
        <p className="copyright">Built by traders, for traders.</p>
      </footer>
    </>
  );
}
