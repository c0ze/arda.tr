import content/types.{EmailLink, ExternalLink, FediverseLink, SocialLink}
import ui_types.{Bluesky, Github, Guitar, Linkedin, Mail, Mastodon}

pub const links = [
  SocialLink(
    label: "GitHub",
    url: "https://github.com/c0ze",
    icon: Github,
    kind: ExternalLink,
  ),
  SocialLink(
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/ardakaraduman/",
    icon: Linkedin,
    kind: ExternalLink,
  ),
  SocialLink(
    label: "Email",
    url: "mailto:arda@karaduman.org",
    icon: Mail,
    kind: EmailLink,
  ),
  SocialLink(
    label: "Pagan",
    url: "https://pagan.tr",
    icon: Guitar,
    kind: ExternalLink,
  ),
  SocialLink(
    label: "Mastodon",
    url: "https://mastodon.world/@arda",
    icon: Mastodon,
    kind: FediverseLink,
  ),
  SocialLink(
    label: "Bluesky",
    url: "https://bsky.app/profile/arda-karaduman.bsky.social",
    icon: Bluesky,
    kind: ExternalLink,
  ),
]
