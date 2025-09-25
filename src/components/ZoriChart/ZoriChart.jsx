import "./ZoriChart.css";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import api from "../../services/apiClient";

export default function ZoriChart(){
  const [data, setData] = useState([]);
  useEffect(() => {
    let ignore = false;
    api.get("data/zori_nyc.json")
      .then(res => { if(!ignore) setData(res.data || []); })
      .catch(err => console.error("Failed to load ZORI:", err));
    return () => { ignore = true; };
  }, []);

  const last = data.at(-1);
  return (
    <div className="zori-chart">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="Manhattan" />
          <Line type="monotone" dataKey="Brooklyn" />
          <Line type="monotone" dataKey="Queens" />
          <Line type="monotone" dataKey="Bronx" />
          <Line type="monotone" dataKey="Staten Island" />
        </LineChart>
      </ResponsiveContainer>
            {last?.date && <p style={{marginTop:8, fontSize:12}}>Last updated: {last.date}</p>}
    </div>
  );
}