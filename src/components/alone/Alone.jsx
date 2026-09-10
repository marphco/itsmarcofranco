import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Alone.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * Full-width strip that closes the Work section.
 * Same visual weight as the "WHO?" panels: one huge line, then the point.
 */
export default function Alone() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const gctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(root.querySelectorAll(".al-reveal"), {
          y: 34,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.12,
          scrollTrigger: { trigger: root, start: "top 78%", once: true },
        });
      });

      return () => mm.revert();
    }, root);

    return () => gctx.revert();
  }, []);

  return (
    <section className="alone" ref={rootRef} aria-labelledby="alone-heading">
      <div className="al-inner">
        <h2 className="al-title al-reveal" id="alone-heading">
          All of this, one person.
        </h2>

        <div className="al-body">
          <p className="al-p al-reveal">
            Everything on this page was built by one person. No engineering
            team, no designers on staff, no budget for either. I found the
            problem, designed the solution, and built it with whatever was
            available, lately including AI. The point is not that I can code.
            The point is what I do when there is a problem and no one to hand it
            to.
          </p>
          <p className="al-kicker al-reveal">
            Give me a team, and the ceiling moves.
          </p>
        </div>
      </div>
    </section>
  );
}
