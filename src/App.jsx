import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "./Home.jsx";
import Privacy from "./components/legal/Privacy.jsx";
import Cookies from "./components/legal/Cookies.jsx";
import { trackPageview } from "./lib/ga.js";

function RouteTracker() {
  const loc = useLocation();
  useEffect(() => {
    // pageview GA4 per SPA
    trackPageview(loc.pathname + loc.search);
    // scroll-to-top per le pagine legali
    window.scrollTo({ top: 0, behavior: "instant" in HTMLDivElement ? "instant" : "auto" });
  }, [loc]);
  return null;
}

export default function App() {
  return (
    <>
      <RouteTracker />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
