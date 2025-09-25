import "./StabilizedMap.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";

export default function StabilizedMap(){
  const [points, setPoints] = useState([]);
  useEffect(()=>{ fetch("/data/stabilized_buildings.json").then(r=>r.json()).then(setPoints); }, []);
  return (
    <div className="stabilized-map">
      <MapContainer className="map-container" center={[40.73,-73.94]} zoom={11}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
        {points.map((p, i)=>(
          <Marker key={i} position={[p.lat, p.lng]}>
            <Popup>
              <b>{p.address}</b><br/>
              Borough: {p.borough}<br/>
              Units: {p.units ?? "N/A"}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}