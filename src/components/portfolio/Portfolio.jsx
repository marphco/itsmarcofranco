import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Portfolio.css";
import basicLogo from "../../assets/basic.svg";
import costvistaLogo from "../../assets/costvista.svg";
import basic1 from "../../assets/basic1.png";
import basic2 from "../../assets/basic2.png";
import basic3 from "../../assets/basic3.png";
import basic4 from "../../assets/basic4.png";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

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
    copy: "Drafts tailored onboarding questions for new clients and gets better with feedback. Starts from a brief and product docs, proposes a structured set grouped by topic/priority, then updates a reward model from thumbs-up/down so the next batch is clearer, less redundant, and better scoped.",
    color: "#ff6a00",
    repo: "https://github.com/marphco/rl-question-generator",
    demo: null,
  },

  {
    id: 3,
    title: "CostVista",
    brand: costvistaLogo,
    brandAlt: "CostVista",
    brandAsTitle: false,
    copy: "Turns CMS payer files into readable comparisons. Search by CPT/HCPCS, filter by payer/plan, see medians & ranges, and export clean CSVs. No PHI.",
    color: "#ff3b30",
    repo: "https://github.com/marphco/costvista",
    demo: "https://www.costvista.com",
  },
  {
    id: 4,
    title: "Panorama — Virtual Art Gallery",
    copy: "Immersive 3D gallery to explore high-resolution artworks from major museums (The Met, the Uffizi, and more).",
    color: "#494949ff",
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

      function setupAutoLoop(card, selector) {
        const demo = card.querySelector(selector);
        const track = demo?.querySelector(".bd-track");
        if (!demo || !track) return () => {};

        if (!track.dataset.duped) {
          const originals = Array.from(track.children);
          originals.forEach((n) => track.appendChild(n.cloneNode(true)));
          track.dataset.duped = "1";
        }

        let anim, ro;
        let desiredPaused = !card.classList.contains("is-front"); // pausa se non-front all’avvio
        // _setPaused disponibile da subito
        demo._setPaused = (p) => {
          desiredPaused = !!p;
          if (anim) anim.paused(desiredPaused);
        };

        const setX = gsap.quickSetter(track, "x", "px");

        const build = () => {
          anim && anim.kill();
          gsap.set(track, { x: 0 });
          const dist = track.scrollWidth / 2;
          const speed = +(demo.dataset.speed || 80);
          const dur = Math.max(2, dist / speed);
          const driver = { t: 0 };
          anim = gsap.to(driver, {
            t: dist,
            duration: dur,
            ease: "none",
            repeat: -1,
            onUpdate() {
              setX(-(driver.t % dist));
            },
          });
          // applica subito lo stato desiderato (pausa/play)
          anim.paused(desiredPaused);
        };

        const imgsReady = Array.from(track.querySelectorAll("img")).map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise((r) =>
                img.addEventListener("load", r, { once: true })
              )
        );
        Promise.all(imgsReady).then(build);

        ro = new ResizeObserver(build);
        ro.observe(track);

        const onVis = () => anim && anim.paused(document.hidden);
        document.addEventListener("visibilitychange", onVis);

        return () => {
          document.removeEventListener("visibilitychange", onVis);
          ro && ro.disconnect();
          anim && anim.kill();
          demo._setPaused = null;
        };
      }

      // --- ANIMAZIONI CARDS (immutate salvo rimozione play/pause demo) ---
      const cardsEls = gsap.utils.toArray(".pf-card");
      const cards = cardsEls.filter((el) => el instanceof HTMLElement);

      const cleanups = [];
      cards.forEach((card) => {
        if (card.querySelector('[data-demo="basic"]')) {
          cleanups.push(setupAutoLoop(card, ".pf-demo--basic"));
        }
        if (card.querySelector('[data-demo="rl"]')) {
          cleanups.push(setupAutoLoop(card, ".pf-demo--rl"));
        }
        // NEW: costvista
        if (card.querySelector('[data-demo="cost"]')) {
          cleanups.push(setupAutoLoop(card, ".pf-demo--cost"));
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
          const H = () => stage.clientHeight; // 100svh “stabile”
          const ROTX = mq.conditions.reduce
            ? 0
            : mq.conditions.desktop
            ? ROT_X_DESK
            : ROT_X_MOB;
          const LAYER = mq.conditions.mobile ? 18 : LAYER_OFFSET;

          // init carte
          cards.forEach((card, i) => {
            gsap.set(card, {
              y: i * LAYER,
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

          // funzioni usate nella timeline (ti erano sparite)
          const stepIn  = () => H() * (mq.conditions.mobile ? 0.14 : LIFT_IN_VH);
 const stepOut = () => H() * (mq.conditions.mobile ? 0.78 : LIFT_OUT_VH); // leggermente meno aggressivo
          const SEG = 1;
          const t = (i) => i * SEG;

          // *** UNICA definizione, PRIMA dell'uso ***
          function setFront(idx) {
            cards.forEach((card, i) => {
              card.classList.toggle("is-front", i === idx);
              card.querySelector(".pf-demo")?._setPaused?.(i !== idx); // pausa le demo non-front
            });
          }
          setFront(0); // stato iniziale

          // timeline
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: stage,
              pin: stage,
              pinReparent: true,
              start: "top top",
              end: () => "+=" + (cards.length - 1) * H() * PIN_FACTOR,
              scrub: true,
              anticipatePin: mq.conditions.mobile ? 2 : 1,
              invalidateOnRefresh: true,
            },
          });

          cards.forEach((card, i) => {
            if (i > 0) {
              tl.to(
                card,
                {
                  y: (i - 1) * (LAYER * 0.35),
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
                  y: i * LAYER - stepIn(),
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
                  y: i * LAYER - (stepIn() + stepOut()),
                  opacity: 0.98,
                  duration: SEG * 0.55,
                },
                t(i) + SEG * 0.45
              );

              // 🔔 metà segmento: passa il "front" alla card successiva
            }
          });
let currentFront = 0;
tl.eventCallback("onUpdate", () => {
  // ogni segmento dura SEG (1): arrotondiamo il tempo alla card più vicina
  const newFront = Math.min(
    cards.length - 1,
    Math.max(0, Math.round(tl.time() / SEG))
  );
  if (newFront !== currentFront) {
    setFront(newFront);
    currentFront = newFront;
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
            {p.id === 2 && (
              <div
                className="pf-demo pf-demo--rl"
                data-demo="rl"
                data-speed="85"
              >
                <div className="bd-track">
                  {/* Panel 1 — Brief -> Topics */}
                  <div className="bd-panel rl-brief">
                    <div className="rl-card">
                      <h4>Brief</h4>
                      <p>
                        “B2B SaaS onboarding; need discovery & scope in 20m.”
                      </p>
                      <div className="rl-chips">
                        <span className="chip">Goal: discovery</span>
                        <span className="chip">Audience: admins</span>
                        <span className="chip">Scope: v1</span>
                      </div>
                      <button className="rl-cta">Generate</button>
                    </div>
                    <div className="rl-card">
                      <h4>Topics</h4>
                      <ul className="rl-topics">
                        <li>Context & constraints</li>
                        <li>Users & permissions</li>
                        <li>Success metrics</li>
                        <li>Risks & blockers</li>
                      </ul>
                    </div>
                  </div>

                  {/* Panel 2 — Draft + feedback */}
                  <div className="bd-panel rl-feedback">
                    <div className="rl-list">
                      <h4>Draft questions</h4>
                      <ul>
                        <li>
                          <span>What problem are we solving right now?</span>
                          <div className="thumbs">
                            <button className="up" aria-label="thumb up">
                              👍
                            </button>
                            <button aria-label="thumb down">👎</button>
                          </div>
                        </li>
                        <li>
                          <span>Who signs off & what’s the deadline?</span>
                          <div className="thumbs">
                            <button className="up" aria-label="thumb up">
                              👍
                            </button>
                            <button aria-label="thumb down">👎</button>
                          </div>
                        </li>
                        <li>
                          <span>Any PII/PHI or compliance limits?</span>
                          <div className="thumbs">
                            <button className="up" aria-label="thumb up">
                              👍
                            </button>
                            <button aria-label="thumb down">👎</button>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className="rl-toast">Feedback saved ✓</div>
                  </div>

                  {/* Panel 3 — Metrics */}
                  <div className="bd-panel rl-metrics">
                    <div className="rl-graph">
                      <svg
                        viewBox="0 0 120 64"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        <polyline
                          className="line"
                          points="0,58 15,56 30,52 45,49 60,44 75,36 90,28 105,20 120,14"
                        />
                        <line
                          x1="0"
                          y1="58"
                          x2="120"
                          y2="58"
                          className="axis"
                        />
                        <line x1="0" y1="6" x2="0" y2="58" className="axis" />
                      </svg>
                      <div className="legend">
                        <span className="dot"></span>Reward
                      </div>
                    </div>
                    <p className="rl-caption">
                      Reward ↑ · redundancy ↓ across batches.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {p.id === 3 && (
              <div
                className="pf-demo pf-demo--cost"
                data-demo="cost"
                data-speed="82"
              >
                <div className="bd-track">
                  {/* Panel 1 — Ingest */}
                  <div className="bd-panel cv-ingest">
                    <div className="cv-card">
                      <h4>Import payer files</h4>
                      <p className="sub">
                        .jsonl / .csv — CMS price transparency
                      </p>
                      <div className="dropzone">Drop files here</div>
                      <div className="cv-chips">
                        <span className="chip ok">Validated ✓</span>
                        <span className="chip">3 payers</span>
                        <span className="chip">12 plans</span>
                      </div>
                    </div>
                    <div className="cv-card">
                      <h4>Normalize</h4>
                      <ul className="bullets">
                        <li>Map fields (payer → unified schema)</li>
                        <li>De-duplicate procedures</li>
                        <li>Aggregate by provider</li>
                      </ul>
                    </div>
                  </div>

                  {/* Panel 2 — Search & filters */}
                  <div className="bd-panel cv-search">
                    <div className="cv-form">
                      <div className="field">
                        <label>Procedure</label>
                        <input defaultValue="CPT 29888 — Knee arthroscopy" />
                      </div>
                      <div className="row">
                        <div className="field">
                          <label>Payer</label>
                          <select defaultValue="Aetna">
                            <option>Aetna</option>
                            <option>BCBS</option>
                            <option>United</option>
                          </select>
                        </div>
                        <div className="field">
                          <label>Plan</label>
                          <select defaultValue="PPO Silver">
                            <option>PPO Silver</option>
                            <option>HMO Bronze</option>
                            <option>EPO Gold</option>
                          </select>
                        </div>
                        <div className="field">
                          <label>Type</label>
                          <select defaultValue="Negotiated">
                            <option>Negotiated</option>
                            <option>Cash</option>
                          </select>
                        </div>
                      </div>
                      <button className="cv-cta">Compare</button>
                    </div>

                    <div className="kpis">
                      <div className="kpi">
                        <span className="lab">Median</span>
                        <span className="val">$2,940</span>
                      </div>
                      <div className="kpi">
                        <span className="lab">P25–P75</span>
                        <span className="val">$2,210–$3,560</span>
                      </div>
                      <div className="kpi">
                        <span className="lab">Providers</span>
                        <span className="val">18</span>
                      </div>
                    </div>
                  </div>

                  {/* Panel 3 — Compare & export */}
                  <div className="bd-panel cv-compare">
                    <div className="cv-table">
                      <div className="thead">
                        <span>Provider</span>
                        <span>Negotiated</span>
                        <span>Cash</span>
                        <span>Range</span>
                      </div>
                      <div className="trow">
                        <span>Riverside Med Center</span>
                        <span>$2,880</span>
                        <span>$2,400</span>
                        <span className="spark">
                          <svg
                            viewBox="0 0 100 24"
                            preserveAspectRatio="none"
                            aria-hidden="true"
                          >
                            <polyline points="0,20 20,18 40,14 60,10 80,8 100,6" />
                          </svg>
                        </span>
                      </div>
                      <div className="trow">
                        <span>Northside Ortho</span>
                        <span>$3,120</span>
                        <span>$2,650</span>
                        <span className="spark">
                          <svg viewBox="0 0 100 24">
                            <polyline points="0,16 20,17 40,13 60,12 80,9 100,8" />
                          </svg>
                        </span>
                      </div>
                      <div className="trow">
                        <span>Mercy General</span>
                        <span>$2,740</span>
                        <span>$2,200</span>
                        <span className="spark">
                          <svg viewBox="0 0 100 24">
                            <polyline points="0,22 20,19 40,17 60,14 80,12 100,9" />
                          </svg>
                        </span>
                      </div>
                    </div>

                    <div className="cv-footer">
                      <button className="cv-ghost">Export CSV</button>
                      <span className="note">
                        No PHI · CMS public files only
                      </span>
                    </div>
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
