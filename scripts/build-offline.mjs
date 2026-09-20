import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceDirectory = join(projectRoot, "offline-src");
const outputPath = process.argv[2]
  ? resolve(process.cwd(), process.argv[2])
  : join(projectRoot, "offline-dist", "pinakas-1-1000.html");

const [template, styles, bundle] = await Promise.all([
  readFile(join(sourceDirectory, "index.html"), "utf8"),
  readFile(join(sourceDirectory, "styles.css"), "utf8"),
  readFile(join(sourceDirectory, "pinakas.bundle.js"), "utf8"),
]);

const stylesheetTag = '<link rel="stylesheet" href="./styles.css" />';
const scriptTag = '<script src="./pinakas.bundle.js" defer></script>';

if (!template.includes(stylesheetTag) || !template.includes(scriptTag)) {
  throw new Error("The offline HTML template is missing its stylesheet or script placeholder.");
}

const safeBundle = bundle.replaceAll("</script", "<\\/script");
const standaloneHtml = template
  .replace(stylesheetTag, `<style>\n${styles}\n</style>`)
  .replace(scriptTag, `<script>\n${safeBundle}\n</script>`);

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, standaloneHtml, "utf8");

console.log(`Offline file created: ${outputPath}`);
