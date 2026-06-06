const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");

const csvPath = path.join(__dirname, "reviews.csv");
const csvText = fs.readFileSync(csvPath, "utf8");

function isValidHandle(handle) {
  return (
    typeof handle === "string" &&
    handle.length > 0 &&
    handle.length <= 255 &&
    /^[a-z0-9\-]+$/.test(handle)
  );
}

const allRows = parse(csvText, {
  columns: true,
  skip_empty_lines: true,
  trim: true,
  bom: true
});

const byHandle = {};
let skippedCount = 0;

allRows.forEach((row, i) => {
  const handle = (row["product_handle"] || "").trim();
  const status = (row["status"] || "").toLowerCase().trim();

  if (!isValidHandle(handle)) {
    console.log("Skipping row " + (i + 2) + " — invalid handle: " + handle.substring(0, 80));
    skippedCount++;
    return;
  }

  if (status === "pending") return;

  if (!byHandle[handle]) byHandle[handle] = [];

  const clean = {};
  Object.keys(row).forEach(k => {
    if (k !== "synced") clean[k] = row[k];
  });
  byHandle[handle].push(clean);
});

// ── Write one JSON file per product handle ────────────────────
const outDir = path.join(__dirname, "reviews");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

let count = 0;
Object.entries(byHandle).forEach(([handle, reviews]) => {
  const filePath = path.join(outDir, handle + ".json");
  fs.writeFileSync(filePath, JSON.stringify(reviews), "utf8");
  count++;
});

console.log("✓ Done! Generated " + count + " JSON files.");
console.log("⚠ Skipped " + skippedCount + " rows with invalid handles.");