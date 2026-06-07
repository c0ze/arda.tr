// Fetches the latest posts from blog.arda.tr's RSS feed and parses them in the
// browser into a small plain-data array for the Blog section. The feed sends
// `access-control-allow-origin: *`, so this cross-origin fetch works; running it
// client-side keeps the section fresh without rebuilding arda.tr.

const FEED = "https://blog.arda.tr/rss.xml";

function stripHtml(s) {
  return String(s || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function fmtDate(s) {
  const d = new Date(s);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export async function fetchLatest(limit) {
  const n = limit || 3;
  const res = await fetch(FEED, { headers: { Accept: "application/xml" } });
  if (!res.ok) throw new Error("rss " + res.status);
  const xml = await res.text();
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  if (doc.querySelector("parsererror")) throw new Error("rss parse error");

  const items = Array.prototype.slice.call(doc.querySelectorAll("item"), 0, n);
  return items.map((it) => {
    const text = (sel) => {
      const el = it.querySelector(sel);
      return el && el.textContent ? el.textContent.trim() : "";
    };
    const enclosure = it.querySelector("enclosure");
    const ex = stripHtml(text("description"));
    return {
      title: text("title"),
      link: text("link"),
      date: fmtDate(text("pubDate")),
      image: enclosure ? enclosure.getAttribute("url") || "" : "",
      excerpt: ex.length > 160 ? ex.slice(0, 157).trimEnd() + "…" : ex,
    };
  });
}
