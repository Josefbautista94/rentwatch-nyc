import "./BoroughFilter.css";

export default function BoroughFilter({ value, onChange }) {
  return (
    <div className="borough-filter">
      <label>
        Borough:&nbsp;
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="ALL">All</option>
          <option value="MANHATTAN">Manhattan</option>
          <option value="BROOKLYN">Brooklyn</option>
          <option value="QUEENS">Queens</option>
          <option value="BRONX">Bronx</option>
          <option value="STATEN ISLAND">Staten Island</option>
        </select>
      </label>
    </div>
  );
}