import "./Trends.css";
import ZoriChart from "../../components/ZoriChart/ZoriChart.jsx";

export default function Trends() {
  return (
    <section className="trends">
      <h2>
        NYC Rent Trend (ZORI)
      </h2>
        <ZoriChart />
    </section>
  );
}
