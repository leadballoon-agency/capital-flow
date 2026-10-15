import './suggest.css';
import SuggestionsBoard from '../components/SuggestionsBoard';

export const metadata = {
  title: "Suggest a Feature | MDX Capital Flow",
  description: "Help shape the future of Capital Flow Filter. Submit your ideas and vote on community suggestions."
};

export default function SuggestPage() {
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
            <a href="/reports">Reports</a>
            {' '}
            <a href="/about">About</a>
            {' '}
            <a href="https://t.me/fivedaytrader" target="_blank">Telegram</a>
          </div>
        </div>
      </nav>
      <div className="container">
        <div className="page-header">
          <h1>Shape the Future</h1>
          <p>
            Your ideas help make Capital Flow better for everyone. Submit suggestions and see what's coming next.
          </p>
        </div>
        <SuggestionsBoard />
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
        </div>
        <p className="copyright">Built by traders, for traders.</p>
      </footer>
    </>
  );
}
