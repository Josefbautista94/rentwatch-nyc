import "./StabilizedMap.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import { getAffordableBuildings } from "../../services/stabilizedService";

const NYC_CENTER = [40.73, -73.94];

export default function StabilizedMap({ borough = "ALL" }) {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    getAffordableBuildings({ borough, limit: 3000 })
      .then(list => { if (!ignore) setPoints(list); })
      .catch(err => { console.error("NYC Open Data error:", err); if (!ignore) setPoints([]); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [borough]);

  return (
    <div className="stabilized-map">
      {loading && <p className="map-status">Loading buildings…</p>}
      {!loading && points.length === 0 && <p className="map-status">No buildings found.</p>}
      <MapContainer className="map-container" center={NYC_CENTER} zoom={11}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {points.map((p, i) => (
          <Marker key={`${p.bbl ?? i}-${i}`} position={[p.lat, p.lng]}>
            <Popup>
              <b>{p.name}</b><br/>
              {p.address}<br/>
              Borough: {p.borough}
              {p.status && <><br/>Status: {p.status}</>}
              {p.bin && <><br/>BIN: {p.bin}</>}
              {p.bbl && <><br/>BBL: {p.bbl}</>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}