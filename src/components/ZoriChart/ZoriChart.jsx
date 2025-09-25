import "./ZoriChart.css";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function ZoriChart(){
  const [data, setData] = useState([]);
  useEffect(() => { fetch("/data/zori_nyc.json").then(r=>r.json()).then(setData); }, []);
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
    </div>
  );
}