// Downloads Zillow ZORI CSV (county, smoothed, seasonally adjusted, all homes+MF),
// converts it to NYC borough JSON, and writes public/data/zori_nyc.json.

const fs = require("fs");
const path = require("path");
const https = require("https");
const Papa = require("papaparse");

// NOTE: Zillow periodically changes paths. If this 404s, update the URL.
// You can find the latest on their research data page (ZORI, county, smoothed & SA).
const ZORI_COUNTY_SSA_URL =
  process.env.ZORI_URL ||
  "https://files.zillowstatic.com/research/public_csvs/zori/County_zori_uc_sfrcondomfr_sm_month.csv";

const TMP_CSV = path.join(process.cwd(), "data/zori_latest.csv");
const OUT_JSON = path.join(process.cwd(), "public/data/zori_nyc.json");

// 1) download helper
function downloadToFile(url, dest) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      res.pipe(file);
      file.on("finish", () => file.close(() => resolve(dest)));
    }).on("error", (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

// 2) county->borough transform (same robust logic we used)
function buildNYCBoroughJsonFromCsv(csv) {
  const parsed = Papa.parse(csv, { header: true, dynamicTyping: false, skipEmptyLines: true });
  const rows = parsed.data;
  if (!rows || !rows.length) throw new Error("CSV parsed but no rows");

  const sample = rows[0];
  const cols = Object.keys(sample);
  const stateCol = ["StateName", "State", "StateAbbr", "state_name", "state"].find(k => cols.includes(k));
  const countyCol = ["CountyName", "RegionName", "county_name", "region_name"].find(k => cols.includes(k));
  if (!countyCol) throw new Error("Could not detect county column: " + cols.slice(0,25).join(", "));

  const monthCols = cols.filter(k => /^\d{4}-\d{2}(-\d{2})?$/.test(k));
  if (!monthCols.length) throw new Error("No month columns found.");

  const isNY = (row) => {
    const rn = String(row[countyCol] || "");
    const st = stateCol ? String(row[stateCol] || "") : "";
    return st === "NY" || st === "New York" || /,\s*NY$/i.test(rn);
  };
  const normalizeCounty = (raw) => {
    if (!raw) return null;
    let s = String(raw).replace(/,\s*[A-Z]{2}$/, "").trim();
    if (!/County$/i.test(s)) s = s + " County";
    return s;
  };
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
    const borough = countyToBorough[normalizeCounty(r[countyCol])];
    if (!borough) continue;

    for (const m of monthCols) {
      const num = r[m] ? Number(r[m]) : NaN;
      if (!Number.isFinite(num)) continue;
      boroughSeries[borough][m.slice(0, 7)] = num; // YYYY-MM
    }
  }

  const monthSet = new Set();
  Object.values(boroughSeries).forEach(obj => Object.keys(obj).forEach(m => monthSet.add(m)));
  const months = Array.from(monthSet).sort();

  const out = months.map(m => ({
    date: m,
    Manhattan: boroughSeries.Manhattan[m] ?? null,
    Brooklyn: boroughSeries.Brooklyn[m] ?? null,
    Queens: boroughSeries.Queens[m] ?? null,
    Bronx: boroughSeries.Bronx[m] ?? null,
    "Staten Island": boroughSeries["Staten Island"][m] ?? null,
  })).filter(row => Object.values(row).some(v => v !== null));

  return out;
}

// main
(async () => {
  try {
    console.log("⬇️  Downloading ZORI:", ZORI_COUNTY_SSA_URL);
    await downloadToFile(ZORI_COUNTY_SSA_URL, TMP_CSV);
    const csv = fs.readFileSync(TMP_CSV, "utf8");
    const json = buildNYCBoroughJsonFromCsv(csv);
    fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
    fs.writeFileSync(OUT_JSON, JSON.stringify(json, null, 2));
    console.log(`✅ Wrote ${OUT_JSON} with ${json.length} rows`);
  } catch (e) {
    console.error("❌ ZORI refresh failed:", e.message);
    process.exit(1);
  }
})();