import React from 'react';
import Hero from './components/hero/Hero';
import Who from "./components/who/Who";
import About from './components/about/About';
import Portfolio from './components/portfolio/Portfolio';
import Footer from './components/footer/Footer';

/**
 * Top‑level component orchestrating the portfolio layout.
 * It simply composes the different sections.
 */
export default function App() {
  return (
    <>
      <Hero />
      <Who />
      <About />
      <Portfolio />
      <Footer />
    </>
  );
}