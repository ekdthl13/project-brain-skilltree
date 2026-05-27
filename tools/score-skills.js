const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const sourceRoot = path.join(repoRoot, "source");
const catalogPath = path.join(repoRoot, "catalog", "skills.yaml");
const reportDir = path.join(repoRoot, "reports");
const scorecardReportPath = path.join(reportDir, "skills-scorecard.md");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/, ""));
}

function readText(file) {
  return fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
}

function parseFrontmatter(text) {
  const lines = text.split(/\r?\n/);
  const fields = {};
  if (lines[0] !== "---") return { fields, body: text };
  const end = lines.findIndex((line, index) => index > 0 && line.trim() === "---");
  if (end === -1) return { fields, body: text };
  const raw = lines.slice(1, end);
  for (const line of raw) {
    const match = line.match(/^([A-Za-z0-9_-]+|[가-힣_]+):\s*(.*)$/);
    if (match) {
      fields[match[1]] = match[2].replace(/^["']|["']$/g, "").trim();
    }
  }
  return { fields, body: lines.slice(end + 1).join("\n") };
}

function calculateScore(skill, fileContent, fileDir, catalogVersion) {
  const { fields, body } = parseFrontmatter(fileContent);
  const lines = fileContent.split(/\r?\n/).length;

  let frontmatterScore = 0;
  if (fields.name) frontmatterScore += 5;
  if (fields.version) frontmatterScore += 5;
  if (fields.description) frontmatterScore += 5;
  if (skill.description && skill.description.startsWith("Use when")) frontmatterScore += 5;

  let lineCountScore = 0;
  if (lines <= 400) {
    lineCountScore = 20;
  } else if (lines <= 500) {
    lineCountScore = 10;
  } else {
    lineCountScore = 0;
  }

  const hasTrigger = /사용자 의도|의도|트리거|trigger|Trigger|언제 사용|우선 스킬|Primary Router/i.test(body);
  const triggerScore = hasTrigger ? 20 : 0;

  const hasOutput = /최소 출력|최소 산출물|출력 기준|output|Output|완료 기준|완료 조건|산출물|Definition of Done/i.test(body);
  const outputScore = hasOutput ? 20 : 0;

  const hasSupportFiles = fs.existsSync(path.join(fileDir, "REFERENCES.md")) ||
                           fs.existsSync(path.join(fileDir, "CHECKLIST.md")) ||
                           /\[[^\]]+\.md\]/i.test(body);
  const supportScore = hasSupportFiles ? 10 : 0;

  const versionAlign = fields.version === catalogVersion;
  const versionScore = versionAlign ? 10 : 0;

  const total = frontmatterScore + lineCountScore + triggerScore + outputScore + supportScore + versionScore;

  return {
    total,
    breakdown: {
      frontmatter: frontmatterScore,
      lineCount: lineCountScore,
      trigger: triggerScore,
      output: outputScore,
      support: supportScore,
      version: versionScore
    },
    lines,
    version: fields.version || "N/A"
  };
}

function main() {
  if (!fs.existsSync(catalogPath)) {
    console.error("Error: catalog/skills.yaml not found.");
    process.exit(1);
  }

  const catalog = readJson(catalogPath);
  const results = [];

  for (const skill of catalog.skills) {
    const fileDir = path.join(sourceRoot, skill.source);
    const filePath = path.join(fileDir, "SKILL.md");
    if (!fs.existsSync(filePath)) {
      results.push({
        name: skill.source,
        score: 0,
        lines: 0,
        version: "N/A",
        error: "SKILL.md file missing"
      });
      continue;
    }

    const content = readText(filePath);
    const scoreData = calculateScore(skill, content, fileDir, skill.version);
    results.push({
      name: skill.source,
      score: scoreData.total,
      lines: scoreData.lines,
      version: scoreData.version,
      breakdown: scoreData.breakdown
    });
  }

  fs.mkdirSync(reportDir, { recursive: true });

  const rows = results
    .map((r) => {
      if (r.error) {
        return `| ${r.name} | 0 | - | - | FAIL: ${r.error} |`;
      }
      const b = r.breakdown;
      const breakdownText = `FM:${b.frontmatter}, Lines:${b.lineCount}, Trig:${b.trigger}, Out:${b.output}, Supp:${b.support}, Ver:${b.version}`;
      return `| ${r.name} | ${r.score}/100 | ${r.lines} | ${r.version} | ${breakdownText} |`;
    })
    .join("\n");

  const averageScore = (results.reduce((acc, curr) => acc + curr.score, 0) / results.length).toFixed(1);

  fs.writeFileSync(
    scorecardReportPath,
    [
      "# Skill Quality Scorecard",
      "",
      `Average Quality Score: **${averageScore}/100**`,
      `- Scanned at: ${new Date().toISOString()}`,
      `- Total skills: ${results.length}`,
      "",
      "## Evaluation Matrix",
      "",
      "- **Frontmatter/Catalog (20pts)**: Valid source frontmatter keys (name, version, description) and catalog description with 'Use when' prefix.",
      "- **Line Count (20pts)**: <= 400 lines (20pts), 401-500 lines (10pts), > 500 lines (0pts).",
      "- **Trigger Clarity (20pts)**: Explicit triggers, router patterns, or user intent declarations.",
      "- **Minimum Output (20pts)**: Clear definitions of done, output checklists, or outputs schema.",
      "- **Support Files (10pts)**: Secondary support files (REFERENCES.md, CHECKLIST.md) or markdown links.",
      "- **Version Alignment (10pts)**: Frontmatter version matches catalog version exactly.",
      "",
      "## Scorecard Details",
      "",
      "| Skill Name | Total Score | Total Lines | Version | Breakdown |",
      "|------------|-------------|-------------|---------|-----------|",
      rows,
      ""
    ].join("\n"),
    "utf8"
  );

  console.log(`Wrote scorecard to ignored report: reports/skills-scorecard.md`);
  console.log(`Average quality score: ${averageScore}/100`);
}

if (require.main === module) {
  main();
}

module.exports = { calculateScore };
