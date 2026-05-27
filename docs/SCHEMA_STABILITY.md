# Schema Stability Guidelines

This document details the schema layout, constraints, and update procedures for the repository's centralized registry: `catalog/skills.yaml`.

## Catalog Schema Structure

The `catalog/skills.yaml` file acts as the primary registry mapping human-edited canonical skill directories to portable multi-agent adapter outputs. It is structured as YAML-compatible JSON:

### Root Properties
- `version` (string): The schema version of the catalog.
- `canonicalRoot` (string): The directory containing source skills (`source`).
- `skills` (array of objects): The list of registered skills.

### Skill Properties
Each object in the `skills` array must contain exactly the following fields (no extra or missing fields are allowed):
- `id` (string): Unique identifier (e.g., `project-manager`).
- `source` (string): Case-sensitive folder name inside the canonical root (`source/`).
- `version` (string): The current version matching the skill's frontmatter version exactly.
- `category` (string): Category grouping (e.g., `orchestration`, `coding`, `verification`).
- `adapterName` (string): Lowercase hyphen slug used as the output directory name.
- `description` (string): Explicit operational description starting with the prefix `"Use when "`.

---

## Schema Stability Guard

To prevent accidental catalog modifications, directory naming issues, or formatting drift, the repository includes a strict unit test: [schema-stability.test.js](../tools/schema-stability.test.js).
This test is automatically executed as part of `npm run check` and blocks any commits that contain schema drift.

---

## Guidelines for Schema Modifications

If you need to introduce new metadata fields to the skill registry in the future, follow this sequence:

### 1. Update the Catalog Registry
Add the new field to the entries in [catalog/skills.yaml](../catalog/skills.yaml).

### 2. Update the Stability Test
Modify [tools/schema-stability.test.js](../tools/schema-stability.test.js) to:
- Add the new field name to the allowed properties list.
- Add type and format assertions for the new field.

### 3. Update the Validation Gate
If the new field requires integrity checking (e.g. cross-referencing files), update [tools/validate-skilltree.js](../tools/validate-skilltree.js).

### 4. Update the Adapter Builder
If the new field affects generated adapter frontmatter or metadata files, update [tools/build-adapters.js](../tools/build-adapters.js) to parse and package the field correctly.

### 5. Run Verification
Run local checks to verify that the modified schema is green:
```bash
npm run check
```
