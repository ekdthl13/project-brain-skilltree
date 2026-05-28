const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const { calculateScore } = require("./score-skills.js");

function tempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "skilltree-score-"));
}

test("score-skills calculateScore computes expected scores", () => {
  const dir = tempDir();

  // A perfect skill setup
  const perfectContent = [
    "---",
    "name: perfect-skill",
    "version: 1.0.0",
    "description: Use when doing perfect things.",
    "---",
    "# Perfect Skill",
    "## 사용자 의도",
    "User wants perfection.",
    "## 최소 출력",
    "Perfect output format."
  ].join("\n");

  const skill = { source: "Perfect", version: "1.0.0", description: "Use when doing perfect things." };
  const res = calculateScore(skill, perfectContent, dir, "1.0.0");

  assert.equal(res.total, 90); // 20 FM, 20 Lines, 20 Trigger, 20 Output, 0 Support (no support file yet), 10 Version
  assert.equal(res.breakdown.frontmatter, 20);
  assert.equal(res.breakdown.lineCount, 20);
  assert.equal(res.breakdown.trigger, 20);
  assert.equal(res.breakdown.output, 20);
  assert.equal(res.breakdown.support, 0);
  assert.equal(res.breakdown.version, 10);
});

test("score-skills calculateScore handles line limit transitions", () => {
  const dir = tempDir();

  // Create a content of 450 lines to trigger line count score reduction (10 points)
  const linesArray = [
    "---",
    "name: limit-skill",
    "version: 1.0.0",
    "description: Use when checking limits.",
    "---"
  ];
  for (let i = 0; i < 445; i++) {
    linesArray.push(`line ${i}`);
  }
  const content = linesArray.join("\n");

  const skill = { source: "Limit", version: "1.0.0", description: "Use when checking limits." };
  const res = calculateScore(skill, content, dir, "1.0.0");

  assert.equal(res.breakdown.lineCount, 10); // 401-500 lines awards 10 points
});

test("score-skills calculateScore handles line limit transition above 500 lines", () => {
  const dir = tempDir();
  const linesArray = [
    "---",
    "name: over-limit-skill",
    "version: 1.0.0",
    "description: Use when checking limits.",
    "---"
  ];
  for (let i = 0; i < 505; i++) {
    linesArray.push(`line ${i}`);
  }
  const content = linesArray.join("\n");

  const skill = { source: "Limit", version: "1.0.0", description: "Use when checking limits." };
  const res = calculateScore(skill, content, dir, "1.0.0");

  assert.equal(res.breakdown.lineCount, 0); // >500 lines awards 0 points
});

test("score-skills calculateScore detects missing trigger and output sections", () => {
  const dir = tempDir();
  const content = [
    "---",
    "name: low-score-skill",
    "version: 1.0.0",
    "description: Use when checking low score.",
    "---",
    "# Minimal Skill Content",
    "No tr_gg_r keyword here",
    "No outp_t checklist here"
  ].join("\n");

  const skill = { source: "LowScore", version: "1.0.0", description: "Use when checking low score." };
  const res = calculateScore(skill, content, dir, "1.0.0");

  assert.equal(res.breakdown.trigger, 0);
  assert.equal(res.breakdown.output, 0);
});
