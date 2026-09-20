import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { delimiter, dirname, join } from "node:path";
import { spawn, spawnSync } from "node:child_process";

const minimumVersion = [22, 13, 0];
const command = process.argv[2];
const extraArguments = process.argv.slice(3);
const allowedCommands = new Set(["dev", "build", "start"]);

if (!allowedCommands.has(command)) {
  console.error("Usage: node scripts/run-vinext.mjs <dev|build|start>");
  process.exit(1);
}

function getVersion(nodePath) {
  if (!nodePath || !existsSync(nodePath)) return null;

  const result = spawnSync(nodePath, ["--version"], { encoding: "utf8" });
  const match = result.stdout?.trim().match(/^v(\d+)\.(\d+)\.(\d+)/);
  return match ? match.slice(1).map(Number) : null;
}

function isSupported(version) {
  if (!version) return false;

  return minimumVersion.every((part, index) => {
    const earlierPartsMatch = minimumVersion
      .slice(0, index)
      .every((earlierPart, earlierIndex) => version[earlierIndex] === earlierPart);

    return !earlierPartsMatch || version[index] >= part;
  });
}

const pathCandidates = (process.env.PATH ?? "")
  .split(delimiter)
  .filter(Boolean)
  .map((directory) => join(directory, process.platform === "win32" ? "node.exe" : "node"));

const candidates = [
  process.execPath,
  process.env.CODEX_NODE_PATH,
  join(homedir(), ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"),
  "/opt/homebrew/bin/node",
  "/usr/local/bin/node",
  ...pathCandidates,
];

const runtime = [...new Set(candidates)].find((candidate) => isSupported(getVersion(candidate)));

if (!runtime) {
  console.error(
    "This project needs Node.js 22.13 or newer. Install a current Node.js LTS release, then run this command again.",
  );
  process.exit(1);
}

const vinextCli = join(process.cwd(), "node_modules/vinext/dist/cli.js");

if (!existsSync(vinextCli)) {
  console.error("Project dependencies are missing. Run npm install first.");
  process.exit(1);
}

const child = spawn(runtime, [vinextCli, command, ...extraArguments], {
  stdio: "inherit",
  env: {
    ...process.env,
    PATH: `${dirname(runtime)}${delimiter}${process.env.PATH ?? ""}`,
    WRANGLER_LOG_PATH: process.env.WRANGLER_LOG_PATH ?? ".wrangler/wrangler.log",
  },
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal));
}

child.on("error", (error) => {
  console.error(`Unable to start vinext: ${error.message}`);
  process.exit(1);
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code ?? 1);
  }
});
