const { spawnSync } = require("node:child_process");

const extraArgs = process.argv.slice(2).filter((arg, index) => !(index === 0 && arg === "--"));
const result = spawnSync(
  "pnpm",
  ["exec", "playwright", "test", ...extraArgs],
  {
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      PLAYWRIGHT_CI_MODE: "local-payfast",
    },
  },
);

process.exit(result.status ?? 1);