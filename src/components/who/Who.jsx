import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Who.css";
import xai from "../../assets/xai.svg";
import robot from "../../assets/robot.png";
import pasta from "../../assets/pasta.png";
import pizza from "../../assets/pizza.png";
import openai from "../../assets/openai.svg";
import react from "../../assets/react.png";
import vite from "../../assets/vite.png";
import liberty from "../../assets/liberty.svg";

gsap.registerPlugin(ScrollTrigger);

export default function Who() {
  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const whoRef = useRef(null);
  const heroRef = useRef(null);
  const afterRef = useRef(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    const who = whoRef.current;
    const hero = heroRef.current;
    const after = afterRef.current;
    if (!wrap || !track || !who || !hero || !after) return;

    const PALETTE = [
      "#010101",
      "#ff4e47",
      "#9B5DE5",
      "#00C2FF",
      "#00D68F",
      "#FFD166",
    ];
    const COVER = 0.95;
    const BREATH = 24;

    const getMaxCapPx = () => {
      const w = window.innerWidth;
      if (w >= 1280) return 1200;
      if (w >= 1024) return 720;
      if (w >= 768) return 560;
      return 420;
    };

    const computeMetrics = () => {
      gsap.set(who, { scaleY: 1, y: 0, transformOrigin: "50% 0%" });
      const whoH = who.getBoundingClientRect().height;

      const cs = getComputedStyle(hero);
      const padTop = parseFloat(cs.paddingTop) || 0;
      const padBot = parseFloat(cs.paddingBottom) || 0;
      const heroInnerH = hero.getBoundingClientRect().height - padTop - padBot;

      const capPx = getMaxCapPx();
      const targetH = Math.min(heroInnerH * COVER, capPx);
      const sFinal = targetH / Math.max(1, whoH);
      const yFinal = (heroInnerH - whoH * sFinal) / 2;

      gsap.set(who, { scaleY: 0.001, y: BREATH, transformOrigin: "50% 0%" });
      return { sFinal: Math.max(1, sFinal), yFinal };
    };

    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const setSizes = () => {
      after.style.height = distance() + "px";
    };

    gsap.set(who, { scaleY: 0.001, y: BREATH, transformOrigin: "50% 0%" });
    gsap.set(track, { x: 0 });

    let metrics = computeMetrics();

    // WHO? intro
    const stIntro = ScrollTrigger.create({
      trigger: wrap,
      start: "top 92%",
      end: "top top",
      scrub: true,
      onUpdate: (self) => {
        const p = gsap.utils.clamp(0, 1, self.progress);
        const s = gsap.utils.interpolate(0.001, metrics.sFinal, p);
        const y = gsap.utils.interpolate(BREATH, metrics.yFinal, p);
        const snap = gsap.utils.snap(0.001);
        gsap.set(who, { scaleY: snap(s), y: Math.round(y) });
      },
    });

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        metrics = computeMetrics();
        setSizes();
        requestAnimationFrame(() =>
          requestAnimationFrame(() => ScrollTrigger.refresh())
        );
      });
    }

    // alleggerisce durante lo scroll: toglie il filtro solo mentre è attivo
    ScrollTrigger.create({
      trigger: wrap,
      start: "top top",
      end: () => "+=" + distance(),
      onToggle: (self) => wrap.classList.toggle("is-scrolling", self.isActive),
    });

    // Orizzontale
    const tweenH = gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: wrap,
        start: "top top",
        end: () => "+=" + distance(),
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    // Colori
    gsap.set(wrap, { backgroundColor: PALETTE[0], color: "#fff" });
    const panels = Array.from(track.querySelectorAll(".panel"));

    for (let i = 0; i < Math.min(panels.length - 1, PALETTE.length - 1); i++) {
      const from = PALETTE[i],
        to = PALETTE[i + 1],
        nextPanel = panels[i + 1];
      gsap.fromTo(
        wrap,
        { backgroundColor: from },
        {
          backgroundColor: to,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: nextPanel,
            containerAnimation: tweenH,
            start: "left center",
            end: "left left",
            scrub: true,
          },
        }
      );
    }

    // ====== STICKER ANIMATIONS ======
    // NB: niente transform in CSS sugli sticker (evitiamo conflitti)
    // gsap.set(".p2 .s2", { xPercent: -50 });

    const mm = gsap.matchMedia();

    // Intensità diversa mobile/desktop
    mm.add(
      {
        isMobile: "(max-width: 768px)",
        isDesktop: "(min-width: 769px)",
      },
      (ctx) => {
        const { isMobile } = ctx.conditions;
        // fattori di amplificazione: un po’ meno su mobile
        const AMP = isMobile ? 1.4 : 2.0;

        const common = {
          ease: "none",
          force3D: true,
          // NB: containerAnimation = tweenH mantiene lo scrolling orizzontale
        };

        // -------- P1: dx -> sx (più ampiezza + rotazione/scale leggeri)
        gsap.fromTo(
          ".p1 .s1",
          { xPercent: 40 * AMP, rotation: -6, scale: 0.98 },
          {
            xPercent: -40 * AMP,
            rotation: 6,
            scale: 1.02,
            ...common,
            scrollTrigger: {
              trigger: ".p1",
              containerAnimation: tweenH,
              start: "left center",
              end: "right center",
              scrub: true,
            },
          }
        );
        gsap.fromTo(
          ".p1 .s2",
          { xPercent: 60 * AMP, rotation: -8, scale: 0.96 },
          {
            xPercent: -20 * AMP,
            rotation: 8,
            scale: 1.04,
            ...common,
            scrollTrigger: {
              trigger: ".p1",
              containerAnimation: tweenH,
              start: "left center",
              end: "right center",
              scrub: true,
            },
          }
        );

        // P2: già in movimento prima di entrare
        const P2_START = "left 120%";
        const P2_END = "right -8%";

        // Assicura rotazioni fluide
        gsap.set([".p2 .s1", ".p2 .s2", ".p2 .s3"], {
          transformOrigin: "50% 50%",
        });

        /* REACT (s1): scende + sway orizzontale + più rotazione/scale */
        gsap.fromTo(
          ".p2 .s1",
          { yPercent: -12 * AMP, xPercent: -14, rotation: -16, scale: 0.93 },
          {
            yPercent: 56 * AMP,
            xPercent: 16,
            rotation: 18,
            scale: 1.12,
            ...common,
            scrollTrigger: {
              trigger: ".p2",
              containerAnimation: tweenH,
              start: P2_START,
              end: P2_END,
              scrub: true,
            },
          }
        );

        /* VITE (s2): SALE, ruota e va a DESTRA per non coprire il testo */
        gsap.fromTo(
          ".p2 .s2",
          { yPercent: 42 * AMP, xPercent: -10, rotation: -18, scale: 0.96 },
          {
            yPercent: -24 * AMP,
            xPercent: 28,
            rotation: 32,
            scale: 1.08,
            ...common,
            scrollTrigger: {
              trigger: ".p2",
              containerAnimation: tweenH,
              start: P2_START,
              end: P2_END,
              scrub: true,
            },
          }
        );

        /* OPENAI (s3): più in basso di base, scende e si sposta a SINISTRA */
        gsap.fromTo(
          ".p2 .s3",
          { yPercent: 4 * AMP, xPercent: 16, rotation: -12, scale: 0.97 },
          {
            yPercent: 46 * AMP,
            xPercent: -22,
            rotation: 14,
            scale: 1.07,
            ...common,
            scrollTrigger: {
              trigger: ".p2",
              containerAnimation: tweenH,
              start: P2_START,
              end: P2_END,
              scrub: true,
            },
          }
        );

        // ----- P3
        const P3_H_START = "left 92%";
        const P3_H_END = "right 8%";

        // Render pulito delle rotazioni
        gsap.set([".p3 .s1", ".p3 .s2", ".p3 .s3"], {
          transformOrigin: "50% 50%",
        });

        /* Pizza: come prima */
        gsap.fromTo(
          ".p3 .s1",
          { rotation: 0, xPercent: 0 },
          {
            rotation: 360,
            xPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: ".p3",
              containerAnimation: tweenH,
              start: P3_H_START,
              end: P3_H_END,
              scrub: true,
            },
          }
        );

        /* PASTA — molto più movimento verso SINISTRA in traiettoria a “C” */
        const tlPastaH = gsap.timeline({
          scrollTrigger: {
            trigger: ".p3",
            containerAnimation: tweenH,
            start: P3_H_START,
            end: P3_H_END,
            scrub: true,
          },
          defaults: { ease: "none" },
        });
        // primo arco (accenna a sinistra e un filo in giù)
        tlPastaH.to(
          ".p3 .s2",
          {
            xPercent: -32 * AMP,
            yPercent: 6 * AMP,
            rotation: 6,
            force3D: true,
          },
          0
        );
        // completa l’arco (ancora più a sinistra, un po’ più in basso)
        tlPastaH.to(
          ".p3 .s2",
          {
            xPercent: -84 * AMP,
            yPercent: 18 * AMP,
            rotation: 12,
            force3D: true,
          },
          0.45
        );

        /* STATUA — sale e va a DESTRA con leggera rotazione oraria */
        gsap.fromTo(
          ".p3 .s3",
          { yPercent: 6 * AMP, xPercent: 0, rotation: -2 },
          {
            yPercent: -28 * AMP, // più in alto
            xPercent: 34, // più a destra
            rotation: 14, // leggera rotazione oraria
            ease: "none",
            force3D: true,
            scrollTrigger: {
              trigger: ".p3",
              containerAnimation: tweenH,
              start: P3_H_START,
              end: P3_H_END,
              scrub: true,
            },
          }
        );
      }
    );

    // === FASE 2: continuano in VERTICALE dopo l'orizzontale ===
// start numerico = fine dello scorrimento orizzontale
const vertStart = () => tweenH.scrollTrigger?.end || 0;
const vertEnd   = () => vertStart() + window.innerHeight * 1.5; // ~finché escono

// Pizza: continua a ruotare e scivola appena a destra
gsap.to(".p3 .s1", {
  rotation: "+=160",
  xPercent: "+=10",
  ease: "none",
  immediateRender: false,
  scrollTrigger: {
    id: "p3-vertical-pizza",
    start: vertStart,
    end: vertEnd,
    scrub: true,
    invalidateOnRefresh: true
  }
});

// Pasta: continua verso SINISTRA e leggermente in giù (resta sopra al testo)
gsap.to(".p3 .s2", {
  xPercent: () => "-=" + 28 * (ctx.conditions?.isMobile ? 1.2 : 1.0), // ancora più a sinistra
  yPercent: () => "+=" + 10 * (ctx.conditions?.isMobile ? 1.2 : 1.0),
  rotation: "+=8",
  ease: "none",
  immediateRender: false,
  scrollTrigger: {
    id: "p3-vertical-pasta",
    start: vertStart,
    end: vertEnd,
    scrub: true,
    invalidateOnRefresh: true
  }
});

// Statua: sale e va a DESTRA ruotando in orario
gsap.to(".p3 .s3", {
  xPercent: "+=30",
  yPercent: "-=24",
  rotation: "+=18",
  ease: "none",
  immediateRender: false,
  scrollTrigger: {
    id: "p3-vertical-liberty",
    start: vertStart,
    end: vertEnd,
    scrub: true,
    invalidateOnRefresh: true
  }
});


    // Forza un refresh quando TUTTE le immagini (stickers) hanno caricato
    const imgs = Array.from(track.querySelectorAll("img.sticker"));
    let loaded = 0;
    imgs.forEach((img) => {
      if (img.complete) {
        loaded++;
        if (loaded === imgs.length) ScrollTrigger.refresh();
      } else
        img.addEventListener(
          "load",
          () => {
            loaded++;
            if (loaded === imgs.length) ScrollTrigger.refresh();
          },
          { once: true }
        );
    });

    // Resize/listeners
    const ro = new ResizeObserver(() => {
      setSizes();
      metrics = computeMetrics();
      ScrollTrigger.refresh();
    });
    ro.observe(track);
    ro.observe(hero);

    window.addEventListener("load", () => {
      setSizes();
      metrics = computeMetrics();
      ScrollTrigger.refresh();
    });

    setSizes();
    ScrollTrigger.refresh();

    return () => {
      stIntro.kill();
      tweenH.scrollTrigger?.kill();
      ro.disconnect();
    };
  }, []);

  return (
    <section className="who-wrap" ref={wrapRef}>
      <div className="who-sticky">
        <div className="who-track" ref={trackRef}>
          {/* HERO — WHO? centrato */}
          <section className="panel hero" ref={heroRef}>
            <svg
              className="who-svg"
              viewBox="0 0 1000 300"
              preserveAspectRatio="xMidYMin meet"
              ref={whoRef}
            >
              <text
                x="50%"
                y="0"
                textAnchor="middle"
                dominantBaseline="text-before-edge"
                fontFamily="'Zalando Sans Expanded', sans-serif"
                fontWeight="900"
                fontSize="250"
                fill="currentColor"
              >
                WHO?
              </text>
            </svg>
          </section>

          {/* P1 — xAI + robot head */}
          <section className="panel p1">
            <div className="panel-copy">
              <h2 className="panel-hl">Half human, half algorithm.</h2>
              <p className="panel-sl">
                Spent a year at <span className="brand">xAI</span> teaching
                machines to behave. Kind of.
              </p>
            </div>
            <div className="stickers">
              <img
                className="sticker s1"
                alt="xAI logo"
                src={xai}
                loading="lazy"
                decoding="async"
              />
              <img
                className="sticker s2"
                alt="robot head"
                src={robot}
                loading="lazy"
                decoding="async"
              />
            </div>
          </section>

          {/* P2 — loghi stack */}
          <section className="panel p2">
            <div className="panel-copy">
              <h2 className="panel-hl">Structured chaos.</h2>
              <p className="panel-sl">
                From prototype to production — web, APIs, and AI —
                stack-agnostic by design.
              </p>
            </div>
            <div className="stickers">
              <img
                className="sticker s1"
                alt="React"
                src={react}
                loading="lazy"
                decoding="async"
              />
              <img
                className="sticker s2"
                alt="Vite"
                src={vite}
                loading="lazy"
                decoding="async"
              />
              <img
                className="sticker s3"
                alt="OpenAI"
                src={openai}
                loading="lazy"
                decoding="async"
              />
            </div>
          </section>

          {/* P3 — Napoli + NYC */}
          <section className="panel p3">
            <div className="panel-copy">
              <h2 className="panel-hl">Born in Italy, built in New York.</h2>
              <p className="panel-sl">
                I believe in good ideas, clean code, and better pasta.
              </p>
            </div>
            <div className="stickers">
              <img
                className="sticker s1"
                alt="Pizza"
                src={pizza}
                loading="lazy"
                decoding="async"
              />
              <img
                className="sticker s2"
                alt="Pasta"
                src={pasta}
                loading="lazy"
                decoding="async"
              />
              <img
                className="sticker s3"
                alt="Statue of Liberty"
                src={liberty}
                loading="lazy"
                decoding="async"
              />
            </div>
          </section>
        </div>
      </div>

      <div className="who-after-spacer" ref={afterRef} />
    </section>
  );
}
