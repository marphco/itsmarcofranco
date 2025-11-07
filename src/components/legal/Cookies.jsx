import { Link } from "react-router-dom";
import "./Legal.css";

export default function Cookies() {
  return (
    <main className="page-legal" aria-labelledby="cookies-h1">
      <div className="container">
        <header className="lg-hero">
          <h1 id="cookies-h1" className="lg-title">Cookies</h1>
          <p className="lg-sub">Minimal, first-party, analytics-only.</p>
        </header>

        <section className="lg-card">
          <h2>Types</h2>
          <ul>
            <li><strong>Necessary:</strong> none set by us.</li>
            <li><strong>Analytics (optional):</strong> GA4 first-party cookies to measure traffic and pages visited.</li>
          </ul>

        <h3>Disable / Opt-out</h3>
        <p>Use <strong>Manage cookies</strong> in the footer to disable Analytics. Your choice is stored locally (no server profile).</p>

          <div className="lg-actions">
            <Link to="/" className="btn-ghost">← Back home</Link>
            <Link to="/privacy" className="btn-primary">Privacy policy</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
