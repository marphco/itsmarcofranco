import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import profileImg from '../../assets/marco.png';
import './Hero.css';

export default function Hero() {
  const heroRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    // Animazione di sfocatura per la foto (già presente)
    gsap.registerPlugin(ScrollTrigger);
    const image = imgRef.current;
    const hero = heroRef.current;
    if (!image || !hero) return;
    const tween = gsap.to(image, {
      filter: 'blur(20px)',
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
    return () => tween.scrollTrigger?.kill();
  }, []);

  // Genera le lettere del titolo
  const heading = 'MARCO';
  const letters = heading.split('').map((char, index) => (
    <span key={index} className="letter" style={{ '--i': index }}>
      {char}
    </span>
  ));

  return (
    <section ref={heroRef} className="hero-section">
      <h1 className="hero-word" aria-label="MARCO">{letters}</h1>
      <img
        ref={imgRef}
        src={profileImg}
        alt="Portrait of Marco"
        className="hero-overlay-image"
      />
    </section>
  );
}
