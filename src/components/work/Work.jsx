import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Work.css";
import { CASES } from "./workData.js";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

/* The intake demo runs as its own app, so the target is configurable.
   Falls back to the local dev port used by demos/intake. */
const INTAKE_URL = import.meta.env.VITE_INTAKE_URL || "http://localhost:5183";

/* ---------- ICONS ---------- */
const LiveIcon = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M7 17L17 7M9 7h8v8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TryIcon = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M8 5.5v13l10-6.5-10-6.5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

/* ---------- BUTTON ---------- */
function ActionButton({ action, caseTitle }) {
  if (!action) return null;

  const isTry = action.kind === "try";
  const href = isTry ? INTAKE_URL : action.href;

  // A live target with no URL yet stays visible as a placeholder, not a dead link.
  if (!href) {
    return (
      <span className="wk-btn wk-btn--pending" role="note">
        <LiveIcon />
        <span>{action.label}</span>
        <em className="wk-pending-tag">{action.pending}</em>
      </span>
    );
  }

  return (
    <a
      className={`wk-btn ${isTry ? "wk-btn--try" : "wk-btn--live"}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${caseTitle}: ${action.label}`}
    >
      {isTry ? <TryIcon /> : <LiveIcon />}
      <span>{action.label}</span>
    </a>
  );
}

/* ---------- FIELD / OFFICE DIAGRAM ----------
   Abstract, not a fake dashboard: two sides, one shared line of truth. */
function FieldOfficeDiagram() {
  return (
    <div className="wk-diagram" aria-hidden="true">
      <svg viewBox="20 72 600 144" preserveAspectRatio="xMidYMid meet">
        {/* shared spine */}
        <line className="wk-dg-spine" x1="70" y1="130" x2="570" y2="130" />

        {/* field side */}
        <g className="wk-dg-side">
          <rect x="40" y="86" width="120" height="88" rx="12" />
          <path className="wk-dg-mark" d="M66 150 l24 -30 20 24 14 -18 20 24" />
        </g>
        <text className="wk-dg-label" x="100" y="200" textAnchor="middle">
          FIELD
        </text>

        {/* office side */}
        <g className="wk-dg-side">
          <rect x="480" y="86" width="120" height="88" rx="12" />
          <path className="wk-dg-mark" d="M506 156 v-26 M528 156 v-42 M550 156 v-18 M572 156 v-34" />
        </g>
        <text className="wk-dg-label" x="540" y="200" textAnchor="middle">
          OFFICE
        </text>

        {/* the shared record in the middle */}
        <g className="wk-dg-core">
          <rect x="250" y="94" width="140" height="72" rx="10" />
          <line x1="272" y1="118" x2="368" y2="118" />
          <line x1="272" y1="134" x2="344" y2="134" />
          <line x1="272" y1="150" x2="356" y2="150" />
        </g>

        {/* status moving both ways */}
        <g className="wk-dg-flow">
          <circle cx="205" cy="130" r="5" />
          <circle cx="435" cy="130" r="5" />
        </g>
      </svg>
    </div>
  );
}

/* ---------- SCREENSHOT STRIP ---------- */
function Shots({ shots, caseTitle }) {
  if (!shots?.length) return null;
  return (
    <div className="wk-shots">
      {shots.map((s, i) =>
        s.pending ? (
          <figure className="wk-shot wk-shot--pending" key={i}>
            <div className="wk-shot-slot">
              <span className="wk-shot-slot-tag">Screenshot</span>
              <span className="wk-shot-slot-note">{s.pending}</span>
            </div>
            <figcaption>[MARCO: screenshot da inserire]</figcaption>
          </figure>
        ) : (
          <figure className="wk-shot" key={i}>
            <img src={s.src} alt={s.alt} loading="lazy" decoding="async" />
            <figcaption>{s.caption}</figcaption>
          </figure>
        )
      )}
    </div>
  );
}

/* ---------- ONE CASE ---------- */
function CaseCard({ data }) {
  const { kicker, title, meta, problem, built, changed, note, shots, stack } =
    data;

  return (
    <article className="wk-card" style={{ "--accent": data.accent }}>
      <header className="wk-head">
        <p className="wk-kicker">{kicker}</p>
        <h3 className="wk-title">{title}</h3>
        <p className="wk-meta">{meta}</p>
      </header>

      <div className="wk-moments">
        <section className="wk-moment">
          <h4 className="wk-label">The problem</h4>
          <p className="wk-text">{problem}</p>
        </section>

        <section className="wk-moment">
          <h4 className="wk-label">What I built</h4>
          <p className="wk-text">{built.lead}</p>
        </section>

        <section className="wk-moment">
          <h4 className="wk-label">What changed</h4>
          <ul className="wk-changed">
            {changed.map((c, i) => {
              const text = typeof c === "string" ? c : c.text;
              const action = typeof c === "string" ? null : c.action;
              return (
                <li key={i}>
                  <span>{text}</span>
                  {action && (
                    <ActionButton action={action} caseTitle={title} />
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {built.systems && (
        <div className="wk-systems">
          {built.systems.map((s, i) => (
            <section className="wk-system" key={i}>
              <div className="wk-system-head">
                <h5 className="wk-system-title">{s.title}</h5>
                {s.action && (
                  <ActionButton action={s.action} caseTitle={s.title} />
                )}
              </div>
              <p className="wk-text">{s.body}</p>
            </section>
          ))}
        </div>
      )}

      {data.diagram === "field-office" && <FieldOfficeDiagram />}

      {note && <p className="wk-note">{note}</p>}

      <Shots shots={shots} caseTitle={title} />

      {stack && <p className="wk-stack">{stack}</p>}
    </article>
  );
}

/* ---------- SECTION ---------- */
export default function Work() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const gctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray(".wk-card").forEach((card) => {
          gsap.from(card, {
            y: 48,
            opacity: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              once: true,
            },
          });
        });
      });

      return () => mm.revert();
    }, root);

    return () => gctx.revert();
  }, []);

  return (
    <section className="work" ref={rootRef} aria-labelledby="work-heading">
      <div className="wk-intro">
        <h2 className="wk-ih" id="work-heading">
          Work.
        </h2>
        <p className="wk-id">Problems I found, and what I built to remove them.</p>
      </div>

      <div className="wk-list">
        {CASES.map((c) => (
          <CaseCard data={c} key={c.id} />
        ))}
      </div>
    </section>
  );
}
