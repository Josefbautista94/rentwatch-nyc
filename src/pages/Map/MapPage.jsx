import "./MapPage.css";
import { useState } from "react";
import BoroughFilter from "../../components/BoroughFilter/BoroughFilter.jsx";
import StabilizedMap from "../../components/StabilizedMap/StabilizedMap.jsx";

export default function MapPage() {
  const [borough, setBorough] = useState("ALL");
  return (
    <section className="map-page">
      <h2>Rent‑Stabilized Buildings (NYC)</h2>
      <BoroughFilter value={borough} onChange={setBorough} />
      <StabilizedMap borough={borough} />
    </section>
  );
}