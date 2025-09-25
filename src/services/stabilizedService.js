import sodan from "./nycOpenData";

// HPD: Affordable Housing Production by Building (hg8x-zxpr)
export async function getAffordableBuildings({ borough, limit = 3000, offset = 0 } = {}) {
  const where = ["latitude IS NOT NULL AND longitude IS NOT NULL"];

  if (borough && borough !== "ALL") {
    // Case-insensitive filter; handles "Staten Island" spacing too
    where.push(`upper(borough)='${borough.toUpperCase()}'`);
  }

  const params = {
    $select: [
      "project_name",
      "borough",
      "house_number",
      "street_name",
      "latitude",
      "longitude",
      "bbl",
      "bin",
      "extended_affordability_status"
    ].join(","),
    $where: where.join(" AND "),
    $limit: limit,
    $offset: offset
  };

  const { data } = await sodan.get("/hg8x-zxpr.json", { params });

  return (data || [])
    .map(r => ({
      name: r.project_name || "Affordable Housing Project",
      address: `${r.house_number ?? ""} ${r.street_name ?? ""}`.trim(),
      borough: r.borough || "N/A",
      lat: Number(r.latitude),
      lng: Number(r.longitude),
      bin: r.bin,
      bbl: r.bbl,
      status: r.extended_affordability_status || null,
    }))
    .filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lng));
}