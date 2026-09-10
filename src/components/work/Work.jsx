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
        ×
      </button>

      {shots.length > 1 && (
        <>
          <button
            className="wk-lb-nav wk-lb-nav--prev"
            aria-label="Previous"
            onClick={(e) => { e.stopPropagation(); onMove(-1); }}
          >
            ‹
          </button>
          <button
            className="wk-lb-nav wk-lb-nav--next"
            aria-label="Next"
            onClick={(e) => { e.stopPropagation(); onMove(1); }}
          >
            ›
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

  const viewable = shots.filter((s) => !s.pending);
  const indexIn = (s) => viewable.indexOf(s);

  return (
    <>
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
              <button
                className="wk-shot-btn"
                onClick={() => setOpen(indexIn(s))}
                aria-label={`Enlarge: ${s.alt}`}
              >
                <img src={s.src} alt={s.alt} loading="lazy" decoding="async" />
                <span className="wk-shot-zoom" aria-hidden="true">
                  Enlarge
                </span>
              </button>
              <figcaption>{s.caption}</figcaption>
            </figure>
          )
        )}
      </div>

      {open !== null && (
        <Lightbox
          shots={viewable}
          index={open}
          onClose={() => setOpen(null)}
          onMove={(d) =>
            setOpen((v) => (v + d + viewable.length) % viewable.length)
          }
        />
      )}
    </>
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

      <Shots shots={shots} />

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

      mm.add("(prefers-reduced-motion: no-preference)", (ctx) => {
        const isMobile = window.matchMedia("(max-width: 767px)").matches;

        gsap.utils.toArray(".wk-card").forEach((card) => {
          /* The card arrives as one slab, then its contents land in order:
             kicker, title, the three moments, the rest. */
          const head = card.querySelector(".wk-head");
          const moments = card.querySelectorAll(".wk-moment");
          const rest = card.querySelectorAll(
            ".wk-system, .wk-diagram, .wk-note, .wk-shots, .wk-stack"
          );

          const tl = gsap.timeline({
            scrollTrigger: { trigger: card, start: "top 86%", once: true },
            defaults: { ease: "power3.out" },
          });

          tl.from(card, { yPercent: 6, opacity: 0, scale: 0.985, duration: 0.75 })
            .from(
              head.children,
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

          /* the screenshot strip drifts as the card crosses the viewport,
             so the cards read as moving rather than parked */
          const strip = card.querySelector(".wk-shots");
          if (strip && !isMobile) {
            gsap.fromTo(
              strip,
              { scrollLeft: 0 },
              {
                scrollLeft: () =>
                  Math.max(0, strip.scrollWidth - strip.clientWidth) * 0.55,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top 60%",
                  end: "bottom 40%",
                  scrub: 0.8,
                  invalidateOnRefresh: true,
                },
              }
            );
          }
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
