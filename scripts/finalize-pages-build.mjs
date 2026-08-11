import { renameSync } from "node:fs";
import { resolve } from "node:path";

renameSync(
  resolve("dist/europa-flow/europa-flow.entry.html"),
  resolve("dist/europa-flow/index.html")
);
