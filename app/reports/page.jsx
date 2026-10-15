import './reports.css';
import SuggestWidget from '../components/SuggestWidget';
import ReportsArchive from '../components/ReportsArchive';

export const metadata = {
  title: "Daily Reports | MDX Capital Flow",
  description: "Daily BTC market analysis powered by MDX Capital Flow indicator. Charts, signals, and institutional-grade capital flow insights."
};

export default function ReportsPage() {
  return (
    <>
      <nav>
        <div className="nav-content">
          <a href="/" className="logo">
            <span className="logo-icon">CF</span>
            {' '}Capital Flow
          </a>
          <div className="nav-links">
            <a href="/">Home</a>
            {' '}
            <a href="/oscillator">Oscillator</a>
            {' '}
            <a href="/reports" className="active">Reports</a>
            {' '}
            <a href="/about">About</a>
            {' '}
            <a href="https://t.me/fivedaytrader" target="_blank">Telegram</a>
          </div>
        </div>
      </nav>
      <div className="container">
        <div className="page-header">
          <h1>Daily Reports</h1>
          <p>Institutional-grade BTC analysis powered by Capital Flow indicator</p>
        </div>
        <ReportsArchive />
      </div>
      <footer>
        <div className="footer-links">
          <a href="/">Home</a>
          {' '}
          <a href="/reports">Reports</a>
          {' '}
          <a href="/about">About</a>
          {' '}
          <a href="https://t.me/fivedaytrader" target="_blank">Telegram</a>
          {' '}
          <a href="https://mdxalgo.com/?ref=CsMGq" target="_blank">MDX ALGO</a>
          {' '}
          <a href="/privacy">Privacy</a>
          {' '}
          <a href="/disclaimer">Disclaimer</a>
        </div>
        <p className="copyright" style={{ maxWidth: "500px", margin: "0 auto 1rem", fontSize: "0.7rem", color: "var(--gray)" }}>
          <strong style={{ color: "var(--orange)" }}>Disclosure:</strong>
          {' '}Capital Flow Filter is a free, independent indicator. Not affiliated with MDX ALGO. Affiliate links used.
        </p>
        <p className="copyright">Built by traders, for traders.</p>
      </footer>
      <SuggestWidget />
    </>
  );
}
