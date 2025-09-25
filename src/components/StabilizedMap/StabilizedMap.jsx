import "./StabilizedMap.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import api from "../../services/apiClient";

export default function StabilizedMap(){
  const [points, setPoints] = useState([]);

  useEffect(()=> {
    let ignore = false;
    api.get("data/stabilized_buildings.json")
      .then(res => { if(!ignore) setPoints(res.data || []); })
      .catch(err => console.error("Failed to load buildings:", err));
    return () => { ignore = true; };
  }, []);

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