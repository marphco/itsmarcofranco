import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import "./Footer.css";

/* ---------- Utils ---------- */
function useNYTime() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const fmt = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "America/New_York",
      }),
    []
  );
  return fmt.format(now);
}

/* ---------- Eyes (footer-mounted, global-tracking) ---------- */
function Eyes() {
  const rootRef = useRef(null);
  const L = useRef(null);
  const R = useRef(null);
  const [msg, setMsg] = useState("I'm watching you.");

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !L.current || !R.current) return;

    const fine = matchMedia("(pointer: fine)").matches;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const max = 8; // corsa pupilla (px) — piccolini
    const setLx = gsap.quickSetter(L.current, "x", "px");
    const setLy = gsap.quickSetter(L.current, "y", "px");
    const setRx = gsap.quickSetter(R.current, "x", "px");
    const setRy = gsap.quickSetter(R.current, "y", "px");

    const centerOf = (el) => {
      const b = el.getBoundingClientRect();
      return { x: b.left + b.width / 2, y: b.top + b.height / 2 };
    };

    const moveTo = (cx, cy, setX, setY, tx, ty) => {
      const dx = tx - cx,
        dy = ty - cy;
      const ang = Math.atan2(dy, dx);
      const dist = Math.min(max, Math.hypot(dx, dy) * 0.15);
      setX(Math.cos(ang) * dist);
      setY(Math.sin(ang) * dist);
      return Math.cos(ang) * dist;
    };

    let rafId = 0,
      lastEvt = null,
      idleTl;

    const tick = () => {
      if (!lastEvt) return;
      const cL = centerOf(L.current.parentElement);
      const cR = centerOf(R.current.parentElement);
      const lx = moveTo(
        cL.x,
        cL.y,
        setLx,
        setLy,
        lastEvt.clientX,
        lastEvt.clientY
      );
      const rx = moveTo(
        cR.x,
        cR.y,
        setRx,
        setRy,
        lastEvt.clientX,
        lastEvt.clientY
      );
      const cross = lx > max * 0.6 && rx < -max * 0.6;
      setMsg(cross ? "You're making me cross-eyed." : "I'm watching you.");
      rafId = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      lastEvt = e;
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    const onLeave = () => {
      setMsg("Where did you go?");
      gsap.to([L.current, R.current], {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });
      cancelAnimationFrame(rafId);
      rafId = 0;
      lastEvt = null;
    };

    if (fine) {
      // ➜ LISTENER GLOBALI: seguono il mouse ovunque nel sito
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave);
    } else {
      // Mobile: vagano + tap per guardare il dito per 1s
      idleTl = gsap
        .timeline({
          repeat: -1,
          yoyo: true,
          defaults: { ease: "sine.inOut", duration: 1.6 },
        })
        .to([L.current, R.current], {
          x: gsap.utils.random(-max, max),
          y: gsap.utils.random(-max, max),
        })
        .to([L.current, R.current], {
          x: gsap.utils.random(-max, max),
          y: gsap.utils.random(-max, max),
        });
      const onTap = (e) => {
        idleTl.pause();
        lastEvt = e;
        tick();
        setTimeout(() => idleTl.resume(), 1000);
      };
      window.addEventListener("pointerdown", onTap);
      return () => window.removeEventListener("pointerdown", onTap);
    }

    // Blink casuale
    let t;
    if (!reduced) {
      const blink = () => {
        root.classList.add("blink");
        setTimeout(() => root.classList.remove("blink"), 110);
        t = setTimeout(blink, gsap.utils.random(2400, 5200));
      };
      t = setTimeout(blink, 1600);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      t && clearTimeout(t);
      idleTl && idleTl.kill();
    };
  }, []);

  return (
    <div className="eyes-wrap" ref={rootRef} aria-live="polite">
      <div className="eyes">
        <div className="eye">
          <div className="pupil" ref={L} />
        </div>
        <div className="eye">
          <div className="pupil" ref={R} />
        </div>
      </div>
      <p className="eyes-caption">{msg}</p>
    </div>
  );
}

/* ---------- Footer ---------- */
export default function Footer() {
  const nyTime = useNYTime();
  const year = new Date().getFullYear();

  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return;

    const CLICK_VH = 30; // quando >= 30vh rivelati, i link diventano cliccabili

    const update = () => {
      const doc = document.documentElement;
      const vh = window.innerHeight;

      // quanto manca al fondo
      const remaining = doc.scrollHeight - (window.scrollY + vh);

      // quanta parte del footer rivelare (0 → 100vh)
      const revealVH = Math.max(0, Math.min(100, 100 - (remaining / vh) * 100));

      footer.style.setProperty("--reveal", `${revealVH}vh`);
      footer.classList.toggle("is-active", revealVH >= CLICK_VH);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <footer className="site-footer" id="site-footer">
      <div className="footer-inner container">
        <div className="cta-left">
          <h2 className="cta-title">
            Let’s make your next thing{" "}
            <span className="underline">unskippable</span>.
          </h2>
          <p className="meta">Based in New York — Working worldwide</p>
        </div>

        <div className="cta-right">
          <a
            className="email-cta"
            href="mailto:hello@itsmarcofranco.com?subject=Let%27s%20build%20something%20great"
          >
            <span className="arrow">→</span> Pitch your idea
          </a>
          <div className="time">
            <span className="lab">Local time</span>
            <span className="val">{nyTime}</span>
          </div>
        </div>

        <div className="divider" aria-hidden="true" />

        <nav className="links">
          <a
            href="https://www.linkedin.com/in/marco-franco/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          <a href="https://github.com/marphco" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>

        <div className="legal">
          <span>© {year} Marco Franco</span>
          <span>·</span>
          <span>No cookies. No trackers.</span>
        </div>
        <Eyes />
      </div>
    </footer>
  );
}
