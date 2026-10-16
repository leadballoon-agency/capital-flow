import './reports.css';
import Logo from '../components/Logo';
import SuggestWidget from '../components/SuggestWidget';
import ReportsArchive from '../components/ReportsArchive';

export const metadata = {
  title: "Daily Reports | Capital Flow",
  description: "Daily BTC market analysis powered by Capital Flow indicator. Charts, signals, and institutional-grade capital flow insights."
};

export default function ReportsPage() {
  return (
    <>
      <nav>
        <div className="nav-content">
          <a href="/" className="logo">
            <Logo />
            {' '}Capital Flow
          </a>
          <div className="nav-links">
            <a href="/">Home</a>
            {' '}
            <a href="/signals">Live Signals</a>
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
          <a href="/privacy">Privacy</a>
          {' '}
          <a href="/disclaimer">Disclaimer</a>
        </div>
        <p className="copyright" style={{ maxWidth: "500px", margin: "0 auto 1rem", fontSize: "0.7rem", color: "var(--gray)" }}>
          <strong style={{ color: "var(--brand)" }}>Disclosure:</strong>
          {' '}Capital Flow is a free, independent project.
        </p>
        <p className="copyright">Built by traders, for traders.</p>
      </footer>
      <SuggestWidget />
    </>
  );
}
