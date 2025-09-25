// CommonJS version (no import/export). Run with: node scripts/process_zori_from_public.cjs
const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

const CANDIDATES = [
  path.join(process.cwd(), "data/zori_raw.csv"),
  path.join(process.cwd(), "public/County_zori_uc_sfrcondomfr_sm_month.csv"),
];

const OUTPUT_JSON = path.join(process.cwd(), "public/data/zori_nyc.json");

// find input
const INPUT_CSV = CANDIDATES.find(p => fs.existsSync(p));
if (!INPUT_CSV) {
  console.error("❌ Could not find CSV at:\n - " + CANDIDATES.join("\n - "));
  process.exit(1);
}
console.log("📄 Reading:", INPUT_CSV);

// read + parse
const csv = fs.readFileSync(INPUT_CSV, "utf8");
const parsed = Papa.parse(csv, { header: true, dynamicTyping: false, skipEmptyLines: true });
const rows = parsed.data;
if (!rows || !rows.length) {
  console.error("❌ CSV parsed but no rows found.");
  process.exit(1);
}

// detect columns
const sample = rows[0];
const cols = Object.keys(sample);

// state & county columns vary by Zillow export
const stateCol = ["StateName", "State", "StateAbbr", "state_name", "state"].find(k => cols.includes(k));
const countyCol = ["CountyName", "RegionName", "county_name", "region_name"].find(k => cols.includes(k));

if (!countyCol) {
  console.error("❌ Could not detect county column. First row keys:", cols.slice(0, 25));
  process.exit(1);
}

// month columns are like YYYY-MM or YYYY-MM-DD
const monthCols = cols.filter(k => /^\d{4}-\d{2}(-\d{2})?$/.test(k));
if (!monthCols.length) {
  console.error("❌ No month columns detected. First row keys:", cols.slice(0, 25));
  process.exit(1);
}

function isNY(row) {
  const rn = String(row[countyCol] || "");
  const st = stateCol ? String(row[stateCol] || "") : "";
  return st === "NY" || st === "New York" || /,\s*NY$/i.test(rn);
}

function normalizeCounty(raw) {
  if (!raw) return null;
  let s = String(raw).replace(/,\s*[A-Z]{2}$/, "").trim();
  if (!/County$/i.test(s)) s = s + " County";
  return s;
}

const countyToBorough = {
  "New York County": "Manhattan",
  "Kings County": "Brooklyn",
  "Queens County": "Queens",
  "Bronx County": "Bronx",
  "Richmond County": "Staten Island",
};

const boroughSeries = {
  Manhattan: {}, Brooklyn: {}, Queens: {}, Bronx: {}, "Staten Island": {}
};

for (const r of rows) {
  if (!isNY(r)) continue;
  const countyNorm = normalizeCounty(r[countyCol]);
  const borough = countyToBorough[countyNorm];
  if (!borough) continue;

  for (const m of monthCols) {
    const v = r[m];
    const num = v ? Number(v) : NaN;
    if (!Number.isFinite(num)) continue;
    const key = m.slice(0, 7); // YYYY-MM
    boroughSeries[borough][key] = num;
  }
}

// union months
const monthSet = new Set();
Object.values(boroughSeries).forEach(obj => Object.keys(obj).forEach(m => monthSet.add(m)));
const months = Array.from(monthSet).sort();

// output
const out = months.map(m => ({
  date: m,
  Manhattan: boroughSeries.Manhattan[m] ?? null,
  Brooklyn: boroughSeries.Brooklyn[m] ?? null,
  Queens: boroughSeries.Queens[m] ?? null,
  Bronx: boroughSeries.Bronx[m] ?? null,
  "Staten Island": boroughSeries["Staten Island"][m] ?? null,
})).filter(row => Object.values(row).some(v => v !== null));

fs.mkdirSync(path.dirname(OUTPUT_JSON), { recursive: true });
fs.writeFileSync(OUTPUT_JSON, JSON.stringify(out, null, 2));
console.log(`✅ Wrote ${OUTPUT_JSON} with ${out.length} rows`);