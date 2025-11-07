import { Link } from "react-router-dom";
import "./Legal.css";

export default function Privacy() {
  return (
    <main className="page-legal" aria-labelledby="privacy-h1">
      <div className="container">
        <header className="lg-hero">
          <h1 id="privacy-h1" className="lg-title">Privacy</h1>
          <p className="lg-sub">No cookies. No trackers (unless you opt-in).</p>
        </header>

        <section className="lg-card">
          <h2>What we collect</h2>
          <p>We run Google Analytics 4 without Ads features, without Google Signals, and without linking to other Google products. IP is anonymized by GA4. No fingerprinting, no session replay, no cross-site tracking.</p>

          <h3>Analytics</h3>
          <p>When enabled, GA4 stores first-party cookies to count visits and understand generic usage (pages, referrers). We do not send custom identifiers or PII.</p>

          <h3>Your control</h3>
          <ul>
            <li>Toggle Analytics anytime from <strong>Manage cookies</strong> in the footer.</li>
            <li>We honor <em>Do Not Track</em> and <em>prefers-reduced-motion</em> for animations.</li>
          </ul>

          <div className="lg-actions">
            <Link to="/" className="btn-ghost">← Back home</Link>
            <Link to="/cookies" className="btn-primary">Cookies policy</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
