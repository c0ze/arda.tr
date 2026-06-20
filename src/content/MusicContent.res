type project = {
  title: string,
  description: string,
  image: string,
  link: string,
  tags: array<string>,
  kind: [#Band | #Project],
  invertOnLight: bool,
}

type socialLink = {
  name: string,
  url: string,
  icon: [#Disc | #Music],
}

let eyebrow = "05 — Music"
let title = "Music Projects"
let description = "My musical endeavors, from atmospheric black metal to elven laments."

let projects: array<project> = [
  {
    title: "Pagan",
    description: "Atmospheric Black Metal from Turkey. Dark, melodic, and aggressive.",
    image: "/pagan.webp",
    link: "https://pagan.tr",
    tags: ["Black Metal", "Atmospheric", "Turkish Metal"],
    kind: #Band,
    invertOnLight: true,
  },
  {
    title: "The Seventh Shadow",
    description: "AI Generated Gothic Metal exploring themes of alienation and artificiality.",
    image: "/7th-shadow.webp",
    link: "https://distrokid.com/hyperfollow/the7thshadow/alienation-by-design-2",
    tags: ["Gothic Metal", "AI Music", "Experimental"],
    kind: #Project,
    invertOnLight: false,
  },
  {
    title: "Arda",
    description: "Elven laments in J.R.R. Tolkien's Sindarin, written in Tengwar with English translations.",
    image: "/arda.webp",
    link: "https://lind.arda.tr",
    tags: ["Elvish", "Sindarin", "AI Music", "Dark Folk"],
    kind: #Project,
    invertOnLight: false,
  },
]

let socialLinks: array<socialLink> = [
  {
    name: "Discogs",
    url: "https://www.discogs.com/artist/5627323-Arda-Karaduman",
    icon: #Disc,
  },
  {
    name: "Metal Archives",
    url: "https://www.metal-archives.com/artists/Talciron/36967",
    icon: #Music,
  },
  {
    name: "Last.fm",
    url: "https://www.last.fm/user/c0ze",
    icon: #Music,
  },
]

let kindLabel = kind =>
  switch kind {
  | #Band => "Band"
  | #Project => "Project"
  }
