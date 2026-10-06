import { execFile } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

import { createShanShuiGenerator } from "../src/backdrop/shanShuiGenerator.js";
import { shanShuiConfig } from "../src/backdrop/config.js";
import { lightPalette } from "../src/backdrop/palette.js";

const execFileAsync = promisify(execFile);

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const outputDirectory = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(repositoryRoot, "public", "backdrop", "chunks");

await mkdir(outputDirectory, { recursive: true });
try {
  await execFileAsync("magick", ["-version"]);
} catch (error) {
  throw new Error(
    "Backdrop chunk generation requires ImageMagick. Install it with `brew install imagemagick` and rerun `npm run backdrop:chunks`.",
    { cause: error },
  );
}

const temporaryDirectory = await mkdtemp(
  path.join(os.tmpdir(), "shan-shui-chunks-"),
);

const generator = createShanShuiGenerator({ seed: shanShuiConfig.seed });
const chunkWidth = generator.chunkWidth;
const conversions = [];

try {
  for (let index = 0; index < shanShuiConfig.savedChunkCount; index += 1) {
    const tileStart = index * chunkWidth;
    const tileEnd = tileStart + chunkWidth;
    const rangeStart = Math.max(0, tileStart - shanShuiConfig.tileGutter);
    const rangeEnd = tileEnd + shanShuiConfig.tileGutter;
    const logicalWidth = rangeEnd - rangeStart;

    generator.ensureRange(
      Math.max(0, tileStart - shanShuiConfig.generatorBuffer),
      tileEnd + shanShuiConfig.generatorBuffer,
    );
    const sceneMarkup = generator.renderRange(
      tileStart,
      tileEnd,
      shanShuiConfig.generatorBuffer,
    );
    const svg = [
      '<svg xmlns="http://www.w3.org/2000/svg"',
      ` viewBox="${rangeStart} 0 ${logicalWidth} ${shanShuiConfig.logicalHeight}"`,
      ' preserveAspectRatio="none">',
      `<g>${sceneMarkup}</g></svg>`,
    ].join("");
    const sourcePath = path.join(
      temporaryDirectory,
      `${shanShuiConfig.savedChunkFilePrefix}-${index}.svg`,
    );
    const outputPath = path.join(
      outputDirectory,
      `${shanShuiConfig.savedChunkFilePrefix}-${index}.webp`,
    );
    const pixelWidth = Math.ceil(logicalWidth * shanShuiConfig.rasterScale);
    const pixelHeight = Math.ceil(
      shanShuiConfig.logicalHeight * shanShuiConfig.rasterScale,
    );

    await writeFile(sourcePath, svg, "utf8");
    conversions.push(
      execFileAsync("magick", [
        "-background",
        lightPalette.background,
        sourcePath,
        "-resize",
        `${pixelWidth}x${pixelHeight}!`,
        "-quality",
        "82",
        outputPath,
      ]),
    );

    if (conversions.length === 3) {
      await Promise.all(conversions.splice(0));
    }
  }

  await Promise.all(conversions);
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}

console.log(
  `Generated ${shanShuiConfig.savedChunkCount} backdrop chunks in ${outputDirectory}`,
);
