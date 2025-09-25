import "./ComparisonTool.css";
import { useEffect, useState } from "react";

export default function ComparisonTool(){
  const [data, setData] = useState([]);
  const [a, setA] = useState("Manhattan");
  const [b, setB] = useState("Brooklyn");

  useEffect(()=>{ fetch("/data/zori_nyc.json").then(r=>r.json()).then(setData); }, []);
  const latest = data.at(-1) || {};
  const boroughs = Object.keys(latest||{}).filter(k => k !== "date");

  return (
    <div className="comparison">
      <div className="comparison__controls">
        <select value={a} onChange={e=>setA(e.target.value)}>{boroughs.map(x=><option key={x}>{x}</option>)}</select>
        <select value={b} onChange={e=>setB(e.target.value)}>{boroughs.map(x=><option key={x}>{x}</option>)}</select>
      </div>
      <div className="comparison__readout">
        <p><b>{a}:</b> {latest[a] ?? "—"}</p>
        <p><b>{b}:</b> {latest[b] ?? "—"}</p>
        {latest[a] && latest[b] && <p>Difference: {(latest[a]-latest[b]).toFixed(0)}</p>}
      </div>
    </div>
  );
}