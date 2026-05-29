const assert = require("node:assert/strict");
const test = require("node:test");
const {
  extractSkillIndexVersionRows,
  validateSkillIndexVersions
} = require("./lib/skill-index");

const skills = [
  { source: "총괄매니저", version: "2.16.0" },
  { source: "코딩가이드", version: "1.7.0" },
  { source: "HyperFrames", version: "2.0.0" }
];

test("skill-index version validation accepts linked rows in different table shapes", () => {
  const index = [
    "| 순서 | 스킬 | 버전 | 역할 |",
    "|------|------|------|------|",
    "| 4 | [총괄매니저](총괄매니저/SKILL.md) | v2.16.0 | 작업 분배 |",
    "| 5 | [코딩가이드](코딩가이드/SKILL.md) | v1.7.0 | 실행 계약 |",
    "",
    "| 스킬 | 버전 | 역할 |",
    "|------|------|------|",
    "| [HyperFrames](HyperFrames/SKILL.md) | v2.0.0 | 영상 제작 |"
  ].join("\n");

  assert.deepEqual(validateSkillIndexVersions(index, skills), []);
});

test("skill-index version validation reports mismatched catalog version", () => {
  const index = "| [코딩가이드](코딩가이드/SKILL.md) | v1.6.0 | 실행 계약 |";

  assert.deepEqual(validateSkillIndexVersions(index, [{ source: "코딩가이드", version: "1.7.0" }]), [
    "source/SKILL_INDEX.md version mismatch for 코딩가이드 at line 1: expected v1.7.0, found v1.6.0"
  ]);
});

test("skill-index version validation accepts repeated rows when versions match", () => {
  const index = [
    "| [코딩가이드](코딩가이드/SKILL.md) | v1.7.0 | 실행 계약 |",
    "| [코딩가이드](코딩가이드/SKILL.md) | v1.7.0 | 중복 행 |"
  ].join("\n");

  assert.deepEqual(validateSkillIndexVersions(index, [{ source: "코딩가이드", version: "1.7.0" }]), []);
});

test("skill-index version validation reports missing rows", () => {
  const index = "| [코딩가이드](코딩가이드/SKILL.md) | v1.7.0 | 실행 계약 |";

  assert.deepEqual(validateSkillIndexVersions(index, [{ source: "암행어사", version: "2.0.0" }]), [
    "source/SKILL_INDEX.md missing version row for 암행어사"
  ]);
});

test("skill-index row extractor captures source, version, and line", () => {
  const rows = extractSkillIndexVersionRows("| 1 | [총괄매니저](총괄매니저/SKILL.md) | v2.16.0 |\n");

  assert.deepEqual(rows.get("총괄매니저"), [
    {
      line: 1,
      version: "v2.16.0",
      row: "| 1 | [총괄매니저](총괄매니저/SKILL.md) | v2.16.0 |"
    }
  ]);
});
