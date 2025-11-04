import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Portfolio.css";
import basicLogo from "../../assets/basic.svg";
import basic1 from "../../assets/basic1.png";
import basic2 from "../../assets/basic2.png";
import basic3 from "../../assets/basic3.png";
import basic4 from "../../assets/basic4.png";

gsap.registerPlugin(ScrollTrigger);

/* ---------- ICONS ---------- */
const RepoIcon = () => (
  <svg
    aria-hidden="true"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58l-.02-2.03c-3.34.73-4.04-1.61-4.04-1.61-.54-1.39-1.33-1.76-1.33-1.76-1.09-.74.09-.73.09-.73 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.77-1.6-2.67-.3-5.48-1.34-5.48-5.95 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.16 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.64.24 2.86.12 3.16.77.84 1.23 1.91 1.23 3.22 0 4.62-2.82 5.65-5.5 5.95.43.37.82 1.1.82 2.23l-.01 3.3c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
  </svg>
);

const LiveIcon = () => (
  <svg
    aria-hidden="true"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M7 17L17 7M9 7h8v8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ---------- DATA ---------- */
const PROJECTS = [
  {
    id: 1,
    title: "BASIC.",
    brand: basicLogo, // << nuovo
    brandAlt: "BASIC", // << nuovo (usato se il logo sostituisce il titolo)
    brandAsTitle: false, // << tienilo false: titolo + logo; metti true per “solo logo”
    copy: "A full website built end-to-end, motion-first and production-ready. Authentication and a lightweight dashboard support day-to-day ops. The contact flow is a tailored AI intake that adapts its questions to context, turns answers into a structured brief with next steps, and delivers everything straight to the dashboard.",
    color: "#3b2ecc",
    repo: "https://github.com/marphco/basic-adv",
    demo: "https://basicadv.com",
  },
  {
    id: 2,
    title: "RL Question Generator",
    copy: "LLM-based question generator for client onboarding. Improves over time with human feedback (RL). UI in Vite/React, API in Express.",
    color: "#ff6a00",
    repo: "https://github.com/marphco/rl-question-generator",
    demo: null,
  },
  {
    id: 3,
    title: "Costvista",
    copy: "Healthcare price-transparency viewer: turns payer files into readable comparisons with search by procedure, summary stats, and export. No PHI.",
    color: "#ff3b30",
    repo: "https://github.com/marphco/costvista",
    demo: "https://www.costvista.com",
  },
  {
    id: 4,
    title: "Panorama — Virtual Art Gallery",
    copy: "Immersive 3D gallery to explore high-resolution artworks from major museums (The Met, the Uffizi, and more).",
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
      // Intro: fade/slide mentre si entra nel pin
      const introEl = root.querySelector(".pf-intro");
      if (introEl) {
        const getEnd = () => introEl.offsetHeight * 0.9; // distanza = ~altezza intro
        gsap.fromTo(
          introEl,
          { y: 0, opacity: 1 },
          {
            y: -28,
            opacity: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: root, // l’intera sezione
              start: "top top",
              end: () => "+=" + getEnd(),
              scrub: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // --- LOOP CONTINUO: BASIC (FIX) ---
      function waitForAssets(scope) {
        const imgs = Array.from(scope.querySelectorAll("img"));
        if (!imgs.length) return Promise.resolve();
        return Promise.all(
          imgs.map((img) =>
            img.complete
              ? Promise.resolve()
              : new Promise((res) =>
                  img.addEventListener("load", res, { once: true })
                )
          )
        );
      }

      function setupBasicLoop(card) {
        const demo = card.querySelector(".pf-demo--basic");
        const track = demo?.querySelector(".bd-track");
        if (!demo || !track) return () => {};

        // Duplica una sola volta (A B C A' B' C')
        if (!track.dataset.duped) {
          const originals = Array.from(track.children);
          originals.forEach((n) => track.appendChild(n.cloneNode(true)));
          track.dataset.duped = "1";
        }

        let anim, ro;
        const setX = gsap.quickSetter(track, "x", "px");

        const build = () => {
          anim && anim.kill();
          gsap.set(track, { x: 0 });

          // Metà contenuto (perché abbiamo duplicato)
          const dist = track.scrollWidth / 2;
          const speed = +(demo.dataset.speed || 80); // px/s
          const dur = Math.max(2, dist / speed);

          // Driver numerico + modulo → zero drift, nessun “gradino”
          const driver = { t: 0 };
          anim = gsap.to(driver, {
            t: dist,
            duration: dur,
            ease: "none",
            repeat: -1,
            onUpdate() {
              setX(-(driver.t % dist)); // wrap continuo
            },
          });
        };

        // Aspetta che le immagini siano misurate davvero, poi costruisci
        waitForAssets(track).then(build);

        // Ricostruisci quando cambia la misura
        ro = new ResizeObserver(build);
        ro.observe(track);

        // Pausa in tab nascosta (gratis performance)
        const onVis = () => anim && anim.paused(document.hidden);
        document.addEventListener("visibilitychange", onVis);

        return () => {
          document.removeEventListener("visibilitychange", onVis);
          ro && ro.disconnect();
          anim && anim.kill();
        };
      }

      // --- ANIMAZIONI CARDS (immutate salvo rimozione play/pause demo) ---
      const cardsEls = gsap.utils.toArray(".pf-card");
      const cards = cardsEls.filter((el) => el instanceof HTMLElement);

      // avvia SEMPRE la micro-demo della prima card (BASIC), senza pause su scroll
      const cleanups = [];
      cards.forEach((card, i) => {
        if (card.querySelector('[data-demo="basic"]')) {
          cleanups.push(setupBasicLoop(card));
        }
      });

      // ... (matchMedia + timeline delle card resta uguale, ma TOGLI la parte che faceva play/pause)
      const LAYER_OFFSET = 26,
        SCALE_STEP = 0.02,
        ROT_X_DESK = 18,
        ROT_X_MOB = 12,
        ROT_Z = 3.5,
        LIFT_IN_VH = 0.12,
        LIFT_OUT_VH = 0.7,
        PIN_FACTOR = 0.95;

      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: "(min-width: 768px)",
          mobile: "(max-width: 767px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (mq) => {
          const ROTX = mq.conditions.reduce
            ? 0
            : mq.conditions.desktop
            ? ROT_X_DESK
            : ROT_X_MOB;

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

          const stepIn = () => window.innerHeight * LIFT_IN_VH;
          const stepOut = () => window.innerHeight * LIFT_OUT_VH;
          const SEG = 1,
            t = (i) => i * SEG;

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: stage, // <— prima era root
              pin: stage,
              pinReparent: true,
              start: "top top", // pin quando LO STAGE tocca il top
              end: () =>
                "+=" + (cards.length - 1) * window.innerHeight * PIN_FACTOR,
              scrub: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          cards.forEach((card, i) => {
            if (i > 0) {
              tl.to(
                card,
                {
                  y: (i - 1) * (LAYER_OFFSET * 0.35),
                  scale: 1,
                  rotateX: 0,
                  rotateZ: 0,
                  duration: SEG,
                },
                t(i - 1)
              );
            }
            if (i < cards.length - 1) {
              tl.to(
                card,
                {
                  y: i * LAYER_OFFSET - stepIn(),
                  rotateX: ROTX,
                  rotateZ: i % 2 ? -ROT_Z : ROT_Z,
                  boxShadow: "0 40px 120px rgba(0,0,0,.22)",
                  duration: SEG * 0.45,
                },
                t(i)
              );
              tl.to(
                card,
                {
                  y: i * LAYER_OFFSET - (stepIn() + stepOut()),
                  opacity: 0.98,
                  duration: SEG * 0.55,
                },
                t(i) + SEG * 0.45
              );
            }
          });

          return () => tl.kill();
        }
      );

      return () => {
        mm.revert();
        cleanups.forEach((fn) => fn());
      };
    }, root);

    return () => gctx.revert();
  }, []);

  return (
    <section className="portfolio" ref={rootRef} aria-label="Portfolio">
      {/* Intro nel normale flusso, con margini gestiti via CSS */}
      <div className="pf-intro-wrap">
        <div className="pf-intro">
          <h2 className="pf-ih">Selected builds.</h2>
          <p className="pf-id">
            A small slice of shipped work—production-first, privacy-safe,
            continuously evolving.
          </p>
        </div>
      </div>

      <div className="pf-stage" ref={stageRef}>
        {PROJECTS.map((p) => (
          <article
            className="pf-card"
            key={p.id}
            style={{ "--accent": p.color }}
          >
            <header className="pf-header">
              <h3 className={`pf-title ${p.brandAsTitle ? "sr-only" : ""}`}>
                {p.title}
              </h3>
              {p.brand && (
                <img
                  className={`pf-brand ${
                    p.brandAsTitle ? "pf-brand--solo" : ""
                  }`}
                  src={p.brand}
                  alt={p.brandAsTitle ? p.brandAlt || p.title : ""}
                  aria-hidden={p.brandAsTitle ? "false" : "true"}
                  loading="lazy"
                  decoding="async"
                />
              )}
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
                  <RepoIcon />
                  <span>Repo</span>
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
                  <LiveIcon />
                  <span>Live</span>
                </a>
              )}
            </div>
            {p.id === 1 && (
              <div
                className="pf-demo pf-demo--basic"
                data-demo="basic"
                data-speed="90"
              >
                <div className="bd-track">
                  <div className="bd-panel">
                    <img
                      src={basic1}
                      alt="Hero orizzontale"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="bd-panel">
                    <img
                      src={basic2}
                      alt="Sezione con motion"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="bd-panel">
                    <img
                      src={basic3}
                      alt="Dashboard con brief"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="bd-panel">
                    <img
                      src={basic4}
                      alt="Dashboard con brief"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
