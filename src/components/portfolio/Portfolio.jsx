import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Portfolio.css";

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  { id: 1, tag: "01", title: "Branding that drives conversion & funding.",
    copy: "We clarify positioning, define a tone of voice, and ship robust brand systems with pragmatic guidelines.",
    color: "#3b2ecc" },
  { id: 2, tag: "02", title: "Product experiences users adopt & keep using.",
    copy: "From goals to critical journeys and reusable UI libraries to move fast with dev-ready assets.",
    color: "#ff6a00" },
  { id: 3, tag: "03", title: "Websites that scale with teams & business.",
    copy: "Story-first architecture, clear sections, and a scalable base you can evolve without firefighting.",
    color: "#ff3b30" },
  { id: 4, tag: "04", title: "Campaigns that spark attention.",
    copy: "From concept to production with tight feedback loops and measurable lift.",
    color: "#111111" },
];

export default function Portfolio() {
  const rootRef = useRef(null);
  const stageRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;

    const gctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".pf-card");

      // Parametri
      const LAYER_OFFSET = 26;
      const SCALE_STEP   = 0.02;
      const ROT_X_DESK   = 18;
      const ROT_X_MOB    = 12;
      const ROT_Z        = 3.5;
      const LIFT_IN_VH   = 0.12;
      const LIFT_OUT_VH  = 0.70;
      const PIN_FACTOR   = 0.95;

      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: "(min-width: 768px)",
          mobile: "(max-width: 767px)",
          reduce:  "(prefers-reduced-motion: reduce)",
        },
        (mq) => {
          const ROTX = mq.conditions.reduce
            ? 0
            : (mq.conditions.desktop ? ROT_X_DESK : ROT_X_MOB);

          // Stato iniziale: pila compatta (z-index fisso)
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

          const stepIn  = () => window.innerHeight * LIFT_IN_VH;
          const stepOut = () => window.innerHeight * LIFT_OUT_VH;

          // Master timeline pin-nata
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root,
              pin: stage,
              pinReparent: true,
              start: "top top",
              end: () =>
                "+=" + (cards.length - 1) * window.innerHeight * PIN_FACTOR,
              scrub: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          // Durata unitaria per segmento
          const SEG = 1;
          const t = (i) => i * SEG;

          cards.forEach((card, i) => {
            // Promozione nel segmento precedente
            if (i > 0) {
              tl.to(card, {
                y: (i - 1) * (LAYER_OFFSET * 0.35),
                scale: 1,
                rotateX: 0,
                rotateZ: 0,
                duration: SEG,
              }, t(i - 1));
            }
            // Uscita nel suo segmento
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
              <span className="pf-index">{p.tag}</span>
            </header>
            <p className="pf-copy">{p.copy}</p>
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
