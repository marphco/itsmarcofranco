import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Portfolio.css";

gsap.registerPlugin(ScrollTrigger);

/* ---------- ICONS ---------- */
const RepoIcon = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58l-.02-2.03c-3.34.73-4.04-1.61-4.04-1.61-.54-1.39-1.33-1.76-1.33-1.76-1.09-.74.09-.73.09-.73 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.77-1.6-2.67-.3-5.48-1.34-5.48-5.95 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.16 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.64.24 2.86.12 3.16.77.84 1.23 1.91 1.23 3.22 0 4.62-2.82 5.65-5.5 5.95.43.37.82 1.1.82 2.23l-.01 3.3c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z"/>
  </svg>
);

const LiveIcon = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ---------- DATA ---------- */
const PROJECTS = [
  {
    id: 1,
    title: "BASIC.",
    copy:
      "Vite/React + GSAP. The contact flow becomes a pre-brief: the AI asks tailored questions and, at the end, outputs an action plan. Ratings in the dashboard drive a reinforcement loop to improve future questions.",
    color: "#3b2ecc",
    repo: "https://github.com/marphco/basic-adv",
    demo: "https://basicadv.com",
  },
  {
    id: 2,
    title: "RL Question Generator",
    copy:
      "LLM-based question generator for client onboarding. Improves over time with human feedback (RL). UI in Vite/React, API in Express.",
    color: "#ff6a00",
    repo: "https://github.com/marphco/rl-question-generator",
    demo: null,
  },
  {
    id: 3,
    title: "Costvista",
    copy:
      "Healthcare price-transparency viewer: turns payer files into readable comparisons with search by procedure, summary stats, and export. No PHI.",
    color: "#ff3b30",
    repo: "https://github.com/marphco/costvista",
    demo: "https://www.costvista.com",
  },
  {
    id: 4,
    title: "Panorama — Virtual Art Gallery",
    copy:
      "Immersive 3D gallery to explore high-resolution artworks from major museums (The Met, the Uffizi, and more).",
    color: "#111111",
    repo: "https://github.com/marphco/virtual-art-gallery",
    demo: "https://panorama-virtual.vercel.app/",
  },
];

export default function Portfolio() {
  const rootRef = useRef(null);
  const stageRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;

    const gctx = gsap.context(() => {
      const cardsEls = gsap.utils.toArray(".pf-card");
      const cards = cardsEls.filter(el => el instanceof HTMLElement);
      const linksByCard = cards.map(el => Array.from(el.querySelectorAll("a")));

      const LAYER_OFFSET = 26;
      const SCALE_STEP   = 0.02;
      const ROT_X_DESK   = 18;
      const ROT_X_MOB    = 12;
      const ROT_Z        = 3.5;
      const LIFT_IN_VH   = 0.12;
      const LIFT_OUT_VH  = 0.70;
      const PIN_FACTOR   = 0.95;

      const setInteractive = (idx) => {
        cards.forEach((el, i) => {
          const active = i === idx;
          el.classList.toggle("is-front", active);
          (linksByCard[i] || []).forEach(a => {
            a.tabIndex = active ? 0 : -1;
            a.setAttribute("aria-hidden", active ? "false" : "true");
          });
        });
      };

      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: "(min-width: 768px)",
          mobile: "(max-width: 767px)",
          reduce:  "(prefers-reduced-motion: reduce)",
        },
        (mq) => {
          const ROTX = mq.conditions.reduce ? 0 : (mq.conditions.desktop ? ROT_X_DESK : ROT_X_MOB);

          cards.forEach((card, i) => {
            gsap.set(card, {
              y: i * LAYER_OFFSET,
              scale: 1 - i * SCALE_STEP,
              zIndex: cards.length - i,
              rotateX: 0,
              rotateZ: 0,
              z: 0.01,
              transformOrigin: "50% 100%",
              force3D: true,
              backfaceVisibility: "hidden",
            });
          });
          setInteractive(0);

          const stepIn  = () => window.innerHeight * LIFT_IN_VH;
          const stepOut = () => window.innerHeight * LIFT_OUT_VH;

          const SEG = 1;
          const t = (i) => i * SEG;

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root,
              pin: stage,
              pinReparent: true,
              start: "top top",
              end: () => "+=" + (cards.length - 1) * window.innerHeight *  PIN_FACTOR,
              scrub: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate(self) {
                const totalSeg = cards.length - 1;
                const idx = Math.min(cards.length - 1, Math.round(self.progress * totalSeg));
                setInteractive(idx);
              }
            },
          });

          cards.forEach((card, i) => {
            if (i > 0) {
              tl.to(card, {
                y: (i - 1) * (LAYER_OFFSET * 0.35),
                scale: 1,
                rotateX: 0,
                rotateZ: 0,
                duration: SEG,
              }, t(i - 1));
            }
            if (i < cards.length - 1) {
              tl.to(card, {
                y: (i * LAYER_OFFSET) - stepIn(),
                rotateX: ROTX,
                rotateZ: i % 2 ? -ROT_Z : ROT_Z,
                boxShadow: "0 40px 120px rgba(0,0,0,.22)",
                duration: SEG * 0.45,
              }, t(i));
              tl.to(card, {
                y: (i * LAYER_OFFSET) - (stepIn() + stepOut()),
                opacity: 0.98,
                duration: SEG * 0.55,
              }, t(i) + SEG * 0.45);
            }
          });

          return () => tl.kill();
        }
      );

      return () => mm.revert();
    }, root);

    return () => gctx.revert();
  }, []);

  return (
    <section className="portfolio" ref={rootRef} aria-label="Portfolio">
      <div className="pf-stage" ref={stageRef}>
        {PROJECTS.map((p) => (
          <article className="pf-card" key={p.id} style={{ "--accent": p.color }}>
            <header className="pf-header">
              <h3 className="pf-title">{p.title}</h3>
            </header>

            <p className="pf-copy">{p.copy}</p>

            <div className="pf-actions">
              {p.repo && (
                <a
                  className="pf-btn pf-btn--repo"
                  href={p.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${p.title} repository`}
                >
                  <RepoIcon /><span>Repo</span>
                </a>
              )}
              {p.demo && (
                <a
                  className="pf-btn pf-btn--live"
                  href={p.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${p.title} live site`}
                >
                  <LiveIcon /><span>Live</span>
                </a>
              )}
            </div>

            <div className="pf-strip">
              <div className="pf-thumb" />
              <div className="pf-thumb" />
              <div className="pf-thumb" />
              <div className="pf-thumb" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
