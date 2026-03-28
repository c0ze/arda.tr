import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const distDir = path.join(projectRoot, "dist");
const outputFile = path.join(distDir, "sitemap.xml");
const siteConfigPath = path.join(projectRoot, "config", "site.config.json");
const contentRoots = [path.join(projectRoot, "src"), path.join(projectRoot, "public"), path.join(projectRoot, "index.html")];

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

async function collectFiles(entryPath) {
  const stat = await fs.stat(entryPath);

  if (!stat.isDirectory()) {
    return [entryPath];
  }

  const entries = await fs.readdir(entryPath, { withFileTypes: true });
  const nested = await Promise.all(
    entries
      .filter((entry) => !entry.name.startsWith("."))
      .map((entry) => collectFiles(path.join(entryPath, entry.name))),
  );

  return nested.flat();
}

async function getLastModifiedDate() {
  const files = (await Promise.all(contentRoots.map((entry) => collectFiles(entry)))).flat();
  const mtimes = await Promise.all(files.map(async (filePath) => (await fs.stat(filePath)).mtimeMs));
  const newestTimestamp = Math.max(...mtimes);

  return new Date(newestTimestamp).toISOString().split("T")[0];
}

function buildSitemapXml(siteConfig, lastModifiedDate) {
  const urlEntries = siteConfig.pages
    .map(({ path: pagePath, changefreq, priority }) => {
      const location = `${siteConfig.site.url}${pagePath}`;

      return `  <url>
    <loc>${escapeXml(location)}</loc>
    <lastmod>${lastModifiedDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;
}

async function main() {
  const siteConfig = JSON.parse(await fs.readFile(siteConfigPath, "utf8"));
  await fs.mkdir(distDir, { recursive: true });
  const lastModifiedDate = await getLastModifiedDate();
  const sitemap = buildSitemapXml(siteConfig, lastModifiedDate);

  await fs.writeFile(outputFile, sitemap, "utf8");

  console.log(`Sitemap generated at ${outputFile}`);
  console.log(`Indexed ${siteConfig.pages.length} canonical page(s).`);
}

main().catch((err) => {
  console.error("Sitemap generation failed:", err);
  process.exit(1);
});
