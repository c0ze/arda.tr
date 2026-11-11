import { execFileSync } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const distDir = path.join(projectRoot, "dist");
const outputFile = path.join(distDir, "sitemap.xml");
const siteConfigPath = path.join(projectRoot, "config", "site.config.json");
// What the page is made of. Tests are not content; generated files are
// gitignored, so they never count.
const contentPaths = ["src", ":!src/test", "public", "index.html", "config/site.config.json"];

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

/**
 * The date (YYYY-MM-DD) of the last commit that touched the page's content.
 * File mtimes won't do: the build regenerates files under src/, so they always
 * say "today". Needs full history (deploy.yml checks out with fetch-depth: 0);
 * without git, or with no matching commit, it falls back to today.
 */
export function lastModified(cwd = projectRoot) {
  try {
    const date = execFileSync("git", ["log", "-1", "--format=%cs", "--", ...contentPaths], {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (/^\d{4}-\d\d-\d\d$/.test(date)) return date;
  } catch {
    // Not a git checkout, or git is missing.
  }
  return new Date().toISOString().split("T")[0];
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
  const lastModifiedDate = lastModified();
  const sitemap = buildSitemapXml(siteConfig, lastModifiedDate);

  await fs.writeFile(outputFile, sitemap, "utf8");

  console.log(`Sitemap generated at ${outputFile}`);
  console.log(`Indexed ${siteConfig.pages.length} canonical page(s).`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error("Sitemap generation failed:", err);
    process.exit(1);
  });
}
