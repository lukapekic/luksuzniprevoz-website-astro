import { mkdir, readFile, writeFile } from "node:fs/promises";
import { stdout } from "node:process";
import { URL, fileURLToPath } from "node:url";
import subsetFont from "subset-font";

const outputDirectory = new URL("../src/assets/fonts/", import.meta.url);
const serbianLatinExtendedGlyphs = "ĆČĐŠŽćčđšž";

const subsets = [
  {
    source: "@fontsource/inter-tight/files/inter-tight-latin-ext-400-normal.woff2",
    output: "inter-tight-serbian-ext-400-normal.woff2",
  },
  {
    source: "@fontsource/inter-tight/files/inter-tight-latin-ext-700-normal.woff2",
    output: "inter-tight-serbian-ext-700-normal.woff2",
  },
  {
    source: "@fontsource-variable/manrope/files/manrope-latin-ext-wght-normal.woff2",
    output: "manrope-serbian-ext-wght-normal.woff2",
  },
];

await mkdir(outputDirectory, { recursive: true });

for (const { source, output } of subsets) {
  const sourceUrl = import.meta.resolve(source);
  const sourceBuffer = await readFile(fileURLToPath(sourceUrl));
  const subsetBuffer = await subsetFont(sourceBuffer, serbianLatinExtendedGlyphs, {
    targetFormat: "woff2",
  });
  const outputUrl = new URL(output, outputDirectory);
  await writeFile(outputUrl, subsetBuffer);
  stdout.write(`${output}: ${sourceBuffer.byteLength} -> ${subsetBuffer.byteLength} bytes\n`);
}
