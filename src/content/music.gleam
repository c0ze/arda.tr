import content/types.{ExternalLink, MusicProject, SocialLink}
import ui_types.{Disc, Music}

pub const projects = [
  MusicProject(
    title: "Pagan",
    description: "Atmospheric Black Metal from Turkey. Dark, melodic, and aggressive.",
    image: "/pagan.jpg",
    link: "https://pagan.tr",
    tags: ["Black Metal", "Atmospheric", "Turkish Metal"],
    kind: "Band",
  ),
  MusicProject(
    title: "The Seventh Shadow",
    description: "AI Generated Gothic Metal exploring themes of alienation and artificiality.",
    image: "/7th-shadow.jpg",
    link: "https://distrokid.com/hyperfollow/the7thshadow/alienation-by-design-2",
    tags: ["Gothic Metal", "AI Music", "Experimental"],
    kind: "Project",
  ),
]

pub const links = [
  SocialLink(
    label: "Discogs",
    url: "https://www.discogs.com/artist/5627323-Arda-Karaduman",
    icon: Disc,
    kind: ExternalLink,
  ),
  SocialLink(
    label: "Metal Archives",
    url: "https://www.metal-archives.com/artists/Talciron/36967",
    icon: Music,
    kind: ExternalLink,
  ),
  SocialLink(
    label: "Last.fm",
    url: "https://www.last.fm/user/c0ze",
    icon: Music,
    kind: ExternalLink,
  ),
]
