type project = {
  title: string,
  description: string,
  image: string,
  link: string,
  tags: array<string>,
  kind: [#Band | #Project],
}

type socialLink = {
  name: string,
  url: string,
  icon: [#Disc | #Music],
}

let eyebrow = "05 — Music"
let title = "Music Projects"
let description = "My musical endeavors and contributions to the metal scene."

let projects: array<project> = [
  {
    title: "Pagan",
    description: "Atmospheric Black Metal from Turkey. Dark, melodic, and aggressive.",
    image: "/pagan.jpg",
    link: "https://pagan.tr",
    tags: ["Black Metal", "Atmospheric", "Turkish Metal"],
    kind: #Band,
  },
  {
    title: "The Seventh Shadow",
    description: "AI Generated Gothic Metal exploring themes of alienation and artificiality.",
    image: "/7th-shadow.jpg",
    link: "https://distrokid.com/hyperfollow/the7thshadow/alienation-by-design-2",
    tags: ["Gothic Metal", "AI Music", "Experimental"],
    kind: #Project,
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
