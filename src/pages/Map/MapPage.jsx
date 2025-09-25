import "./MapPage.css";
import StabilizedMap from "../../components/StabilizedMap/StabilizedMap.jsx";

export default function MapPage() {
  return (
    <section className="map-page">
      <h2>Rent-Stabilized Buildings (NYC)</h2>
      <StabilizedMap />
    </section>
  );
}
