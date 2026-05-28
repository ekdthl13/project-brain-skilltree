const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "..");
const version = require("../package.json").version;
const reportDir = path.join(repoRoot, "reports");

function calculateSha256(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(content).digest("hex");
}

function zipFolder(src, destZip) {
  // powershell's Compress-Archive needs the src path to point to contents: e.g. path\*
  // Also we enforce -Force parameter to overwrite if target exists.
  const psCmd = `powershell -Command "Compress-Archive -Path '${src}' -DestinationPath '${destZip}' -Force"`;
  try {
    execSync(psCmd, { stdio: "inherit" });
  } catch (err) {
    throw new Error(`PowerShell Compress-Archive failed on src '${src}': ${err.message}`);
  }
}

function main() {
  console.log(`\n========================================================`);
  console.log(`       PACKAGING RELEASE ARCHIVES FOR v${version}       `);
  console.log(`========================================================`);
  
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const targets = [
    { 
      src: path.join(repoRoot, "adapters", "*"), 
      zipName: `project-brain-skilltree-v${version}-adapters.zip` 
    },
    { 
      src: path.join(repoRoot, "adapters", "antigravity", "skills", "*"), 
      zipName: `project-brain-skilltree-v${version}-antigravity-skills.zip` 
    },
    { 
      src: path.join(repoRoot, "adapters", "codex", "skills", "*"), 
      zipName: `project-brain-skilltree-v${version}-codex-skills.zip` 
    },
    { 
      src: path.join(repoRoot, "adapters", "claude-code", "skills", "*"), 
      zipName: `project-brain-skilltree-v${version}-claude-code-skills.zip` 
    },
  ];

  const checksumLines = [];

  for (const t of targets) {
    const destZip = path.join(reportDir, t.zipName);
    if (fs.existsSync(destZip)) {
      console.log(`Removing pre-existing archive: ${t.zipName}`);
      fs.rmSync(destZip);
    }
    
    console.log(`Creating archive: ${t.zipName}...`);
    zipFolder(t.src, destZip);
    
    if (!fs.existsSync(destZip)) {
      throw new Error(`Failed to verify generated zip archive existence: ${destZip}`);
    }

    const hash = calculateSha256(destZip);
    checksumLines.push(`${hash}  ${t.zipName}`);
  }

  const checksumFile = path.join(reportDir, "release-artifact-checksums.txt");
  fs.writeFileSync(checksumFile, checksumLines.join("\n") + "\n", "utf8");
  
  console.log(`\n🎉 RELEASE ARCHIVES PACKAGED SUCCESSFULLY! 🎉`);
  console.log(`Wrote artifact checksums to reports/release-artifact-checksums.txt:`);
  console.log(checksumLines.map(line => `  ${line}`).join("\n"));
  console.log(`========================================================\n`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`\n❌ Packaging Failed: ${error.message}\n`);
    process.exit(1);
  }
}

module.exports = { calculateSha256 };
