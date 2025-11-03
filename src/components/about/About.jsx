import React, { useEffect, useRef } from 'react';
import './About.css';

/**
 * About section providing a brief biography and description of Marco
 * Franco.  Text blocks are set to fade‑in and slide up as they
 * enter the viewport via IntersectionObserver.  You can adjust
 * the content and styling to better suit your personal story.
 */
export default function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const elements = section.querySelectorAll('.fade-up');
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="about-section container">
      <h2 className="about-heading fade-up">About Me</h2>
      <p className="about-text fade-up">
        Hello! My name is Marco Franco and I'm a front‑end developer based in
        New York. I love turning ideas and designs into functional, accessible
        web experiences using React and the latest web standards.
      </p>
      <p className="about-text fade-up">
        When I'm not coding, I enjoy exploring new technologies, learning
        animation techniques and contributing to open‑source projects. In this
        portfolio you'll find some of my most recent work.
      </p>
    </section>
  );
}