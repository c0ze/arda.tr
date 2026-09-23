/* Copy for the status bar, the hero and the section prompts. Layout lives in
   Hero.res / Works.res; text lives here. */

type link = {
  label: string,
  href: string,
}

let host = "arda.tr"
let path = "~/"

// The status bar nav: the works on this page, then the family.
let nav: array<link> = [
  {label: "works", href: "#catalogue"},
  {label: "blog", href: "https://blog.arda.tr"},
  {label: "résumé", href: "https://resume.arda.tr"},
  {label: "ai", href: "https://ai.arda.tr"},
  {label: "lind", href: "https://lind.arda.tr"},
]

let kicker = "// systems architect · tokyo since 2004"
let nameLines = ["Arda", "Karaduman"]
let introLead = "Programmer"
let introRest = " by trade. Black metal, old machines and pine forests by choice."
let worksCta = "ls ~/works ↓"
let askCta = "ask"
let askLabel = "Ask Arda's AI"

// The tag that follows the radio mast on the ridge.
let mastCoords = "35.6518°N 139.5446°E"
let mastPlace = "調布 · CHOFU · RX ACTIVE"

let paganName = "PAGAN"
let paganNote = "atmospheric black metal"
let paganHost = "pagan.tr"
let paganHref = "https://pagan.tr"
let paganImage = "/pagan.webp"

// Shell prompts that open each section.
let shellPrompt = "arda@chofu:~$"
let worksTagline = "indexed in hex, as god intended"
let recordCommand = "cat ~/record"
