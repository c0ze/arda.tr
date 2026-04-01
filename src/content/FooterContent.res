type socialLink = {
  name: string,
  href: string,
  rel: string,
  icon: [#Github | #Linkedin | #Mail | #Guitar | #Mastodon | #Bluesky],
}

let socialLinks: array<socialLink> = [
  {
    name: "GitHub",
    href: "https://github.com/c0ze",
    rel: "noopener noreferrer",
    icon: #Github,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/ardakaraduman/",
    rel: "noopener noreferrer",
    icon: #Linkedin,
  },
  {
    name: "Email",
    href: "mailto:arda@karaduman.org",
    rel: "",
    icon: #Mail,
  },
  {
    name: "Pagan",
    href: "https://pagan.tr",
    rel: "noopener noreferrer",
    icon: #Guitar,
  },
  {
    name: "Mastodon",
    href: "https://mastodon.world/@arda",
    rel: "me noopener noreferrer",
    icon: #Mastodon,
  },
  {
    name: "Bluesky",
    href: "https://bsky.app/profile/arda-karaduman.bsky.social",
    rel: "noopener noreferrer",
    icon: #Bluesky,
  },
]

let themeAttributionLabel = "Dracula Pro"
let themeAttributionHref = "https://draculatheme.com/pro"
