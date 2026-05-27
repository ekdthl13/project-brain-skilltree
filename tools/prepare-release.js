const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const repoRoot = path.resolve(__dirname, "..");
const adapterRoot = path.join(repoRoot, "adapters");
const reportDir = path.join(repoRoot, "reports");
const manifestPath = path.join(reportDir, "release-manifest.json");
const checksumsPath = path.join(reportDir, "release-checksums.txt");

function getFilesRecursively(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of list) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getFilesRecursively(fullPath));
    } else if (entry.isFile()) {
      results.push(fullPath);
    }
  }
  return results;
}

function calculateSha256(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(content).digest("hex");
}

function main() {
  if (!fs.existsSync(adapterRoot)) {
    console.error("Error: 'adapters' directory not found. Please run 'npm run build:adapters' first.");
    process.exit(1);
  }

  fs.mkdirSync(reportDir, { recursive: true });

  const allFiles = getFilesRecursively(adapterRoot);
  const manifest = {};
  const checksumsLines = [];

  // Sort files for deterministic outputs
  allFiles.sort();

  for (const filePath of allFiles) {
    const relativePath = path.relative(adapterRoot, filePath).replace(/\\/g, "/");
    const sha256 = calculateSha256(filePath);
    const stat = fs.statSync(filePath);

    manifest[relativePath] = {
      sha256: sha256,
      sizeBytes: stat.size
    };

    checksumsLines.push(`${sha256}  ${relativePath}`);
  }

  // Write JSON manifest
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf8");

  // Write standard checksums text file
  fs.writeFileSync(checksumsPath, checksumsLines.join("\n") + "\n", "utf8");

  console.log(`Successfully generated release checksums:`);
  console.log(`- Manifest: ${path.relative(repoRoot, manifestPath).replace(/\\/g, "/")}`);
  console.log(`- Checksums list: ${path.relative(repoRoot, checksumsPath).replace(/\\/g, "/")}`);
  console.log(`Total files scanned: ${allFiles.length}`);
}

if (require.main === module) {
  main();
}

module.exports = { getFilesRecursively, calculateSha256 };
