import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Work.css";
import { CASES } from "./workData.js";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

/* The intake demo runs as its own app, so the target is configurable.
   Falls back to the local dev port used by demos/intake. */
const INTAKE_URL = import.meta.env.VITE_INTAKE_URL || "http://localhost:5184";

/* ---------- ICONS ---------- */
const ArrowOut = () => (
  <svg className="wk-ico" aria-hidden="true" viewBox="0 0 16 16" fill="none">
    <path d="M5 11 11 5M6 5h5v5" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowRight = () => (
  <svg className="wk-ico" aria-hidden="true" viewBox="0 0 16 16" fill="none">
    <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ---------- BUTTON ----------
   One shape everywhere: a hairline outline that fills on hover, the same
   language as the contact button in the footer. Only the icon changes. */
function ActionButton({ action, caseTitle }) {
  if (!action) return null;

  const isTry = action.kind === "try";
  const href = isTry ? INTAKE_URL : action.href;

  if (!href) {
    return (
      <span className="wk-btn wk-btn--pending" role="note">
        {action.label}
        <em className="wk-pending-tag">{action.pending}</em>
      </span>
    );
  }

  return (
    <a
      className="wk-btn"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${caseTitle}: ${action.label}`}
    >
      <span>{action.label}</span>
      {isTry ? <ArrowRight /> : <ArrowOut />}
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

/* ---------- LIGHTBOX ----------
   A dashboard shrunk to a thumbnail proves nothing. Clicking one opens it
   at a size where you can actually read the thing. */
function Lightbox({ shots, index, onClose, onMove }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onMove(1);
      if (e.key === "ArrowLeft") onMove(-1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, onMove]);

  const shot = shots[index];
  if (!shot) return null;

  /* Rendered into <body>: the cards carry GSAP transforms, and a transformed
     ancestor makes position: fixed resolve against the card instead of the
     viewport, which pushes the overlay half off screen. */
  return createPortal(
    <div
      className="wk-lb"
      role="dialog"
      aria-modal="true"
      aria-label={shot.alt}
      onClick={onClose}
    >
      <button className="wk-lb-close" onClick={onClose} aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" />
        </svg>
      </button>

      {shots.length > 1 && (
        <>
          <button
            className="wk-lb-nav wk-lb-nav--prev"
            aria-label="Previous"
            onClick={(e) => { e.stopPropagation(); onMove(-1); }}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M14.5 5 8 12l6.5 7" stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            className="wk-lb-nav wk-lb-nav--next"
            aria-label="Next"
            onClick={(e) => { e.stopPropagation(); onMove(1); }}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9.5 5 16 12l-6.5 7" stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}

      <figure className="wk-lb-fig" onClick={(e) => e.stopPropagation()}>
        <img src={shot.src} alt={shot.alt} />
        <figcaption>
          <span>{shot.caption}</span>
          <em>
            {index + 1} of {shots.length}
          </em>
        </figcaption>
      </figure>
    </div>,
    document.body
  );
}

/* ---------- SCREENSHOT STRIP ---------- */
function Shots({ shots }) {
  const [open, setOpen] = useState(null);
  if (!shots?.length) return null;

  return (
    <>
      <div className={`wk-shots ${shots.length === 1 ? "wk-shots--one" : ""}`}>
        {shots.map((s, i) => (
          <figure className="wk-shot" key={i}>
            <button
              className="wk-shot-btn"
              onClick={() => setOpen(i)}
              aria-label={`Enlarge: ${s.alt}`}
            >
              <img src={s.src} alt={s.alt} loading="lazy" decoding="async" />
            </button>
            <figcaption>{s.caption}</figcaption>
          </figure>
        ))}
      </div>

      {open !== null && (
        <Lightbox
          shots={shots}
          index={open}
          onClose={() => setOpen(null)}
          onMove={(d) => setOpen((v) => (v + d + shots.length) % shots.length)}
        />
      )}
    </>
  );
}

/* ---------- ONE CASE ---------- */
function Outcome({ item }) {
  return <li>{typeof item === "string" ? item : item.text}</li>;
}

function CaseCard({ data }) {
  const { kicker, title, problem, built, changed, stack, shots } = data;
  const metrics = changed?.metrics || [];
  const notes = changed?.notes || [];

  /* A button wrapped inside a sentence breaks the line badly, worse on a
     phone. Every case-level action moves up into the header instead. */
  const cardActions = notes
    .filter((n) => typeof n !== "string" && n.action)
    .map((n) => n.action);

  return (
    <article className="wk-card" style={{ "--accent": data.accent }}>
      <header className="wk-head">
        <p className="wk-role">
          <span>{data.role}</span>
          <span className="wk-dot" aria-hidden="true" />
          <span>{data.context}</span>
        </p>
        <h3 className="wk-title">{title}</h3>
        <p className="wk-tagline">{kicker}</p>
        {cardActions.length > 0 && (
          <div className="wk-actions">
            {cardActions.map((a, i) => (
              <ActionButton action={a} caseTitle={title} key={i} />
            ))}
          </div>
        )}
      </header>

      {/* the hook and the approach, side by side: two columns, not three */}
      <div className="wk-top">
        <section className="wk-moment wk-moment--problem">
          <h4 className="wk-label">The problem</h4>
          <p className="wk-lede">{problem}</p>
        </section>

        <section className="wk-moment">
          <h4 className="wk-label">What I built</h4>
          <p className="wk-text">{built.lead}</p>
          {data.diagram === "field-office" && <FieldOfficeDiagram />}
        </section>
      </div>

      {/* each system shows itself, so the text never runs long */}
      {built.systems && (
        <div className="wk-systems">
          {built.systems.map((sys, i) => (
            <section className="wk-system" key={i}>
              <div className="wk-system-copy">
                <div className="wk-system-head">
                  <h5 className="wk-system-title">{sys.title}</h5>
                  {sys.action && (
                    <ActionButton action={sys.action} caseTitle={sys.title} />
                  )}
                </div>
                <p className="wk-text">{sys.body}</p>
              </div>
              <Shots shots={sys.shots} />
            </section>
          ))}
        </div>
      )}

      {shots?.length > 0 && <Shots shots={shots} />}

      {/* the payoff: figures first, then the lines that need words */}
      <section className="wk-changed">
        <h4 className="wk-label">What changed</h4>

        {changed?.statement && (
          <p className="wk-statement">{changed.statement}</p>
        )}

        {changed?.platforms?.length > 0 && (
          <ul className="wk-platforms" aria-label="Live on">
            {changed.platforms.map((t) => (
              <li key={t}>
                <span className="wk-live-dot" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
        )}

        {metrics.length > 0 && (
          <ul className="wk-metrics">
            {metrics.map((m) => (
              <li key={m.value}>
                <span className="wk-metric-value">{m.value}</span>
                <span className="wk-metric-label">{m.label}</span>
              </li>
            ))}
          </ul>
        )}

        {notes.length > 0 && (
          <ul className="wk-notes">
            {notes.map((n, i) => (
              <Outcome item={n} key={i} />
            ))}
          </ul>
        )}
      </section>

      {stack?.length > 0 && (
        <ul className="wk-stack" aria-label="Stack">
          {stack.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      )}
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

      mm.add("(prefers-reduced-motion: no-preference)", (ctx) => {
        const isMobile = window.matchMedia("(max-width: 767px)").matches;

        gsap.utils.toArray(".wk-card").forEach((card) => {
          /* The card arrives as one slab, then its contents land in order:
             kicker, title, the three moments, the rest. */
          const head = card.querySelector(".wk-head");
          const moments = card.querySelectorAll(".wk-moment");
          const rest = card.querySelectorAll(
            ".wk-actions, .wk-system, .wk-card > .wk-shots, .wk-changed, .wk-stack"
          );

          const tl = gsap.timeline({
            scrollTrigger: { trigger: card, start: "top 86%", once: true },
            defaults: { ease: "power3.out" },
          });

          tl.from(card, { yPercent: 6, opacity: 0, scale: 0.985, duration: 0.75 })
            .from(
              head.querySelectorAll(':scope > :not(.wk-actions)'),
              { y: 18, opacity: 0, duration: 0.5, stagger: 0.07 },
              "-=0.42"
            )
            .from(
              moments,
              { y: 22, opacity: 0, duration: 0.55, stagger: 0.09 },
              "-=0.3"
            )
            .from(
              rest,
              { y: 18, opacity: 0, duration: 0.5, stagger: 0.06 },
              "-=0.32"
            );

          /* the rule under each label draws itself in */
          gsap.from(card.querySelectorAll(".wk-label"), {
            scaleX: 0,
            transformOrigin: "0% 50%",
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.09,
            scrollTrigger: { trigger: card, start: "top 84%", once: true },
          });

        });

        /* the whole stack breathes: each card lifts a little as it comes up */
        gsap.utils.toArray(".wk-card").forEach((card, i) => {
          if (i === 0) return;
          gsap.fromTo(
            card,
            { y: 26 },
            {
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "top 55%",
                scrub: 0.6,
              },
            }
          );
        });

        return () => ctx.revert();
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
