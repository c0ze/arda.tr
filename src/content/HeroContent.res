/* Copy for the bar, the hero and the works toolbar. Layout lives in Bar.res /
 Hero.res / Works.res; text lives here. */

type link = {
  label: string,
  href: string,
  rel: string,
}

let host = "arda.tr"

// The bar's nav: the works on this page, then the family.
// rel="me" on the blog and the résumé: they are the same person's profiles.
let nav: array<link> = [
  {label: "works", href: "#catalogue", rel: ""},
  {label: "blog", href: "https://blog.arda.tr", rel: "me"},
  {label: "résumé", href: "https://resume.arda.tr", rel: "me"},
  {label: "ask", href: "https://ai.arda.tr", rel: ""},
  {label: "lind", href: "https://lind.arda.tr", rel: ""},
]

// The scheme switch names the scheme it switches to; the rest is for screen readers.
let schemeBefore = "Switch to "
let schemeDark = "dark"
let schemeLight = "light"
let schemeAfter = " scheme"

// The page's h1, set small above the headline, with the kicker beside it.
let name = "Arda Karaduman"
let kicker = "Systems architect · Tokyo since 2004"
// The headline is the brand line. It ends in the vermilion full stop.
let headlineLines = ["Everything I make,", "in one list"]
let introLead = "Software and games. Also black metal."
let introRest = " At Veltra I connect legacy systems to AI."
let worksCta = "Browse works"
let askLabel = "Ask about Arda"

// Works toolbar.
let worksTitle = "Works"
let worksTagline = "one list, sorted by kind"
let filterLabel = "Filter by kind"
let allKinds = "All"
let viewLabel = "View"
let viewList = "List"
let viewPlates = "Plates"
let clearFilter = "Clear filter"
let featuredLabel = "Featured"
let noLink = " (no public link)"
let sourceLabel = "src"
