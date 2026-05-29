function splitMarkdownTableRow(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) return null;
  return trimmed.slice(1, -1).split("|").map((cell) => cell.trim());
}

function extractSkillIndexVersionRows(indexText) {
  const rows = new Map();
  const lines = indexText.split(/\r?\n/);

  lines.forEach((line, index) => {
    const cells = splitMarkdownTableRow(line);
    if (!cells) return;

    for (let cellIndex = 0; cellIndex < cells.length; cellIndex += 1) {
      const match = cells[cellIndex].match(/\]\(([^)]+)\/SKILL\.md\)/);
      if (!match) continue;

      const source = match[1];
      const entries = rows.get(source) || [];
      entries.push({
        line: index + 1,
        version: cells[cellIndex + 1] || "",
        row: line
      });
      rows.set(source, entries);
    }
  });

  return rows;
}

function validateSkillIndexVersions(indexText, skills) {
  const failures = [];
  const rows = extractSkillIndexVersionRows(indexText);

  for (const skill of skills) {
    const entries = rows.get(skill.source) || [];
    const expected = `v${skill.version}`;

    if (entries.length === 0) {
      failures.push(`source/SKILL_INDEX.md missing version row for ${skill.source}`);
      continue;
    }

    for (const entry of entries) {
      if (entry.version !== expected) {
        failures.push(
          `source/SKILL_INDEX.md version mismatch for ${skill.source} at line ${entry.line}: ` +
          `expected ${expected}, found ${entry.version || "(empty)"}`
        );
      }
    }
  }

  return failures;
}

module.exports = {
  extractSkillIndexVersionRows,
  validateSkillIndexVersions
};
