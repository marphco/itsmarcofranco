import Hero from "./components/hero/Hero";
import Who from "./components/who/Who";
import Work from "./components/work/Work";
import Footer from "./components/footer/Footer";

/**
 * Top‑level component orchestrating the portfolio layout.
 * It simply composes the different sections.
 */
export default function App() {
  return (
    <>
      <Hero />
      <Who />
      <Work />
      <section className="footer-reveal">
        <Footer />
      </section>
    </>
  );
}
