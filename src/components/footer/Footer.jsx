import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom"; // ✅ IMPORT
import gsap from "gsap";
import "./Footer.css";
import { GA_ID, updateAnalyticsConsent } from "../../lib/ga.js";

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

    let max = 8;
    const setLx = gsap.quickSetter(L.current, "x", "px");
    const setLy = gsap.quickSetter(L.current, "y", "px");
    const setRx = gsap.quickSetter(R.current, "x", "px");
    const setRy = gsap.quickSetter(R.current, "y", "px");

    const eyeBox = L.current.parentElement.getBoundingClientRect();
    max = Math.floor(Math.min(eyeBox.width, eyeBox.height) * 0.35);

    const centerOf = (el) => {
      const b = el.getBoundingClientRect();
      return { x: b.left + b.width / 2, y: b.top + b.height / 2 };
    };

    const moveTo = (cx, cy, setX, setY, tx, ty) => {
      const dx = tx - cx,
        dy = ty - cy;
      const ang = Math.atan2(dy, dx);
      const dist = Math.min(max, Math.hypot(dx, dy) * 0.15);
      const x = Math.cos(ang) * dist;
      const y = Math.sin(ang) * dist;
      setX(x);
      setY(y);
      return { x, y };
    };

    // Messaggistica prudente
    const setMsgSafe = (next) =>
      setMsg((prev) => (prev === next ? prev : next));

    let rafId = 0;
    let lastEvt = null;

    // Locks per evitare sovrapposizioni tra blink e "mood"
    let busy = false; // true = niente altre animazioni oculari
    let blinkTO = null;
    let moodTO = null;
    let onTap = null;
    let idleTl = null;

    const tick = () => {
      const lEl = L.current?.parentElement;
      const rEl = R.current?.parentElement;
      if (!lEl || !rEl) return;

      if (lastEvt) {
        const cL = centerOf(lEl);
        const cR = centerOf(rEl);

        const { x: lx } = moveTo(
          cL.x,
          cL.y,
          setLx,
          setLy,
          lastEvt.clientX,
          lastEvt.clientY
        );
        const { x: rx } = moveTo(
          cR.x,
          cR.y,
          setRx,
          setRy,
          lastEvt.clientX,
          lastEvt.clientY
        );

        // Solo messaggio quando davvero "strabici"
        const opposing = Math.sign(lx) !== Math.sign(rx);
        const between = lastEvt.clientX > cL.x && lastEvt.clientX < cR.x;
        const someDeflection = Math.abs(lx) + Math.abs(rx) > max * 0.4;

        if (fine) {
          // Desktop: SOLO quando davvero strabici
          setMsgSafe(
            opposing && between && someDeflection
              ? "You're making me cross-eyed."
              : "I'm watching you."
          );
        } else {
          // Mobile: left/right + cross-eyed
          const eyeGap = Math.max(24, (cR.x - cL.x) * 0.25); // soglia adattiva
          let next = "I'm watching you.";
          if (opposing && between && someDeflection) {
            next = "You're making me cross-eyed.";
          } else if (lastEvt.clientX < cL.x - eyeGap) {
            next = "Looking left…";
          } else if (lastEvt.clientX > cR.x + eyeGap) {
            next = "Looking right…";
          }
          setMsgSafe(next);
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      lastEvt = e;
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    const onLeave = () => {
      setMsgSafe("Where did you go?");
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

    // ─────────── Pointer handling ───────────
    if (fine) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave);
    } else {
      // Mobile: idle wander + tap per seguire il dito 1s
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

      onTap = (e) => {
        idleTl.pause();
        lastEvt = e;
        // Segui anche i movimenti del dito durante il secondo di "focus"
        window.addEventListener("pointermove", onMove, { passive: true });
        if (!rafId) rafId = requestAnimationFrame(tick);
        setTimeout(() => {
          window.removeEventListener("pointermove", onMove);
          lastEvt = null;
          onLeave();
          idleTl.resume();
        }, 1000);
      };
      window.addEventListener("pointerdown", onTap);
    }

    // ─────────── Blink sincronizzato (no sovrapposizioni) ───────────
    const scheduleBlink = () => {
      if (reduced) return;
      blinkTO = setTimeout(() => {
        if (busy) {
          scheduleBlink();
          return;
        } // rimanda se c'è un "mood" in corso
        busy = true;
        root.classList.add("blink");
        setTimeout(() => {
          root.classList.remove("blink");
          busy = false;
          scheduleBlink();
        }, 140);
      }, gsap.utils.random(2400, 5200));
    };
    scheduleBlink();

    // ─────────── MOOD: squint ───────────
    const applySquint = (dur = 700) => {
      if (busy || reduced) return;
      busy = true;
      root.classList.add("mood-squint");
      setTimeout(() => {
        root.classList.remove("mood-squint");
        busy = false;
      }, dur);
    };

    const scheduleMood = () => {
      if (reduced) return;
      moodTO = setTimeout(() => {
        if (!busy) applySquint(); // unico stato: squint
        scheduleMood();
      }, gsap.utils.random(6000, 11000));
    };
    scheduleMood();

    // Avvia il loop di track
    if (!rafId) rafId = requestAnimationFrame(tick);

    // Cleanup
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      if (onTap) window.removeEventListener("pointerdown", onTap);
      if (blinkTO) clearTimeout(blinkTO);
      if (moodTO) clearTimeout(moodTO);
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

function ConsentDialog({ open, onClose }) {
  const [analytics, setAnalytics] = useState(
    () => localStorage.getItem("consent.analytics") !== "denied" // default ON
  );

  useEffect(() => {
    if (!open) return;
    updateAnalyticsConsent(analytics);
  }, [analytics, open]);

  return (
    <dialog className="consent-dialog" open={open} onClose={onClose}>
      <form method="dialog">
        <h3 className="consent-title">Privacy preferences</h3>

        <label className="consent-row">
          <input
            type="checkbox"
            checked={analytics}
            onChange={(e) => setAnalytics(e.target.checked)}
          />
          <span>Analytics (GA4)</span>
        </label>

        <p className="consent-note">
          We use GA4 without ads or Google Signals. Toggle to opt-out.
        </p>

        <div className="consent-actions">
          <Link to="/privacy" className="legal-link" onClick={onClose}>
            Privacy
          </Link>
          <span>·</span>
          <Link to="/cookies" className="legal-link" onClick={onClose}>
            Cookies
          </Link>
          <button className="btn-primary">Close</button>
        </div>
      </form>
    </dialog>
  );
}

/* ---------- Footer ---------- */
export default function Footer() {
  const nyTime = useNYTime();
  const year = new Date().getFullYear();
  const [consentOpen, setConsentOpen] = useState(false);

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
          <span className="copyright">© {year} Marco Franco</span>
          <span className="sep sep-desktop" aria-hidden="true">
            |
          </span>{" "}
          {/* NEW */}
          <nav className="legal-links" aria-label="Legal">
            <Link to="/privacy" className="legal-link">
              Privacy
            </Link>
            <span className="sep" aria-hidden="true">
              ·
            </span>
            <Link to="/cookies" className="legal-link">
              Cookies
            </Link>
            <span className="sep" aria-hidden="true">
              ·
            </span>
            <button
              className="btn-link legal-link"
              onClick={() => setConsentOpen(true)}
            >
              Manage cookies
            </button>
          </nav>
        </div>
        <ConsentDialog
          open={consentOpen}
          onClose={() => setConsentOpen(false)}
        />

        <Eyes />
      </div>
    </footer>
  );
}
