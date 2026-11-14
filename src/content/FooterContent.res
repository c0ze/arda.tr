type socialLink = {
  name: string,
  href: string,
  rel: string,
  icon: [#Github | #Linkedin | #Mail | #Guitar | #Site | #Mastodon | #Bluesky],
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
  // The family's single link to the coze.org sites (PRODUCT.md).
  {
    name: "coze.org",
    href: "https://coze.org",
    rel: "",
    icon: #Site,
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

// Closing call-to-action.
let ctaTitle = "Contact"
let ctaText = "Open to collaborations, in code or music."
let builtNote = "made in tokyo with rescript and react"
