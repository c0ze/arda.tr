/* Copy for the bar, the hero and the works. Layout lives in Bar.res /
 Hero.res / Works.res; text lives here. */

type link = {
  label: string,
  href: string,
  rel: string,
  // The one link the bar sets in ember: the way to the assistant.
  accent: bool,
}

let host = "arda.tr"

// The bar's nav: the works on this page, then the family.
// rel="me" on the blog and the résumé: they are the same person's profiles.
let nav: array<link> = [
  {label: "works", href: "#catalogue", rel: "", accent: false},
  {label: "blog", href: "https://blog.arda.tr", rel: "me", accent: false},
  {label: "résumé", href: "https://resume.arda.tr", rel: "me", accent: false},
  {label: "lind", href: "https://lind.arda.tr", rel: "", accent: false},
  {label: "ask", href: "https://ai.arda.tr", rel: "", accent: true},
]

// The scheme switch names the scheme it switches to; the rest is for screen readers.
let schemeBefore = "Switch to "
let schemeDark = "dark"
let schemeLight = "light"
let schemeAfter = " scheme"

// The page's h1: the name, in blackletter, one word to a line.
let nameLines = ["Arda", "Karaduman"]
let kicker = "Systems architect · Tokyo since 2004"
let introLead = "Software and games. Also black metal."
let introRest = " At Veltra I connect legacy systems to AI."

// Works.
let worksTitle = "Works"
let sourceLabel = "source"
let noLink = " (no public link)"
// Alt text for the artwork: decorative, so empty.
let plumeAlt = ""
