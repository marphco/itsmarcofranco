import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Portfolio.css';

/**
 * Data describing each project in the portfolio.  Update this
 * array with your own projects.  Each project must have a
 * title, description, repoLink and liveLink.
 */
const projects = [
  {
    title: 'Project One',
    description: 'A short description of the first project. Built with React and Vite.',
    repoLink: '#',
    liveLink: '#',
  },
  {
    title: 'Project Two',
    description:
      'This project demonstrates advanced use of CSS animations and user interactions.',
    repoLink: '#',
    liveLink: '#',
  },
  {
    title: 'Project Three',
    description:
      'A responsive web application with API integration and state management.',
    repoLink: '#',
    liveLink: '#',
  },
  {
    title: 'Project Four',
    description: 'A sleek landing page built with minimal design and optimised performance.',
    repoLink: '#',
    liveLink: '#',
  },
];

/**
 * Splits the projects into a specified number of columns and returns
 * an array of arrays.  This helper ensures that the vertical scroll
 * columns have roughly the same number of items.
 */
function splitIntoColumns(items, numColumns) {
  const columns = Array.from({ length: numColumns }, () => []);
  items.forEach((item, index) => {
    columns[index % numColumns].push(item);
  });
  return columns;
}

export default function Portfolio() {
  // Always render three columns for consistency.  Projects are
  // distributed evenly across the columns.
  const numColumns = 3;
  const columns = splitIntoColumns(projects, numColumns);
  const columnsRef = useRef([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    columnsRef.current.forEach((col, idx) => {
      if (!col) return;
      const inner = col.querySelector('.marquee-inner');
      // Reset transform to ensure correct start position
      gsap.set(inner, { yPercent: 0 });
      // Animate the inner container upward as the user scrolls.  The
      // ScrollTrigger scrub synchronises the animation to the scroll
      // position.  We animate to -50% because the content is
      // duplicated.
      gsap.fromTo(
        inner,
        { yPercent: 0 },
        {
          yPercent: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: col,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    });
    return () => {
      // Clean up scroll triggers when the component unmounts
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section className="portfolio-section">
      <div className="container">
        <h2 className="portfolio-heading fade-up">My Work</h2>
        <p className="portfolio-subheading fade-up">
          A selection of my recent projects. Each column scrolls upward as you
          move down the page.
        </p>
        <div className="marquee-columns">
          {columns.map((columnItems, idx) => (
            <div
              key={idx}
              className="marquee-column"
              ref={el => (columnsRef.current[idx] = el)}
            >
              <div className="marquee-inner">
                {columnItems.concat(columnItems).map((project, i) => (
                  <div key={i} className="project-card">
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-desc">{project.description}</p>
                    <div className="project-buttons">
                      <a
                        href={project.repoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn"
                      >
                        Repo
                      </a>
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                      >
                        Live
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}