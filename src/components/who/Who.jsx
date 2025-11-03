import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Who.css";

gsap.registerPlugin(ScrollTrigger);

export default function Who() {
  const wrapRef = useRef(null);
  const stickyRef = useRef(null);
  const trackRef = useRef(null);
  const whoRef = useRef(null);
  const heroRef = useRef(null); // ⬅️ nuovo: misuro l’altezza disponibile
  const afterRef = useRef(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    const who = whoRef.current;
    const hero = heroRef.current;
    const after = afterRef.current;
    if (!wrap || !track || !who || !hero || !after) return;

    const PALETTE = [
      "#010101", // WHO? (sempre nero finché non inizia il pannello 1)
      "#ff4e47", // coral red
      "#9B5DE5", // violet
      "#00C2FF", // cyan
      "#00D68F", // green
      "#FFD166", // warm yellow
    ];

    // quanto vuoi coprire quando la sezione è a 100vh
    const COVER = 0.95;
    // respiro iniziale (px) prima che inizi a stirarsi
    const BREATH = 24; // prova 24–40px a gusto

    const getMaxCapPx = () => {
      const w = window.innerWidth;
      if (w >= 1280) return 1200; // desktop grande
      if (w >= 1024) return 620; // desktop piccolo / laptop
      if (w >= 768) return 520; // tablet
      return 400; // mobile
    };

    // calcolo sia la scala massima sia la y finale per centrare il testo
    const computeMetrics = () => {
      gsap.set(who, { scaleY: 1, y: 0, transformOrigin: "50% 0%" });
      const whoH = who.getBoundingClientRect().height;

      const cs = getComputedStyle(hero);
      const padTop = parseFloat(cs.paddingTop) || 0;
      const padBot = parseFloat(cs.paddingBottom) || 0;
      const heroInnerH = hero.getBoundingClientRect().height - padTop - padBot;

      // NEW: applico il cap
      const capPx = getMaxCapPx(); // limite assoluto in px, per device
      const targetH = Math.min(heroInnerH * COVER, capPx); // altezza finale desiderata
      const sFinal = targetH / Math.max(1, whoH);

      const yFinal = (heroInnerH - whoH * sFinal) / 2;

      // torna alla “linea”
      gsap.set(who, { scaleY: 0.001, y: 24, transformOrigin: "50% 0%" });
      return { sFinal: Math.max(1, sFinal), yFinal };
    };

    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const setSizes = () => {
      after.style.height = distance() + "px";
    };

    gsap.set(who, { scaleY: 0.001, y: BREATH, transformOrigin: "50% 0%" });
    gsap.set(track, { x: 0 });

    let metrics = computeMetrics();

    // 1) Intro: scala WHO? e porta la y da BREATH → yFinal
    const stIntro = ScrollTrigger.create({
      trigger: wrap,
      start: "top 92%", // parte poco dopo che entra in viewport
      end: "top top",
      scrub: true,
      // markers: true,
      onUpdate: (self) => {
        const p = gsap.utils.clamp(0, 1, self.progress);
        const s = gsap.utils.interpolate(0.001, metrics.sFinal, p);
        const y = gsap.utils.interpolate(BREATH, metrics.yFinal, p);
        const snap = gsap.utils.snap(0.001); // ⬅️ riduce shimmering
        gsap.set(who, { scaleY: snap(s), y: Math.round(y) });
      },
    });

    // ✅ Attendi i font prima del primo layout/paint, poi ricalcola
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        metrics = computeMetrics();
        setSizes();
        // due rAF per assicurare la promozione del layer prima dell’aggancio ST
        requestAnimationFrame(() =>
          requestAnimationFrame(() => ScrollTrigger.refresh())
        );
      });
    }

    // 2) Orizzontale
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

    // ---- COLORI: transizione per coppie di pannelli ----

    // stato iniziale coerente
    gsap.set(wrap, { backgroundColor: PALETTE[0], color: "#fff" });

    // NB: manteniamo il testo sempre bianco in questa sezione
    // (se vuoi auto-contrasto, puoi riaggiungere la funzione idealTextOn)
    gsap.set(wrap, { color: "#fff" });

    const panels = Array.from(track.querySelectorAll(".panel"));

    // per ogni passaggio i -> i+1 creiamo una transizione
    for (let i = 0; i < Math.min(panels.length - 1, PALETTE.length - 1); i++) {
      const from = PALETTE[i];
      const to = PALETTE[i + 1];
      const nextPanel = panels[i + 1];

      gsap.fromTo(
        wrap,
        { backgroundColor: from },
        {
          backgroundColor: to,
          ease: "none",
          immediateRender: false, // evita che applichi 'to' subito
          scrollTrigger: {
            trigger: nextPanel,
            containerAnimation: tweenH, // ← agganciato all'orizzontale
            start: "left center", // quando il prossimo è a metà viewport
            end: "left left", // quando il prossimo è full-screen
            scrub: true,
          },
        }
      );
    }

    // resize/load → ricalcolo tutto (compresa yFinal)
    const ro = new ResizeObserver(() => {
      setSizes();
      metrics = computeMetrics(); // <- rilegge getMaxCapPx()
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

          <section className="panel">
            <div className="panel-copy">
              <h2 className="panel-hl">Half human, half algorithm.</h2>
              <p className="panel-sl">
                Spent a year at <span className="brand">xAI</span> teaching
                machines to behave. Kind of.
              </p>
            </div>
          </section>

          <section className="panel">
            <div className="panel-copy">
              <h2 className="panel-hl">Structured chaos.</h2>
              <p className="panel-sl">
                From prototype to production — web, APIs, and AI —
                stack-agnostic by design.
              </p>
            </div>
          </section>

          <section className="panel">
            <div className="panel-copy">
              <h2 className="panel-hl">Born in Italy, built in New York.</h2>
              <p className="panel-sl">
                I believe in good ideas, clean code, and better pasta.
              </p>
            </div>
          </section>
        </div>
      </div>

      <div className="who-after-spacer" ref={afterRef} />
    </section>
  );
}
