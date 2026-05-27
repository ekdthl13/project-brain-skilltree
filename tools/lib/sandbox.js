const fs = require("fs");
const os = require("os");
const path = require("path");

const SANDBOX_PREFIX = "project-brain-sandbox-";

function getRepoRoot() {
  return path.resolve(__dirname, "../..");
}

function getUserHome() {
  return os.homedir();
}

function getTempDir() {
  return os.tmpdir();
}

function assertInsideSandbox(targetPath, options = {}) {
  if (!targetPath) {
    throw new Error("Safety violation: Target path is required.");
  }

  const resolvedTarget = path.resolve(targetPath);
  const tempDir = path.resolve(getTempDir());
  const repoRoot = path.resolve(options.repoRoot || getRepoRoot());
  const userHome = path.resolve(options.userHome || getUserHome());

  // 1. Filesystem Root check
  const parsed = path.parse(resolvedTarget);
  if (resolvedTarget === parsed.root) {
    throw new Error(`Safety violation: Refusing filesystem root path: ${resolvedTarget}`);
  }

  // 2. OS Temp Directory itself check
  if (resolvedTarget === tempDir) {
    throw new Error(`Safety violation: Refusing OS temporary directory itself: ${resolvedTarget}`);
  }

  // Helper flags
  const relativeFromTemp = path.relative(tempDir, resolvedTarget);
  const isInsideTemp = !relativeFromTemp.startsWith("..") && !path.isAbsolute(relativeFromTemp);
  const firstSegment = relativeFromTemp.split(path.sep)[0];
  const hasPrefix = firstSegment && firstSegment.startsWith(SANDBOX_PREFIX);


  // 3. User Home check
  if (resolvedTarget === userHome) {
    throw new Error(`Safety violation: Refusing user home directory: ${resolvedTarget}`);
  }
  const isTempInsideHome = tempDir.startsWith(userHome + path.sep);
  if (resolvedTarget.startsWith(userHome + path.sep)) {
    const isAllowedTempSubpath = isTempInsideHome && isInsideTemp;
    if (!isAllowedTempSubpath) {
      throw new Error(`Safety violation: Refusing path within user home directory: ${resolvedTarget}`);
    }
  }

  // 4. Current Repo Workspace Root check
  if (resolvedTarget === repoRoot) {
    throw new Error(`Safety violation: Refusing repository workspace root: ${resolvedTarget}`);
  }
  const isTempInsideRepo = tempDir.startsWith(repoRoot + path.sep);
  if (resolvedTarget.startsWith(repoRoot + path.sep)) {
    const isAllowedTempSubpath = isTempInsideRepo && isInsideTemp;
    if (!isAllowedTempSubpath) {
      throw new Error(`Safety violation: Refusing path within repository workspace root: ${resolvedTarget}`);
    }
  }

  // 5. Final sandbox correctness check (must be inside temp and contain prefix)
  const isValidSandbox = isInsideTemp && hasPrefix;
  if (!isValidSandbox) {
    throw new Error(`Safety violation: Target path is not a valid sandbox path (must be inside temp directory and contain prefix '${SANDBOX_PREFIX}'): ${resolvedTarget}`);
  }



  return resolvedTarget;
}

function createSandbox(options = {}) {
  const tempDir = getTempDir();
  const rand = Math.random().toString(36).substring(2, 10);
  const sandboxPath = path.join(tempDir, `${SANDBOX_PREFIX}${rand}`);
  
  fs.mkdirSync(sandboxPath, { recursive: true });
  return sandboxPath;
}

function cleanSandbox(sandboxPath, options = {}) {
  const resolved = assertInsideSandbox(sandboxPath, options);
  if (fs.existsSync(resolved)) {
    fs.rmSync(resolved, { recursive: true, force: true });
  }
  return resolved;
}

module.exports = {
  SANDBOX_PREFIX,
  createSandbox,
  assertInsideSandbox,
  cleanSandbox
};
