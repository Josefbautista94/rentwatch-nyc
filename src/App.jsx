import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Trends from "./pages/Trends/Trends.jsx";
import MapPage from "./pages/Map/MapPage.jsx";
import Compare from "./pages/Compare/Compare.jsx";
import About from "./pages/About/About.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="app__nav">
          <Link to="/">Trends</Link>
          <Link to="/map">Map</Link>
          <Link to="/compare">Compare</Link>
          <Link to="/about">About</Link>
        </header>
        <Routes>
          <Route path="/" element={<Trends />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}