#!/usr/bin/env bash
# Build the committed HEAD in a fresh clone and deploy it to the arda-tr Worker
# (arda.tr). The same steps as the build check (.github/workflows/build.yml):
# npm ci, npm run verify, npm run build. Uses your local wrangler login; run
# `npx wrangler login` once if it asks. Commit first: uncommitted changes are
# not deployed. Extra arguments go to wrangler (e.g. --dry-run --outdir DIR).
set -euo pipefail
# Node 24, as in package.json engines and the build check: the jsdom tests fail
# on Node 25+, whose built-in localStorage shadows jsdom's.
if [[ "$(node --version)" != v24.* ]]; then
  command -v mise >/dev/null && exec mise x node@24 -- "$0" "$@"
  echo "Node 24 is required (found $(node --version))" >&2
  exit 1
fi
repo="$(cd "$(dirname "$0")/.." && pwd)"
rev="$(git -C "$repo" rev-parse HEAD)"
git -C "$repo" diff --quiet HEAD || echo "note: uncommitted changes are not deployed"
mkdir -p "$HOME/tmp"
src="$(mktemp -d -p "$HOME/tmp" arda-tr-deploy.XXXXXX)"
trap 'rm -rf "${src:?}"' EXIT
# A clone, not `git archive`: the sitemap's <lastmod> is the last commit that
# touched the content (scripts/generate-sitemap.mjs), so the build needs history.
git clone -q --revision="$rev" "$repo" "$src"
cd "$src"
npm ci
npm run verify
npm run build
npx --yes wrangler@4.168.0 deploy "$@"
echo "arda.tr: done, from ${rev:0:7}"
